import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    const result = await signin(formData.email, formData.password);

    if (result.success) {
      alert(`Welcome back, ${result.user.fullName}! 🎉`);
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
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
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[hsl(346,84%,56%)] to-[hsl(346,84%,46%)] rounded-2xl mb-4 shadow-lg shadow-[hsl(346,84%,56%)]/50">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to ATBU Hub</p>
          </div>

          {/* Sign In Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(346,84%,56%)] focus:ring-2 focus:ring-[hsl(346,84%,56%)]/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
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

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-white/5" />
                  Remember me
                </label>
                <button type="button" className="text-[hsl(346,84%,66%)] hover:text-[hsl(346,84%,56%)] transition-colors">
                  Forgot password?
                </button>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Switch to Sign Up */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <a href="/signup" className="text-[hsl(346,84%,66%)] hover:text-[hsl(346,84%,56%)] font-semibold transition-colors">
                  Sign Up
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}