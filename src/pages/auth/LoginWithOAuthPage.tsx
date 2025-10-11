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

  console.log(token);
  useEffect(() => {
    if (!token) {
      alert("Missing token");
      return;
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert("Missing token");
      return;
    }
    // token is guaranteed to be a string here
    await loginWithOauth(token, role);
    navigate(
      role === "entrepreneur"
        ? "/dashboard/entrepreneur"
        : "/dashboard/investor"
    );
  };

  return (
    <div className="flex min-h-screen w-full justify-center">
      <div className="flex flex-col my-5 w-1/3 justify-center">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${
                  role === "entrepreneur"
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
                className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${
                  role === "investor"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setRole("investor")}
              >
                <CircleDollarSign size={18} className="mr-2" />
                Investor
              </button>
            </div>
            <div className="flex justify-center my-5 ">
              <Button
                className="w-2/5"
                type="submit"
                fullWidth
                isLoading={isLoading}
                leftIcon={<LogIn size={18} />}
              >
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
