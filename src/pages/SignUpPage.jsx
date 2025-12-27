import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap, Hash, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    matricNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Architecture',
    'Medicine',
    'Pharmacy',
    'Law',
    'Mass Communication',
    'Economics',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    const result = await signup(formData);

    if (result.success) {
      alert(`Welcome to ATBU Hub, ${result.user.fullName}! 🎉`);
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(210,45%,12%)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(346,84%,56%)]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(346,84%,56%)]/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[hsl(346,84%,56%)] to-[hsl(346,84%,46%)] rounded-2xl mb-4 shadow-lg shadow-[hsl(346,84%,56%)]/50">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Join ATBU Hub</h1>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          {/* Sign Up Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Department & Matric Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Department (Optional)
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-800">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Matric Number (Optional)
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="matricNumber"
                      value={formData.matricNumber}
                      onChange={handleChange}
                      placeholder="ATB/2020/12345"
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(346,84%,56%)] focus:ring-2 focus:ring-[hsl(346,84%,56%)]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-600 bg-white/5" 
                />
                <label className="text-xs text-gray-400">
                  I agree to the <span className="text-[hsl(346,84%,66%)] hover:text-[hsl(346,84%,56%)] cursor-pointer">Terms of Service</span> and <span className="text-[hsl(346,84%,66%)] hover:text-[hsl(346,84%,56%)] cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[hsl(346,84%,56%)] to-[hsl(346,84%,46%)] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[hsl(346,84%,56%)]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Switch to Sign In */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <a href="/signin" className="text-[hsl(346,84%,66%)] hover:text-[hsl(346,84%,56%)] font-semibold transition-colors">
                  Sign In
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}