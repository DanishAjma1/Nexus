import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, AlertCircle, Mail, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader } from "../../components/ui/Card";

export const AccountUnderReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Get email from localStorage or state
    const email = localStorage.getItem("userEmail") || "your email";
    setUserEmail(email);
  }, []);

  const checkApprovalStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/get-user-by-id/${
          JSON.parse(atob(token.split(".")[1])).userId
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.user?.approvalStatus === "approved") {
        navigate("/profile-setup/verify", {
          state: { accountApproved: true },
        });
      } else if (data.user?.approvalStatus === "rejected") {
        navigate("/account-rejected", {
          state: { reason: data.user.rejectionReason },
        });
      }
    } catch (error) {
      console.error("Error checking approval status:", error);
      setRetryCount((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Account Under Review</h1>
          <p className="text-gray-600 mt-2">
            Thank you for completing your profile setup!
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white border border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              What Happens Next?
            </h2>
          </CardHeader>
          <div className="p-6 space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Admin Review
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Our admin team will carefully review your profile and details to ensure they meet our platform standards.
                </p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-blue-200 h-6 ml-5"></div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Email Notification
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  You will receive an email at <strong>{userEmail}</strong> with the approval decision.
                </p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-blue-200 h-6 ml-5"></div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Dashboard Access
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Once approved, you can login and access all platform features.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline Info */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Typical Review Time</p>
                <p className="text-sm text-green-800 mt-1">
                  Most applications are reviewed within 24-48 hours. Complex applications may take longer.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Email Tips */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Email Tips</p>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                  <li>Check your spam/junk folder</li>
                  <li>Add us to your contacts for safety</li>
                  <li>Check back in 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={checkApprovalStatus}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Check Approval Status
          </Button>

          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 flex items-center justify-center gap-2"
          >
            Back to Login
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Retry Count */}
        {retryCount > 0 && (
          <p className="text-center text-sm text-gray-500">
            Checked {retryCount} time{retryCount > 1 ? "s" : ""}
          </p>
        )}

        {/* Help Section */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-600 mb-4">
            Have questions or need help?
          </p>
          <div className="flex gap-3">
            <a
              href="mailto:support@trustbridge.ai"
              className="flex-1 text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Email Support
            </a>
            <a
              href="/help"
              className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Help Center
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500">
          We're committed to maintaining a safe and trustworthy platform for all users.
        </p>
      </div>
    </div>
  );
};

export default AccountUnderReviewPage;
