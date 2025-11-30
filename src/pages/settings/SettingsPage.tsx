import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  CreditCard,
} from "lucide-react";
import { User, Lock, Palette, CreditCard } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  getEnterpreneurById,
  getInvestorById,
} from "../../data/users";
import { Entrepreneur, Investor, UserRole } from "../../types";
import { InvestorSettings } from "../../components/settings/InvestorSettings";
import { EntrepreneurSettings } from "../../components/settings/EntrepreneurSettings";
import toast from "react-hot-toast";
import { getEnterpreneurById, getInvestorById } from "../../data/users";
import { Entrepreneur, Investor } from "../../types";
import { ProfileSettings } from "../../components/settings/ProfileSettings";
import { SecuritySettings } from "../../components/settings/SecuritySettings";
import { AppearanceSettings } from "../../components/settings/AppearanceSettings";
import { BillingSettings } from "../../components/settings/BillingSettings";

type SettingsTab = "profile" | "security" | "appearance" | "billing";

export const SettingsPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<Entrepreneur | Investor>();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  useEffect(() => {
    const fetchUser = async () => {
      let fetchedUser = null;
      if (currentUser?.role === "investor")
        fetchedUser = await getInvestorById(currentUser.userId);
      else if (currentUser?.role === "entrepreneur")
        fetchedUser = await getEnterpreneurById(currentUser.userId);

      setUser(fetchedUser);
    };
    fetchUser();
  }, [currentUser]);

  type UserDetails = {
    name?: string;
    email?: string;
    role?: UserRole | undefined;
    bio: string;
    location: string;
    avatarUrl?: string | File | null;
    investmentInterest?: string;
  };

  const initialValues: UserDetails = {
    name: currentUser?.name,
    email: currentUser?.email,
    role: currentUser?.role,
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
    avatarUrl: currentUser?.avatarUrl || "",
  };

  const [userDetails, setUserDetails] = useState<UserDetails>(initialValues);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement & { files?: FileList };
    const { name, value, files } = target;

    // Block special characters (allow letters, numbers, spaces)
    if (
      ["name", "bio", "location", "investmentInterest"].includes(name)
    ) {
      if (!/^[A-Za-z0-9\s]*$/.test(value)) return;
    }

    if (name === "avatarUrl") {
      const file = files?.[0] ?? null;
      setUserDetails((prev) => ({ ...prev, avatarUrl: file }));
      setIsFileUploaded(!!file);
    } else {
      setUserDetails((prev) => ({ ...prev, [name]: value } as UserDetails));
    }
  };

  const validateProfile = () => {
    const { name, bio, location, investmentInterest } = userDetails;

    if (!name?.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!/^[A-Za-z0-9\s]+$/.test(name)) {
      toast.error("Name cannot contain special characters");
      return false;
    }

    if (!bio.trim()) {
      toast.error("Bio is required");
      return false;
    }
    if (!/^[A-Za-z0-9\s]+$/.test(bio)) {
      toast.error("Bio cannot contain special characters");
      return false;
    }

    if (!location.trim()) {
      toast.error("Location is required");
      return false;
    }
    if (!/^[A-Za-z0-9\s]+$/.test(location)) {
      toast.error("Location cannot contain special characters");
      return false;
    }

    if (currentUser?.role === "investor") {
      if (!investmentInterest?.trim()) {
        toast.error("Investment Interest is required");
        return false;
      }
      if (!/^[A-Za-z0-9\s]+$/.test(investmentInterest)) {
        toast.error(
          "Investment Interest cannot contain special characters"
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) return;

    if (!validateProfile()) return;

    try {
      await updateProfile(user.userId, userDetails);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "security" as SettingsTab, label: "Security", icon: Lock },
    { id: "appearance" as SettingsTab, label: "Appearance", icon: Palette },
    { id: "billing" as SettingsTab, label: "Billing", icon: CreditCard },
  ];
  const filteredNavItems =
    currentUser?.role === "admin"
      ? navItems.filter((item) => item.id !== "billing")
      : navItems;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={user} currentUser={currentUser} />;
      case "security":
        return <SecuritySettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "billing":
        return <BillingSettings />;
      default:
        return <ProfileSettings user={user} currentUser={currentUser} />;
    }
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
        {/* Navigation */}
        <Card className="lg:col-span-1">
          <CardBody className="p-2">
            <nav className="space-y-1">
              <button
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md"
                onClick={(e) => <Navigate to={"/profile"} replace />}
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
        {/* Desktop Settings Navigation */}
        <Card className="hidden lg:block lg:col-span-1 pb-10 h-auto">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Settings</h2>
          </CardHeader>
          <CardBody>
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "text-primary-700 bg-primary-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </CardBody>
        </Card>

        {/* Main settings */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Profile Settings
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar src={user?.avatarUrl} alt={user?.name} size="xl" />
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
                  name="location"
                  value={userDetails.location}
                  onChange={handleChange}
                />
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
                <Button onClick={handleSubmit}>Save Changes</Button>
              </div>
            </CardBody>
          </Card>

          {/* Additional settings based on role */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Profile Details
              </h2>
            </CardHeader>
            <CardBody>
              {currentUser?.role === "investor" ? (
                <InvestorSettings />
              ) : (
                <EntrepreneurSettings />
              )}
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
        {/* Mobile Settings Navigation - Icon Only */}
        <div className="lg:hidden">
          <Card className="mb-4">
            <CardBody className="p-2">
              <nav className="flex justify-around items-center">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                        isActive
                          ? "text-primary-700 bg-primary-50"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      title={item.label}
                    >
                      <Icon size={24} className="mb-1" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Main settings content */}
        <div className="col-span-1 lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};
