const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

let db;
let usersCollection;

// Connect to MongoDB
MongoClient.connect(MONGO_URI)
    .then(client => {
        console.log('✅ Connected to MongoDB');
        db = client.db('atbu_hub');
        usersCollection = db.collection('users');
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ============================================
// SIGN UP ROUTE
// ============================================
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { fullName, email, password, department, matricNumber } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            fullName,
            email,
            password: hashedPassword,
            department: department || null,
            matricNumber: matricNumber || null,
            createdAt: new Date(),
            lastLogin: null,
            totalConfessions: 0,
            totalComments: 0
        };

        const result = await usersCollection.insertOne(newUser);

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: result.insertedId.toString(),
                email: email
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: result.insertedId.toString(),
                fullName,
                email,
                department,
                matricNumber
            }
        });

    } catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error. Please try again.'
        });
    }
});

// ============================================
// SIGN IN ROUTE
// ============================================
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        // Find user by email
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Update last login
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return success response
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                department: user.department,
                matricNumber: user.matricNumber
            }
        });

    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error. Please try again.'
        });
    }
});

// ============================================
// PROTECTED ROUTE MIDDLEWARE
// ============================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Example protected route
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await usersCollection.findOne(
            { _id: new ObjectId(req.user.userId) },
            { projection: { password: 0 } } // Don't send password
        );
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================
// ADMIN ROUTE: Access User Account (FOR COURT CASES)
// ============================================
app.post('/api/admin/access-account', authenticateToken, async (req, res) => {
    try {
        const { targetEmail, adminPassword, reason } = req.body;

        // First, verify the requesting user is an admin
        const requestingUser = await usersCollection.findOne({
            _id: new ObjectId(req.user.userId)
        });

        // Check if user is admin (you need to add isAdmin field to user schema)
        if (!requestingUser.isAdmin) {
            return res.status(403).json({
                error: 'Unauthorized. Admin access required.'
            });
        }

        // Verify admin's own password for extra security
        const isAdminPasswordValid = await bcrypt.compare(
            adminPassword,
            requestingUser.password
        );

        if (!isAdminPasswordValid) {
            return res.status(401).json({ error: 'Invalid admin password' });
        }

        // Find target user
        const targetUser = await usersCollection.findOne({ email: targetEmail });

        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Log this access for audit trail
        await db.collection('admin_access_logs').insertOne({
            adminId: requestingUser._id,
            adminEmail: requestingUser.email,
            targetUserId: targetUser._id,
            targetEmail: targetUser.email,
            reason: reason,
            timestamp: new Date(),
            action: 'account_access'
        });

        // Generate temporary access token for the target user
        const tempToken = jwt.sign(
            {
                userId: targetUser._id.toString(),
                email: targetUser.email,
                isAdminAccess: true
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Temporary access expires in 1 hour
        );

        res.json({
            success: true,
            message: 'Account access granted',
            tempToken,
            targetUser: {
                id: targetUser._id.toString(),
                fullName: targetUser.fullName,
                email: targetUser.email,
                department: targetUser.department,
                matricNumber: targetUser.matricNumber
            }
        });

    } catch (error) {
        console.error('Admin access error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});