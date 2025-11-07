import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { forgotPassword } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-yellow-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-yellow-400">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              We've sent password reset instructions to <span className="font-semibold text-yellow-300">{email}</span>
            </p>
          </div>
          
          <div className="mt-8 bg-neutral-900/80 backdrop-blur-xl py-8 px-6 shadow-lg border border-yellow-500/30 sm:rounded-xl sm:px-10">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Didn’t receive the email? Check your spam folder or try again.
              </p>
              
              <Button
                variant="outline"
                fullWidth
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                onClick={() => setIsSubmitted(false)}
              >
                Try again
              </Button>
              
              <Link to="/login">
                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<ArrowLeft size={18} />}
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                >
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-yellow-400">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your email and we'll send instructions to reset your password.
          </p>
        </div>
        
        <div className="mt-8 bg-neutral-900/80 backdrop-blur-xl py-8 px-6 shadow-lg border border-yellow-500/30 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<Mail size={18} className="text-yellow-400" />}
              className="bg-black text-gray-100 border-yellow-500/30 focus:border-yellow-400"
            />
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition"
            >
              Send reset instructions
            </Button>
            
            <Link to="/login">
              <Button
                variant="ghost"
                fullWidth
                leftIcon={<ArrowLeft size={18} />}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
              >
                Back to login
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
