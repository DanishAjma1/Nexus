import { Building2, CircleDollarSign, LogIn } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../types";

export const LoginWithOAuthPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>("investor");
  const { isLoading, loginWithOauth } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  useEffect(() => {
    if (!token) alert("Missing token");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      alert("Missing token");
      return;
    }

    await loginWithOauth(token, role);
    navigate(
      role === "entrepreneur" ? "/dashboard/entrepreneur" : "/dashboard/investor"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow sm:rounded-lg p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center shadow-md">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center sm:text-left">
              I am a
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors text-sm sm:text-base ${role === "entrepreneur"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                onClick={() => setRole("entrepreneur")}
              >
                <Building2 size={18} className="mr-2" />
                Entrepreneur
              </button>

              <button
                type="button"
                className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors text-sm sm:text-base ${role === "investor"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                onClick={() => setRole("investor")}
              >
                <CircleDollarSign size={18} className="mr-2" />
                Investor
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              className="w-full sm:w-2/3"
              type="submit"
              fullWidth
              isLoading={isLoading}
              leftIcon={<LogIn size={18} />}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};