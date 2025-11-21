import React, { useEffect, useState } from "react";
import { InvestorSettings } from "../settings/InvestorSettings";
import { EntrepreneurSettings } from "../settings/EntrepreneurSettings";
import { useAuth } from "../../context/AuthContext";

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

  return (
    <>
      <div className="absolute inset-0 w-full h-full ">
        <img src="/app logo.jpeg" alt="background" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="flex gap-5 w-9/12 relative justify-end">
          <div className="w-1/2">
            {role === "investor" ? (
              <InvestorSettings />
            ) : (
              <EntrepreneurSettings />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
