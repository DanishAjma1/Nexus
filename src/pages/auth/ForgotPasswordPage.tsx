import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword } = useAuth();

  // Allowed common email domains
  const allowedDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'icloud.com',
    'hotmail.com',
    'aol.com',
    'live.com',
    'msn.com',
    'protonmail.com',
  ];

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      toast.error('Email is required');
      return false;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return false;
    }

    // Check domain
    const domain = email.split('@')[1].toLowerCase();
    if (!allowedDomains.includes(domain)) {
      toast.error(`Email domain must be one of: ${allowedDomains.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success(`Password reset instructions sent to ${email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-primary-100">We've sent password reset instructions</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-primary-100 rounded-full animate-pulse"></div>
                <Mail className="absolute inset-0 m-auto text-primary-600" size={40} />
              </div>
              <p className="text-gray-700 mb-2">
                Instructions have been sent to:
              </p>
              <p className="text-lg font-semibold text-primary-600 bg-primary-50 py-2 px-4 rounded-lg inline-block">
                {email}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">What to do next</h3>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
                      <li>Check your inbox for our email</li>
                      <li>Look in spam folder if you don't see it</li>
                      <li>Follow the reset link in the email</li>
                      <li>The link expires in 1 hour for security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsSubmitted(false)}
                className="h-12 rounded-xl border-2 font-medium"
              >
                Try with another email
              </Button>

              <Link to="/login">
                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<ArrowLeft size={18} />}
                  className="h-12 rounded-xl font-medium"
                >
                  Back to login
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield size={14} className="text-green-500" />
                <span>• Password reset expires in 1 hour</span>
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold">TrustBridge AI</span>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Reset Your Password</h1>
          <p className="text-primary-100 text-center">
            Enter your email to receive reset instructions
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 group-hover:border-gray-400"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Allowed Email Domains</h3>
                  <p className="text-xs text-gray-600">
                    {allowedDomains.slice(0, 4).map(domain => domain.replace('.com', '')).join(', ')}, and {allowedDomains.length - 4} more
                  </p>
                </div>
              </div>
            </div> */}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="h-12 rounded-xl font-medium text-base transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? 'Sending instructions...' : 'Send Reset Instructions'}
            </Button>

            <Link to="/login">
              <Button
                variant="ghost"
                fullWidth
                leftIcon={<ArrowLeft size={18} />}
                className="h-12 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Back to login
              </Button>
            </Link>
          </form>

          {/* <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Need help?{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
                  Contact support
                </a>
              </p>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                <Shield size={12} className="text-green-500" />
                <span>Secure password reset • Encrypted transmission</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};