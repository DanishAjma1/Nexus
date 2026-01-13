import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  XCircle,
  Mail,
  AlertCircle,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader } from "../../components/ui/Card";

export const AccountRejectedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rejectionReason, setRejectionReason] = useState<string>(
    location.state?.reason || "Your account application was not approved at this time."
  );
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Update reason if passed via navigation state
    if (location.state?.reason) {
      setRejectionReason(location.state.reason);
    }
  }, [location.state?.reason]);

  useEffect(() => {
    // Get email from localStorage
    const email = localStorage.getItem("userEmail") || "your email";
    setUserEmail(email);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Application Not Approved</h1>
          <p className="text-gray-600 mt-2">
            Your account application has been reviewed
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white border border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
            <h2 className="text-lg font-semibold text-red-900 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Rejection Details
            </h2>
          </CardHeader>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Reason for Rejection:</p>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-gray-900 text-sm leading-relaxed">
                  {rejectionReason}
                </p>
              </div>
            </div>

            {/* What You Can Do */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">What You Can Do</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reapply Now</p>
                    <p className="text-xs text-gray-600">
                      You can register again with this email address and address the rejection concerns
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Contact Support</p>
                    <p className="text-xs text-gray-600">
                      Reach out for clarification on the rejection reason
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Improve & Reapply</p>
                    <p className="text-xs text-gray-600">
                      Address the concerns mentioned and register again after improvements
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Support Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Need Help?</p>
                <p className="text-sm text-blue-800 mt-1">
                  Our support team is ready to help clarify the rejection reason or discuss your options.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userEmail");
              navigate("/register");
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 flex items-center justify-center gap-2"
          >
            Reapply with New Account
            <ArrowRight className="w-4 h-4" />
          </Button>

          <a
            href="mailto:aitrustbridge@gmail.com?subject=Account Rejection Appeal"
            className="block"
          >
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Button>
          </a>

          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 flex items-center justify-center gap-2"
          >
            Back to Login
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Support Channels */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-3">Support Channels</p>
          <div className="space-y-2">
            <div className="text-sm">
              <p className="text-gray-600">
                📧 <strong>Email:</strong>{" "}
                <a
                  href="mailto:aitrustbridge@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  aitrustbridge@gmail.com
                </a>
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">
                🌐 <strong>Help Center:</strong>{" "}
                <a href="/help" className="text-blue-600 hover:underline">
                  Visit our help center
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500">
          We maintain strict standards to ensure a safe and trustworthy platform for all users.
        </p>
      </div>
    </div>
  );
};

export default AccountRejectedPage;
