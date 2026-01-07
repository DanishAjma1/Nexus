import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Smartphone, ArrowLeft, Key, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const TwoFactorAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2FA, cancel2FA } = useAuth();
  
  const { user, role } = location.state || {};
  
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useBackupCode, setUseBackupCode] = useState(false);
  
  if (!user || !role) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if ((!useBackupCode && code.length !== 6) || (useBackupCode && code.length !== 10)) {
      setError(useBackupCode ? "Backup codes are 10 characters" : "Please enter a valid 6-digit code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await verify2FA(code, useBackupCode);
      
      toast.success("2FA verification successful!");
      
      // Navigate to appropriate dashboard
      if (role === "entrepreneur") {
        navigate("/dashboard/entrepreneur");
      } else if (role === "investor") {
        navigate("/dashboard/investor");
      } else if (role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/");
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    cancel2FA();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Shield className="text-primary-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600">
            For enhanced security, please verify your identity
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="text-primary-600" size={20} />
              <p className="font-medium text-gray-900">
                {user.email}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Enter the verification code from your authenticator app
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="text-error-500 flex-shrink-0 mt-0.5" size={18} />
              <span className="text-error-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label={useBackupCode ? "Backup Code" : "Verification Code"}
                placeholder={useBackupCode ? "Enter 10-character backup code" : "000000"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={useBackupCode ? 10 : 6}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setUseBackupCode(!useBackupCode)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
              >
                <Key size={14} />
                {useBackupCode ? "Use authenticator app" : "Use backup code"}
              </button>
              
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                Back to login
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have access to your authenticator app?
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setUseBackupCode(true)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Use a backup code
                </button>
                <span className="mx-2 text-gray-400">•</span>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Need help?
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            <Shield className="inline mr-1" size={12} />
            TrustBridge AI ensures secure access with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};