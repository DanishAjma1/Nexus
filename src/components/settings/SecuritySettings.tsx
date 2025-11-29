import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Shield, Smartphone, LogOut, AlertCircle } from "lucide-react";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export const SecuritySettings: React.FC = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Windows PC",
      browser: "Chrome 119",
      location: "Lahore, Punjab, PK",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: "2",
      device: "iPhone 15",
      browser: "Safari",
      location: "Lahore, Punjab, PK",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: "3",
      device: "MacBook Pro",
      browser: "Chrome 118",
      location: "Karachi, Sindh, PK",
      lastActive: "Yesterday",
      isCurrent: false,
    },
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
    setPasswordSuccess(false);
  };

  const validatePassword = (): boolean => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError("All password fields are required");
      return false;
    }

    if (passwords.new.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return false;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return false;
    }

    if (passwords.current === passwords.new) {
      setPasswordError("New password must be different from current password");
      return false;
    }

    return true;
  };

  const handlePasswordUpdate = async () => {
    if (!validatePassword()) return;

    setIsUpdatingPassword(true);
    setPasswordError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Replace with actual API call
      // await updatePassword(passwords.current, passwords.new);

      setPasswordSuccess(true);
      setPasswords({ current: "", new: "", confirm: "" });

      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (error) {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleToggleTwoFactor = () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      setTwoFactorEnabled(false);
      setShowTwoFactorSetup(false);
    } else {
      // Show 2FA setup
      setShowTwoFactorSetup(true);
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (verificationCode.length !== 6) {
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      // await verifyTwoFactorCode(verificationCode);

      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setVerificationCode("");
    } catch (error) {
      console.error("Failed to verify 2FA code");
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const handleRevokeAllSessions = () => {
    setSessions((prev) => prev.filter((session) => session.isCurrent));
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="text-primary-600" size={20} />
            <h2 className="text-lg font-medium text-gray-900">
              Two-Factor Authentication
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account by requiring a
                verification code in addition to your password.
              </p>
              <Badge
                variant={twoFactorEnabled ? "success" : "warning"}
                className="mt-2"
              >
                {twoFactorEnabled ? "Enabled" : "Not Enabled"}
              </Badge>
            </div>
            <Button variant="outline" onClick={handleToggleTwoFactor}>
              {twoFactorEnabled ? "Disable" : "Enable"}
            </Button>
          </div>

          {showTwoFactorSetup && !twoFactorEnabled && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Smartphone className="text-blue-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">
                    Set Up Two-Factor Authentication
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-2 mb-4">
                    <li>
                      1. Download an authenticator app (Google Authenticator,
                      Authy, etc.)
                    </li>
                    <li>2. Scan this QR code with your authenticator app</li>
                    <li>3. Enter the 6-digit code below to verify</li>
                  </ol>

                  {/* Mock QR Code */}
                  <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center text-gray-400 text-xs">
                      QR Code
                      <br />
                      Placeholder
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Input
                      label="Verification Code"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleVerifyTwoFactor}>
                        Verify & Enable
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowTwoFactorSetup(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {passwordError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600" size={18} />
              <p className="text-sm text-red-800">{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="text-green-600" size={18} />
              <p className="text-sm text-green-800">
                Password updated successfully!
              </p>
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
            placeholder="Enter your current password"
          />

          <Input
            label="New Password"
            type="password"
            name="new"
            value={passwords.new}
            onChange={handlePasswordChange}
            placeholder="Enter new password (min. 8 characters)"
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirm"
            value={passwords.confirm}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
          />

          <div className="flex justify-end">
            <Button
              onClick={handlePasswordUpdate}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
