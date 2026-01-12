import React, { useEffect, useState } from "react";

import { InvestorSetup } from "../settings/InvestorSetup";
import { EntrepreneurSetup } from "../settings/EntrepreneurSetup";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../ui/Card";
import { Building2, TrendingUp, Sparkles, LogOut } from "lucide-react";

export const UserDetails: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (!userInfoString) {
      setRole(null);
      return;
    }
    try {
      const parsed = JSON.parse(userInfoString);
      setRole(parsed.role);
    } catch (e) {
      console.error("Failed to parse userInfo from localStorage", e);
      setRole(null);
    }
  }, []);

  const getRoleIcon = () => {
    if (role === "investor") {
      return <TrendingUp className="w-6 h-6 text-blue-600" />;
    } else if (role === "entrepreneur") {
      return <Building2 className="w-6 h-6 text-green-600" />;
    }
    return null;
  };

  const getRoleTitle = () => {
    if (role === "investor") return "Investor Profile Setup";
    if (role === "entrepreneur") return "Entrepreneur Profile Setup";
    return "Profile Setup";
  };

  const getRoleDescription = () => {
    if (role === "investor")
      return "Complete your investor profile to discover promising startups and investment opportunities.";
    if (role === "entrepreneur")
      return "Complete your entrepreneur profile to attract investors and grow your business.";
    return "Please complete your profile to get started.";
  };

  return (
    <>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50/20 via-white to-purple-50/20">
        {/* Subtle gradient background instead of image */}
        <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,transparent)]" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 py-8">
        {/* Header Section */}
        <div className="w-full max-w-6xl mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border">
              {/* <Sparkles className="w-8 h-8 text-indigo-600" /> */}
              <img
                src="/tab-logo1.png"
                alt="TrustBridge Logo"
                className="w-20 h-16 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome to TrustBridge
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with the right partners to grow your vision
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
          {/* Left Side - Role Info Card */}
          <div className="lg:w-1/3">
            <Card className="sticky top-8 h-fit border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                    {getRoleIcon()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {getRoleTitle()}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Step 2 of 3 • Profile Setup
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-8">
                  {getRoleDescription()}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Fill in your details accurately</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Be specific about your preferences</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Your Account will be reviewed by admmin before u have acces to dashboard</span>
                  </div>
                </div>


              </div>
            </Card>
          </div>

          {/* Right Side - Settings Card */}
          <div className="lg:w-2/3">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="relative">
                {/* Decorative header */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <div className="p-8">
                  {role === "investor" ? (
                    <InvestorSetup />
                  ) : (
                    <EntrepreneurSetup />
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Need help? Contact our support team at{" "}
            <a href="mailto:aitrustbridge@gmail.com" className="text-blue-600 hover:text-blue-800">
              aitrustbridge@gmail.com
            </a>
          </p>
          
        </div>
      </div>
    </>
  );
};