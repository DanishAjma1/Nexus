import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  CircleDollarSign,
  Building2,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { UserRole } from "../../types";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("entrepreneur");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password, role);
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

  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === "entrepreneur") {
      setEmail("en@gmail.com");
      setPassword("123");
    } else {
      setEmail("in@gmail.com");
      setPassword("123");
    }
    setRole(userRole);
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
              Business Nexus
            </h2>
            <p className="mt-2 text-gray-400 text-sm">
              Connect with investors and entrepreneurs
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I am a
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

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<User size={18} className="text-yellow-400" />}
              className="bg-neutral-800 text-gray-100 placeholder-gray-500 border border-neutral-700 focus:border-yellow-400 focus:ring-yellow-400"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              className="bg-neutral-800 text-gray-100 placeholder-gray-500 border border-neutral-700 focus:border-yellow-400 focus:ring-yellow-400"
            />

            <div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-yellow-400 border-neutral-700 rounded focus:ring-yellow-500"
                />
                <span className="ml-2">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-yellow-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              leftIcon={<LogIn size={18} />}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-semibold py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
            >
              Sign in
            </Button>
          </form>

          {/* Demo Buttons */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-neutral-700"></div>
              <span className="px-3 text-neutral-500">Demo Accounts</span>
              <div className="flex-1 h-px bg-neutral-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => fillDemoCredentials("entrepreneur")}
                leftIcon={<Building2 size={16} />}
                className="bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-yellow-500/40"
              >
                Entrepreneur
              </Button>

              <Button
                variant="outline"
                onClick={() => fillDemoCredentials("investor")}
                leftIcon={<CircleDollarSign size={16} />}
                className="bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-yellow-500/40"
              >
                Investor
              </Button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-neutral-700"></div>
              <span className="px-3 text-neutral-500">Or</span>
              <div className="flex-1 h-px bg-neutral-700"></div>
            </div>

            <p>
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-yellow-400 hover:underline font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
