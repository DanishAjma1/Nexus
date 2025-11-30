import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600 px-2">
              We've sent password reset instructions to {email}
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-8 space-y-4">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <Button variant="outline" fullWidth onClick={() => setIsSubmitted(false)}>
              Try again
            </Button>

            <Link to="/login">
              <Button variant="ghost" fullWidth leftIcon={<ArrowLeft size={18} />}>
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 px-2">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<Mail size={18} />}
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Send reset instructions
            </Button>

            <Link to="/login">
              <Button variant="ghost" fullWidth leftIcon={<ArrowLeft size={18} />}>
                Back to login
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
