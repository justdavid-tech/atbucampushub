import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('current_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sign in function
  const signin = async (email, password) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('current_user', JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Sign up function
  const signup = async (formData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('current_user', JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Sign out function
  const signout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const value = {
    user,
    token,
    loading,
    signin,
    signup,
    signout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
