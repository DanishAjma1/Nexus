import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Smartphone,
  LogOut,
  AlertCircle,
  CheckCircle,
  XCircle,
  Key,
  Trash2,
  Clock,
  Globe,
  Monitor,
  Smartphone as DeviceIcon,
  Download,
  Copy
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'react-hot-toast';
import axios from "axios";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface TrustedDevice {
  deviceId: string;
  deviceName: string;
  browser: string;
  os: string;
  lastUsed: string;
  location: string;
  ipAddress: string;
  createdAt: string;
}

export const SecuritySettings: React.FC = () => {
  const { user, logout } = useAuth();
  const URL = import.meta.env.VITE_BACKEND_URL;

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
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [secretData, setSecretData] = useState<any>(null);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);

  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const [securitySettings, setSecuritySettings] = useState({
    require2FAForNewDevices: true,
    rememberTrustedDevices: true,
    sessionDuration: 30
  });

  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const navigate = useNavigate();

  const ClickOutsideToast = ({ children, onClose }) => {
    const toastRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (toastRef.current && !toastRef.current.contains(event.target)) {
          onClose();
        }
      };

      // Add event listener with a small delay to avoid immediate dismissal
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

    return (
      <div ref={toastRef}>
        {children}
      </div>
    );
  };



  // Load user's 2FA status and trusted devices
  useEffect(() => {
    if (user?.userId) {

      loadSecurityData();
      setTwoFactorEnabled(user?.twoFactorEnabled || false);
    }
  }, [user]);


  const loadSecurityData = async () => {
    try {
      setIsLoadingDevices(true);

      // Load trusted devices
      const devicesResponse = await axios.get(
        `${URL}/auth/trusted-devices/${user?.userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      setTrustedDevices(devicesResponse.data.trustedDevices);
      setSecuritySettings(devicesResponse.data.securitySettings);

      // Check 2FA status from user data
      setTwoFactorEnabled(user?.twoFactorEnabled || false);

    } catch (error) {
      console.error("Failed to load security data:", error);
      toast.error("Failed to load security settings");
    } finally {
      setIsLoadingDevices(false);
    }
  };

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

  const initiate2FASetup = async () => {
    try {
      setIsSettingUp2FA(true);
      const response = await axios.post(
        `${URL}/auth/setup-2fa`,
        { userId: user?.userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      setSecretData(response.data);
      setShowTwoFactorSetup(true);

      toast.success("Scan the QR code with your authenticator app");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to setup 2FA");
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const handleEnable2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsSettingUp2FA(true);
      const response = await axios.post(
        `${URL}/auth/enable-2fa`,
        {
          userId: user?.userId,
          secret: secretData.secret,
          code: verificationCode
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setBackupCodes(response.data.backupCodes);
      setShowBackupCodes(true);
      setVerificationCode("");
      setSecretData(null);

      toast.success("Two-factor authentication enabled successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to enable 2FA");
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    toast(
      <ClickOutsideToast onClose={() => toast.dismiss()}>
        <div>
          <p>Are you sure you want to disable two-factor authentication?</p>
          <p className="text-sm text-gray-600 mt-1">
            This will make your account less secure.
          </p>
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => {
                toast.dismiss();
                disable2FAHandler();
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Disable
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </ClickOutsideToast>,
      {
        duration: Infinity,
        position: 'top-center',
      }
    );
  };

  // Separate handler for the actual disabling logic
  const disable2FAHandler = async () => {
    try {
      // First, clear all trusted devices from backend
      if (trustedDevices.length > 0) {
        await axios.delete(
          `${URL}/auth/trusted-devices/${user?.userId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );
      }

      // Then disable 2FA
      const response = await axios.post(
        `${URL}/auth/disable-2fa`,
        { userId: user?.userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      // Clear local state
      setTwoFactorEnabled(false);  // This will change button to "Enable 2FA"
      setBackupCodes([]);
      setShowBackupCodes(false);
      setTrustedDevices([]);  // This will clear trusted devices section
      loadSecurityData();
      // Dismiss the confirmation toast
      toast.dismiss();

      toast.success("Two-factor authentication disabled successfully.");

      setTimeout(() => {
        logout();
        navigate('/login', {
          state: { message: "2FA has been disabled. Please log in again." }
        });
        toast.success("Please log in again to continue.");
      }, 1500);
    } catch (error: any) {
      toast.dismiss(); // Also dismiss on error
      toast.error(error.response?.data?.message || "Failed to disable 2FA");
    }
  };

  const handleRemoveTrustedDevice = async (deviceId: string) => {
    try {
      await axios.delete(
        `${URL}/auth/trusted-devices/${user?.userId}/${deviceId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      setTrustedDevices(prev => prev.filter(device => device.deviceId !== deviceId));
      toast.success("Device removed from trusted list");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove device");
    }
  };

  const handleUpdateSecuritySettings = async () => {
    try {
      await axios.patch(
        `${URL}/auth/security-settings/${user?.userId}`,
        { securitySettings },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      toast.success("Security settings updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast.success("Backup codes copied to clipboard");
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');

    if (!backupCodes.length) {
      alert('No backup codes to download');
      return;
    }

    // Ensure we're in a browser
    if (typeof window === 'undefined') {
      console.error('Not in a browser environment');
      return;
    }

    // Method 1: Force download using modern approach
    const downloadFile = () => {
      try {
        // Create blob with proper MIME type
        const blob = new Blob([codesText], {
          type: 'text/plain;charset=utf-8'
        });

        // Create URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'trustbridge-backup-codes.txt';

        // Required for Firefox
        link.style.display = 'none';

        // Some browsers require the link to be in the DOM
        document.body.appendChild(link);

        // Simulate click
        link.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);

        return true;
      } catch (error) {
        console.error('Download failed:', error);
        return false;
      }
    };

    // Method 2: If download fails, try with a different approach
    const forceDownload = () => {
      // Try the standard method first
      if (downloadFile()) return true;

      // Alternative method: Create and remove an iframe
      try {
        const blob = new Blob([codesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;

        document.body.appendChild(iframe);

        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 100);

        return true;
      } catch (error) {
        console.error('Iframe method failed:', error);
        return false;
      }
    };

    // Method 3: Last resort - save via data URL
    const dataUrlDownload = () => {
      try {
        const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(codesText);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'trustbridge-backup-codes.txt';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => document.body.removeChild(link), 100);
        return true;
      } catch (error) {
        console.error('Data URL method failed:', error);
        return false;
      }
    };

    // Try methods in order
    if (forceDownload()) {
      // Optional: Show success message
      console.log('Download started successfully');
    } else if (dataUrlDownload()) {
      console.log('Download started via data URL');
    } else {
      // Fallback to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codesText)
          .then(() => {
            // More specific message
            const userMessage = `Backup codes copied to clipboard. 
          
Please:
1. Open a text editor (Notepad, TextEdit, etc.)
2. Paste the codes (Ctrl+V or Cmd+V)
3. Save the file as: trustbridge-backup-codes.txt

Your codes:
${codesText}`;

            alert(userMessage);
          })
          .catch(() => {
            // Ultimate fallback
            alert(`Please save these backup codes manually:\n\n${codesText}`);
          });
      } else {
        alert(`Please save these backup codes manually:\n\n${codesText}`);
      }
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (os: string) => {
    if (os.includes('Windows')) return <Monitor size={16} />;
    if (os.includes('macOS')) return <Monitor size={16} />;
    if (os.includes('Linux')) return <Monitor size={16} />;
    if (os.includes('Android')) return <Smartphone size={16} />;
    if (os.includes('iOS')) return <Smartphone size={16} />;
    return <DeviceIcon size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="text-primary-600" size={20} />
              <h2 className="text-lg font-medium text-gray-900">
                Two-Factor Authentication
              </h2>
            </div>
            <Badge
              variant={twoFactorEnabled ? "success" : "warning"}
              className="ml-2"
            >
              {twoFactorEnabled ? "Enabled" : "Not Enabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Add an extra layer of security to your account by requiring a
                verification code in addition to your password.
              </p>
              <p className="text-xs text-gray-500">
                <strong>Business Security Feature:</strong> Trusted devices won't require 2FA codes for 30 days
              </p>
            </div>
            <div className="flex gap-2">
              {twoFactorEnabled ? (
                <Button variant="outline" onClick={handleDisable2FA}>
                  Disable 2FA
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={initiate2FASetup}
                  disabled={isSettingUp2FA}
                >
                  {isSettingUp2FA ? "Setting up..." : "Enable 2FA"}
                </Button>
              )}
            </div>
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
                      1. Download an authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
                    </li>
                    <li>2. Scan this QR code with your authenticator app</li>
                    <li>3. Enter the 6-digit code below to verify</li>
                  </ol>

                  {/* QR Code */}
                  {secretData?.qrCodeUrl && (
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-48 h-48 bg-white p-4 border-2 border-gray-300 rounded-lg mb-2">
                        <img
                          src={secretData.qrCodeUrl}
                          alt="QR Code"
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-xs text-gray-600 text-center mb-4">
                        Scan with your authenticator app
                      </p>

                      <div className="w-full max-w-md">
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Or enter this code manually:
                          </label>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-sm">
                              {secretData.secret}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(secretData.secret);
                                toast.success("Secret copied to clipboard");
                              }}
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Input
                      label="Verification Code"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      disabled={isSettingUp2FA}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEnable2FA}
                        disabled={isSettingUp2FA || verificationCode.length !== 6}
                      >
                        {isSettingUp2FA ? "Verifying..." : "Verify & Enable 2FA"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowTwoFactorSetup(false);
                          setSecretData(null);
                        }}
                        disabled={isSettingUp2FA}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup Codes */}
          {showBackupCodes && backupCodes.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <Key className="text-yellow-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-900 mb-2">
                    Save Your Backup Codes
                  </h3>
                  <p className="text-sm text-yellow-800 mb-4">
                    These backup codes can be used to access your account if you lose your
                    authenticator device. <strong>Save them in a secure place!</strong> Each code can only be used once.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="bg-white border border-yellow-300 rounded-lg p-3 text-center font-mono text-sm"
                      >
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyBackupCodes}
                    >
                      <Copy size={14} className="mr-2" />
                      Copy Codes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadBackupCodes}
                    >
                      <Download size={14} className="mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowBackupCodes(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Trusted Devices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DeviceIcon className="text-primary-600" size={20} />
              <h2 className="text-lg font-medium text-gray-900">
                Trusted Devices
              </h2>
            </div>
            <Badge variant="info">
              {trustedDevices.length} devices
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            Devices that won't require 2FA verification for {securitySettings.sessionDuration} days.
          </p>

          {isLoadingDevices ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading devices...</p>
            </div>
          ) : trustedDevices.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <DeviceIcon className="mx-auto text-gray-400" size={32} />
              <p className="text-sm text-gray-600 mt-2">No trusted devices yet</p>
              <p className="text-sm text-gray-600 mt-2">
                Please logout and login again one time from your devices to add them to the trusted list.
                after enabling 2FA.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trustedDevices.map((device) => (
                <div
                  key={device.deviceId}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      {getDeviceIcon(device.os)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {device.deviceName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{device.browser}</span>
                        <span>•</span>
                        <span>{device.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Last used: {formatDate(device.lastUsed)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveTrustedDevice(device.deviceId)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="text-primary-600" size={20} />
            <h2 className="text-lg font-medium text-gray-900">
              Security Preferences
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-3">
            {/* <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Require 2FA for new devices</p>
                <p className="text-sm text-gray-600">
                  Always require 2FA verification when signing in from new devices
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.require2FAForNewDevices}
                  onChange={(e) => setSecuritySettings(prev => ({
                    ...prev,
                    require2FAForNewDevices: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div> */}

            {/* <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Remember trusted devices</p>
                <p className="text-sm text-gray-600">
                  Remember devices and don't require 2FA for {securitySettings.sessionDuration} days
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.rememberTrustedDevices}
                  onChange={(e) => setSecuritySettings(prev => ({
                    ...prev,
                    rememberTrustedDevices: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trusted device session duration (days)
              </label>
              <select
                value={securitySettings.sessionDuration}
                onChange={(e) => setSecuritySettings(prev => ({
                  ...prev,
                  sessionDuration: parseInt(e.target.value)
                }))}
                className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpdateSecuritySettings}>
              Save Preferences
            </Button>
          </div>
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