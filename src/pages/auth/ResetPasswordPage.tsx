import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const token = searchParams.get('token');

  // Password validation function
  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      toast.error('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(pwd)) {
      toast.error('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      toast.error('Password must contain at least one number');
      return false;
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(pwd)) {
      toast.error('Password must contain at least one special character');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    // Validate password strength
    if (!validatePassword(password)) return;

    // Confirm password match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-error-600 to-error-800 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <AlertCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Invalid Reset Link</h1>
            <p className="text-error-100">This password reset link is invalid or has expired</p>
          </div>

          <div className="p-8 text-center">
            <div className="bg-error-50 border border-error-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-error-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-medium text-error-900 mb-1">Link Expired</h3>
                  <p className="text-sm text-error-700">
                    Password reset links are valid for 1 hour for security reasons. Please request a new one.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/forgot-password')}
              className="w-full h-12 rounded-xl font-medium text-base transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              Request New Reset Link
            </Button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield size={14} className="text-green-500" />
                <span>Secure password reset • Links expire in 1 hour</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <div className="w-48 h-36 bg-white rounded-lg flex items-center justify-center backdrop-blur-sm">
              <img
                src="/big-logo.png"
                alt="TrustBridge AI Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Reset Your Password</h1>
          <p className="text-primary-100 text-center">
            Create a strong new password for your account
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 group-hover:border-gray-400"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400 hover:text-primary-500" />
                  ) : (
                    <Eye size={18} className="text-gray-400 hover:text-primary-500" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-gray-700">Password must include:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Special character</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200 group-hover:border-gray-400 ${confirmPassword
                      ? password === confirmPassword
                        ? 'border-green-500'
                        : 'border-error-500'
                      : 'border-gray-300'
                    }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-gray-400 hover:text-primary-500" />
                  ) : (
                    <Eye size={18} className="text-gray-400 hover:text-primary-500" />
                  )}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <div className="absolute inset-y-0 right-10 pr-3 flex items-center">
                    <CheckCircle size={18} className="text-green-500" />
                  </div>
                )}
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-sm text-error-600">
                  <AlertCircle size={14} />
                  <span>Passwords do not match</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="h-12 rounded-xl font-medium text-base transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            {/* Security Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Security Guidelines</h3>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                    <li>Use a unique password not used elsewhere</li>
                    <li>Avoid personal information like birthdays</li>
                    <li>Consider using a password manager</li>
                    <li>Your new password will be active immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Remember your password?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Back to login
                </button>
              </p>
              {/* <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                <Shield size={12} className="text-green-500" />
                <span>Enterprise security • Encrypted password storage</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};