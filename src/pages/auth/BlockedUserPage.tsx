import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle, Mail, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader } from "../../components/ui/Card";

export const BlockedUserPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const blockReason = (location.state as { blockReason?: string })?.blockReason || 
    "Your account has been blocked due to a violation of our terms of service.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Blocked
          </h1>
          <p className="text-lg text-gray-600">
            Your account has been permanently blocked
          </p>
        </CardHeader>

        <div className="p-6 space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  Block Reason
                </h3>
                <p className="text-sm text-red-700">{blockReason}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Your account has been blocked and you no longer have access to the
              platform. If you believe this is an error or would like to appeal
              this decision, please contact our support team.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              What to do next?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Contact our support team to discuss your account</li>
              <li>Provide any relevant information for review</li>
              <li>Wait for our team to review your case</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                window.location.href = "mailto:aitrustbridge@gmail.com?subject=Account Block Appeal";
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Login
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              <span>
                Email us at{" "}
                <a
                  href="mailto:aitrustbridge@gmail.com"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  aitrustbridge@gmail.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
