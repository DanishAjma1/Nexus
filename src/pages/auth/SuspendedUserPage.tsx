import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, Clock, Mail, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader } from "../../components/ui/Card";
import { format } from "date-fns";

export const SuspendedUserPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [suspensionData, setSuspensionData] = useState<{
    reason: string;
    endDate: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get suspension data from location state or fetch from API
    const state = location.state as { 
      suspensionReason?: string; 
      suspensionEndDate?: string;
      userId?: string;
    };

    if (state?.suspensionReason && state?.suspensionEndDate) {
      setSuspensionData({
        reason: state.suspensionReason,
        endDate: state.suspensionEndDate,
      });
      setIsLoading(false);
    } else {
      // Fetch from API using token
      fetchSuspensionData();
    }
  }, [location]);

  const fetchSuspensionData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/get-user-by-id/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.user?.isSuspended) {
        setSuspensionData({
          reason: data.user.suspensionReason || "No reason provided",
          endDate: data.user.suspensionEndDate,
        });
      } else {
        // Not suspended anymore, redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching suspension data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSuspensionStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/get-user-by-id/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!data.user?.isSuspended) {
        // Suspension ended, redirect to dashboard
        navigate("/dashboard");
        window.location.reload();
      } else {
        // Still suspended, update end date
        setSuspensionData({
          reason: data.user.suspensionReason || "No reason provided",
          endDate: data.user.suspensionEndDate,
        });
      }
    } catch (error) {
      console.error("Error checking suspension status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!suspensionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-2xl w-full mx-4">
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900">Account Status</h1>
          </CardHeader>
          <div className="p-6">
            <p className="text-gray-600">Unable to load suspension details.</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate("/login")}
            >
              Return to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const endDate = new Date(suspensionData.endDate);
  const isExpired = new Date() > endDate;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Suspended
          </h1>
          <p className="text-lg text-gray-600">
            Your account has been temporarily suspended
          </p>
        </CardHeader>

        <div className="p-6 space-y-6">
          {isExpired ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Your suspension period has ended. Please refresh to access your account.
              </p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={checkSuspensionStatus}
              >
                Check Account Status
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                      Suspension Details
                    </h3>
                    <p className="text-sm text-yellow-700">
                      <strong>Reason:</strong> {suspensionData.reason}
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                      <strong>Suspension End Date:</strong>{" "}
                      {format(endDate, "PPpp")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Your account will be automatically restored after the suspension
                  period ends. You can try logging in again after{" "}
                  <strong>{format(endDate, "PP")}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={checkSuspensionStatus}
                >
                  Check Status
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
                    Need help? Contact support at{" "}
                    <a
                      href="mailto:aitrustbridge@gmail.com"
                      className="text-primary-600 hover:text-primary-500 font-medium"
                    >
                      aitrustbridge@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
