import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CircleDollarSign,
  Building2,
  Globe,
  Linkedin,
  Shield,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
  Check,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { UserRole } from "../../types";
import toast from "react-hot-toast";
import axios from "axios";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
   const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("entrepreneur");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pageTransition, setPageTransition] = useState({
    direction: "enter-right",
    isTransitioning: false
  });
  const URL = import.meta.env.VITE_BACKEND_URL;
  
  const location = useLocation();
  const navigate = useNavigate();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 888);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle page transition based on navigation
  useEffect(() => {
    const fromRegister = location.state?.fromRegister;
    if (fromRegister) {
      setPageTransition({ direction: "enter-left", isTransitioning: false });
    } else {
      setPageTransition({ direction: "enter-right", isTransitioning: false });
    }
  }, [location]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setIsLoading(true);

  //   try {
  //     await login(email, password, role);

  //     if (role === "entrepreneur") navigate("/dashboard/entrepreneur");
  //     else if (role === "investor") navigate("/dashboard/investor");
  //     else if (role === "admin") navigate("/dashboard/admin");
  //   } catch (err) {
  //     setError((err as Error).message);
  //     setIsLoading(false);
  //   }
  // };

  // Update the handleSubmit function in LoginPage
// Update the handleSubmit function in LoginPage.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    // Call AuthContext login function
    const result = await login(email, password, role);

    // Check if 2FA is required
    if (result.requires2FA) {
      setIsLoading(false);
      navigate("/verify-2fa", {
        state: {
          partialToken: result.partialToken,
          user: result.user,
          email,
          role
        }
      });
      return;
    }

    // Successful login without 2FA
    setIsLoading(false);

    // Navigate to dashboard based on role
    setTimeout(() => {
      if (role === "entrepreneur") navigate("/dashboard/entrepreneur");
      else if (role === "investor") navigate("/dashboard/investor");
      else if (role === "admin") navigate("/dashboard/admin");
    }, 500);
    
  } catch (err: any) {
    setIsLoading(false);
    // Check for approval status in error response
    if (err.response?.status === 403) {
      const data = err.response.data;
      if (data.approvalStatus === "pending") {
        // Redirect pending users to the account-under-review page
        navigate("/account-under-review", { state: { email } });
        return;
      } else if (data.approvalStatus === "rejected") {
        // Redirect to rejection page
        setTimeout(() => {
          navigate("/account-rejected", {
            state: {
              reason: data.reason || "No reason provided",
              email: email
            }
          });
        }, 500);
        return;
      } else {
        setError(data.message || "Login failed");
      }
    } else {
      setError(err.message || "Login failed");
    }
  }
};

  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === "entrepreneur") {
      setEmail("en@gmail.com");
      setPassword("123");
    } else if (userRole === "investor") {
      setEmail("in@gmail.com");
      setPassword("123");
    } else {
      setEmail("admin@trust.com");
      setPassword("admin123");
    }
    setRole(userRole);
  };

  const loginWith = (provider: string) => {
    window.location.href = `${URL}/auth/${provider}`;
  };

  const handleNavigateToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setPageTransition({ direction: "exit-left", isTransitioning: true });
    
    setTimeout(() => {
      navigate("/register", { 
        state: { fromLogin: true } 
      });
    }, 400);
  };

  const { login } = useAuth();

  // Add transition class based on direction
  const getTransitionClass = () => {
    const { direction, isTransitioning } = pageTransition;
    if (!isTransitioning) return "";
    
    switch(direction) {
      case "enter-left": return "animate-slide-in-left";
      case "enter-right": return "animate-slide-in-right";
      case "exit-left": return "animate-slide-out-left";
      case "exit-right": return "animate-slide-out-right";
      default: return "";
    }
  };

  if (isMobile) {
    return (
      <div className={`min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col transition-all duration-400 ${getTransitionClass()}`}>
        {/* Mobile Header */}
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center animate-pulse">
                {/* <Shield size={18} className="text-white" /> */}
                <img
                src="/tab-logo1.png"
                alt="TrustBridge AI Logo"
                className="w-auto h-full object-contain"
              />
              </div>
              <span className="font-bold text-gray-900">TrustBridge AI</span>
            </div>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 text-sm mt-1">Sign in to continue</p>
        </div>

        {/* Main Form Container */}
        <div className="flex-1 p-6">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-error-500 flex-shrink-0 mt-0.5" />
              <span className="text-error-700 text-sm">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection - Mobile Friendly */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                <button
                  type="button"
                  className={`min-w-[100px] p-3 border rounded-xl flex flex-col items-center justify-center transition-all flex-shrink-0 active:scale-95 ${
                    role === "entrepreneur"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                  onClick={() => setRole("entrepreneur")}
                >
                  <Building2 size={20} className={`mb-1 ${role === "entrepreneur" ? "text-primary-600" : "text-gray-500"}`} />
                  <span className="text-xs font-medium">Entrepreneur</span>
                </button>

                <button
                  type="button"
                  className={`min-w-[100px] p-3 border rounded-xl flex flex-col items-center justify-center transition-all flex-shrink-0 active:scale-95 ${
                    role === "investor"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                  onClick={() => setRole("investor")}
                >
                  <CircleDollarSign size={20} className={`mb-1 ${role === "investor" ? "text-primary-600" : "text-gray-500"}`} />
                  <span className="text-xs font-medium">Investor</span>
                </button>

                <button
                  type="button"
                  className={`min-w-[100px] p-3 border rounded-xl flex flex-col items-center justify-center transition-all flex-shrink-0 active:scale-95 ${
                    role === "admin"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                  onClick={() => setRole("admin")}
                >
                  <Shield size={20} className={`mb-1 ${role === "admin" ? "text-primary-600" : "text-gray-500"}`} />
                  <span className="text-xs font-medium">Admin</span>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg"
                />
                <label htmlFor="remember-me" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="/forgot-password" className="text-sm text-primary-600 font-medium">
                Forgot?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="h-12 rounded-xl text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Accounts - Mobile */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">Quick Access</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => fillDemoCredentials("entrepreneur")}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all text-center"
              >
                <Building2 size={16} className="mx-auto text-gray-600 mb-1" />
                <span className="text-xs">Entrepreneur</span>
              </button>

              <button
                onClick={() => fillDemoCredentials("investor")}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all text-center"
              >
                <CircleDollarSign size={16} className="mx-auto text-gray-600 mb-1" />
                <span className="text-xs">Investor</span>
              </button>

              <button
                onClick={() => fillDemoCredentials("admin")}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all text-center"
              >
                <Shield size={16} className="mx-auto text-gray-600 mb-1" />
                <span className="text-xs">Admin</span>
              </button>
            </div>
          </div>

          {/* OAuth - Mobile */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => loginWith("google")}
                className="w-full p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Globe size={20} className="text-gray-600" />
                <span className="font-medium">Google</span>
              </button>
              
              <button
                onClick={() => loginWith("linkedin")}
                className="w-full p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Linkedin size={20} className="text-gray-600" />
                <span className="font-medium">LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link - Mobile */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                onClick={handleNavigateToRegister}
                className="font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-all duration-200"
              >
                Sign up
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Version
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 transition-all duration-400 ${getTransitionClass()}`}>
      <div className="w-full max-w-4xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left side - Brand/Info */}
        <div className="lg:w-2/5 bg-gradient-to-br from-primary-600 to-primary-800 p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-8">
          <div className="w-60 h-44 bg-white rounded-lg flex items-center justify-center backdrop-blur-sm">
            <img
              src="/big-logo.png"
              alt="TrustBridge AI Logo"
              className="w-auto h-full object-contain"
            />
          </div>
        </div>

            <div className="mt-16">
              <h1 className="text-3xl font-bold mb-6">
                Welcome Back to Your Business Hub
              </h1>
              <p className="text-primary-100 mb-8">
                Access your dashboard, connect with partners, and manage your business ecosystem.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check size={14} />
                  </div>
                  <span>Secure login</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check size={14} />
                  </div>
                  <span>Role-based dashboard access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check size={14} />
                  </div>
                  <span>Real-time business insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check size={14} />
                  </div>
                  <span>24/7 system monitoring</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-primary-100 text-sm">
                "TrustBridge AI has streamlined our partnership management. The platform's security and ease of use are exceptional."
              </p>
              <p className="text-sm font-medium mt-2">— Marcus Rodriguez, Venture Partner</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="lg:w-3/5 p-8 lg:p-12">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">
              Sign in to access your business dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-error-50 border border-error-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-error-500 flex-shrink-0 mt-0.5" />
              <span className="text-error-700 text-sm">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  className={`relative p-3 border-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    role === "entrepreneur"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setRole("entrepreneur")}
                >
                  <Building2 size={18} className="mr-2" />
                  <span className="font-medium">Entrepreneur</span>
                </button>

                <button
                  type="button"
                  className={`relative p-3 border-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    role === "investor"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setRole("investor")}
                >
                  <CircleDollarSign size={18} className="mr-2" />
                  <span className="font-medium">Investor</span>
                </button>

                <button
                  type="button"
                  className={`relative p-3 border-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    role === "admin"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setRole("admin")}
                >
                  <Shield size={18} className="mr-2" />
                  <span className="font-medium">Admin</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg"
                />
                <label htmlFor="remember-me" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <a
                href="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="h-12 rounded-xl font-medium text-base transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              Sign in to Dashboard
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm font-medium text-gray-500">
                  Quick Access
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => fillDemoCredentials("entrepreneur")}
                className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-2">
                  <Building2 size={20} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Entrepreneur</span>
                <span className="text-xs text-gray-500 mt-1">Demo Account</span>
              </button>

              <button
                onClick={() => fillDemoCredentials("investor")}
                className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-2">
                  <CircleDollarSign size={20} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Investor</span>
                <span className="text-xs text-gray-500 mt-1">Demo Account</span>
              </button>

              <button
                onClick={() => fillDemoCredentials("admin")}
                className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-2">
                  <Shield size={20} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <span className="text-xs text-gray-500 mt-1">Demo Account</span>
              </button>
            </div>
          </div>

          {/* OAuth Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  onClick={handleNavigateToRegister}
                  className="font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-all duration-200"
                >
                  Sign up here
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => loginWith("google")}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                  <Globe size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-700">Google</span>
                </button>
                
                <button
                  onClick={() => loginWith("linkedin")}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                  <Linkedin size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-700">LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};