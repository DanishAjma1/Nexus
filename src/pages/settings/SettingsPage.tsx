import React, { useState } from "react";
import { User, Lock, Bell, Globe, Palette, CreditCard } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, userData } = useAuth();

  if (!user || !userData) return null;

  const initialValues = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    bio: userData.bio || "",
    location: userData.location || "",
    avatarUrl: userData.avatarUrl || "",
  };
  const [userDetails, setUserDetails] = useState(initialValues);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const handleChange = (e: Event) => {
    const { name, value, files } = e.target;
    if (name === "avatarUrl") {
      setUserDetails({ ...userDetails, [name]: files[0] });
      setIsFileUploaded(true);
    } else {
      setUserDetails({ ...userDetails, [name]: value });
    }
  };
  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    updateProfile(userData.userId, userDetails);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setUserDetails(initialValues);
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings navigation */}
        <Card className="lg:col-span-1">
          <CardBody className="p-2">
            <nav className="space-y-1">
              <button
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md"
                onClick={(e) => {
                  <Navigate to={"/profile"} replace />;
                }}
              >
                <User size={18} className="mr-3" />
                Profile
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Lock size={18} className="mr-3" />
                Security
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Bell size={18} className="mr-3" />
                Notifications
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Globe size={18} className="mr-3" />
                Language
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Palette size={18} className="mr-3" />
                Appearance
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <CreditCard size={18} className="mr-3" />
                Billing
              </button>
            </nav>
          </CardBody>
        </Card>

        {/* Main settings content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Profile Settings
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar src={user.avatarUrl} alt={user.name} size="xl" />

                <div>
                  <Button variant="outline" size="sm">
                    <label htmlFor="upload-file" className="cursor-pointer">
                      {isFileUploaded ? "Profile updated" : "Change Photo"}
                    </label>
                  </Button>

                  <input
                    type="file"
                    id="upload-file"
                    accept=".jpg, .png, .jpeg"
                    hidden
                    name="avatarUrl"
                    onChange={handleChange}
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={userDetails.name}
                  onChange={handleChange}
                />

                <Input label="Email" value={userDetails.email} disabled />
                <Input
                  label="Location"
                  onChange={handleChange}
                  name="location"
                  value={userDetails.location}
                />

                <Input label="Role" value={userDetails.role} disabled />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={4}
                  name="bio"
                  onChange={handleChange}
                  value={userDetails.bio}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
              </div>
            </CardBody>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Security Settings
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                    <Badge variant="error" className="mt-1">
                      Not Enabled
                    </Badge>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <Input label="Current Password" type="password" />

                  <Input label="New Password" type="password" />

                  <Input label="Confirm New Password" type="password" />

                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
