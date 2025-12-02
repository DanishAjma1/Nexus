import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  CircleDollarSign,
  Building2,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { UserRole } from "../../types";

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("entrepreneur");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError("Name can only contain letters and spaces");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|icloud|outlook|hotmail|aol|protonmail|live|msn|comcast)\.com$/;
    if (!emailRegex.test(email)) {
      setError("Invalid Email");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
      );
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!role) {
      setError("Select a role");
      return false;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ name, email, password, role })
      );
      navigate("/fill-details");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 text-purple-100">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-purple-700 rounded-md flex items-center justify-center shadow-md">
            <Shield size={28} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-purple-100">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-purple-300 px-2">
          Join TrustBridge AI to connect with partners
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-gradient-to-br from-purple-900 to-black py-8 px-4 shadow-lg sm:rounded-lg border border-purple-700">
          {error && (
            <div className="mb-4 bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-1">
                I am registering as a
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors text-sm sm:text-base ${
                    role === "entrepreneur"
                      ? "border-purple-500 bg-purple-700 text-purple-100"
                      : "border-purple-700 text-purple-200 hover:bg-purple-800"
                  }`}
                  onClick={() => setRole("entrepreneur")}
                >
                  <Building2 size={18} className="mr-2" />
                  Entrepreneur
                </button>

                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors text-sm sm:text-base ${
                    role === "investor"
                      ? "border-purple-500 bg-purple-700 text-purple-100"
                      : "border-purple-700 text-purple-200 hover:bg-purple-800"
                  }`}
                  onClick={() => setRole("investor")}
                >
                  <CircleDollarSign size={18} className="mr-2" />
                  Investor
                </button>

                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors text-sm sm:text-base ${
                    role === "admin"
                      ? "border-purple-500 bg-purple-700 text-purple-100"
                      : "border-purple-700 text-purple-200 hover:bg-purple-800"
                  }`}
                  onClick={() => setRole("admin")}
                >
                  <Shield size={18} className="mr-2" />
                  Admin
                </button>
              </div>
            </div>

            {/* Name */}
            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              startAdornment={<User size={18} className="text-purple-300" />}
              className="bg-black text-purple-100 border border-purple-700 placeholder-purple-400 focus:ring-purple-500"
            />

            {/* Email */}
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<Mail size={18} className="text-purple-300" />}
              className="bg-black text-purple-100 border border-purple-700 placeholder-purple-400 focus:ring-purple-500"
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              startAdornment={<Lock size={18} className="text-purple-300" />}
              className="bg-black text-purple-100 border border-purple-700 placeholder-purple-400 focus:ring-purple-500"
            />

            {/* Confirm Password */}
            <Input
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              startAdornment={<Lock size={18} className="text-purple-300" />}
              className="bg-black text-purple-100 border border-purple-700 placeholder-purple-400 focus:ring-purple-500"
            />

            {/* Terms checkbox */}
            <div className="flex items-start sm:items-center gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-700 rounded"
              />
              <label htmlFor="terms" className="block text-sm text-purple-100">
                I agree to the{" "}
                <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-purple-700 text-purple-100 hover:bg-purple-600"
            >
              Create account
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-purple-300">Or</span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <p className="text-sm text-purple-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-purple-400 hover:text-purple-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
