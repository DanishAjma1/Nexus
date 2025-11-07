import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  CircleDollarSign,
  Building2,
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

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password, role);
      navigate(
        role === "entrepreneur"
          ? "/dashboard/entrepreneur"
          : "/dashboard/investor"
      );
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-2xl bg-black/60 border border-yellow-500/20 shadow-[0_0_30px_rgba(255,215,0,0.1)] rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-300 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                className="text-black"
              >
                <path
                  d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-yellow-400">
              Create Your Account
            </h2>
            <p className="mt-2 text-gray-400 text-sm">
              Join Business Nexus to connect with partners
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I am registering as a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    role === "entrepreneur"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold shadow-lg"
                      : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                  }`}
                  onClick={() => setRole("entrepreneur")}
                >
                  <Building2 size={18} className="mr-2" />
                  Entrepreneur
                </button>

                <button
                  type="button"
                  className={`py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    role === "investor"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold shadow-lg"
                      : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                  }`}
                  onClick={() => setRole("investor")}
                >
                  <CircleDollarSign size={18} className="mr-2" />
                  Investor
                </button>
              </div>
            </div>

            {/* Name */}
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              startAdornment={<User size={18} className="text-yellow-400" />}
              className="bg-neutral-800 text-gray-100 placeholder-gray-500 border border-neutral-700 focus:border-yellow-400 focus:ring-yellow-400"
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<Mail size={18} className="text-yellow-400" />}
              className="bg-neutral-800 text-gray-100 placeholder-gray-500 border border-neutral-700 focus:border-yellow-400 focus:ring-yellow-400"
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              startAdornment={<Lock size={18} className="text-yellow-400" />}
              className="bg-neutral-800 text-gray-100 placeholder-gray-500 border border-neutral-700 focus:border-yellow-400 focus:ring-yellow-400"
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              startAdornment={<Lock size={18} className="text-yellow-400" />}
              className="bg-neutral-800 text-gray-100 placeholder-gray-500 border border-neutral-700 focus:border-yellow-400 focus:ring-yellow-400"
            />

            {/* Terms Checkbox */}
            <div className="flex items-start text-sm text-gray-400">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-yellow-400 focus:ring-yellow-500 border-neutral-700 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-yellow-400 hover:underline font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-yellow-400 hover:underline font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-semibold py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-neutral-700"></div>
              <span className="px-3 text-neutral-500">Or</span>
              <div className="flex-1 h-px bg-neutral-700"></div>
            </div>

            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-yellow-400 hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
