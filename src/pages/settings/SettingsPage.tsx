import React, { useEffect, useMemo, useState } from "react";
import { User, Lock, Bell, Globe, Palette, CreditCard } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getEnterpreneurById, updateEntrepreneurData } from "../../data/users";
import { Entrepreneur, UserRole } from "../../types";

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [entrepreneur, setEnterpreneur] = useState<Entrepreneur>();

  useEffect(() => {
    const fetchEntrepreneur = async () => {
      const entrepreneur = await getEnterpreneurById(user?.userId);
      setEnterpreneur(entrepreneur);
    };
    fetchEntrepreneur();
  }, [user]);

  const initialData = useMemo(
  () => ({
    userId: entrepreneur?.userId || user?.userId,
    startupName: entrepreneur?.startupName || "",
    pitchSummary: entrepreneur?.pitchSummary || "",
    fundingNeeded: entrepreneur?.fundingNeeded || "",
    industry: entrepreneur?.industry || "",
    foundedYear: entrepreneur?.foundedYear ?? 0, 
    teamSize: entrepreneur?.teamSize ?? 0,       
    revenue: entrepreneur?.revenue ?? 0,         
    profitMargin: entrepreneur?.profitMargin ?? 0,
    growthRate: entrepreneur?.growthRate ?? 0,
    marketOpportunity: entrepreneur?.marketOpportunity || "",
    advantage: entrepreneur?.advantage || "",
  }),
  [entrepreneur, user]
);



  type UserDetails = {
    name?: string;
    email?: string;
    role?: UserRole | undefined;
    bio: string;
    location: string;
    avatarUrl?: string | File | null;
  };

  const initialValues: UserDetails = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
    bio: user?.bio || "",
    location: user?.location || "",
    avatarUrl: user?.avatarUrl || "",
  };

  // formData can be a partial Entrepreneur while editing
  const [formData, setFormData] = useState<Partial<Entrepreneur>>(
    initialData || {}
  );
  const [userDetails, setUserDetails] = useState<UserDetails>(initialValues);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement & { files?: FileList };
    const { name, value, files } = target;
    if (name === "avatarUrl") {
      const file = files?.[0] ?? null;
      setUserDetails((prev) => ({ ...prev, avatarUrl: file }));
      setIsFileUploaded(!!file);
    } else {
      setUserDetails((prev) => ({ ...prev, [name]: value } as UserDetails));
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) return;
    // userId guaranteed because of the guard
    updateProfile(user.userId, userDetails);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUserDetails(initialValues);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(
      (prev) => ({ ...(prev || {}), [name]: value } as Partial<Entrepreneur>)
    );
  };

  const handleUserSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await updateEntrepreneurData(formData);

    const fd = formData || {};
    const {
      startupName,
      pitchSummary,
      fundingNeeded,
      industry,
      foundedYear,
      teamSize,
      marketOpportunity,
      advantage,
      revenue,
      profitMargin,
      growthRate,
    } = fd as Partial<Entrepreneur>;

    // Ensure userId is a string when updating entrepreneur state
    setEnterpreneur({
      startupName,
      pitchSummary,
      fundingNeeded,
      industry,
      foundedYear,
      teamSize,
      marketOpportunity,
      advantage,
      revenue,
      profitMargin,
      growthRate,
    } as Entrepreneur);

    setFormData(initialData || {});
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

          {/* Update profile */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Profile Details
              </h2>
            </CardHeader>
            <CardBody>
              <form className="flex items-center">
                <div className="flex flex-row w-full gap-10">
                  <div className="flex gap-2 flex-col w-1/2">
                    <Input
                      label="Your startup name..?"
                      name="startupName"
                      value={formData.startupName}
                      onChange={handleUserChange}
                    />
                    <Input
                      label="Summary which describe your company.."
                      name="pitchSummary"
                      value={formData.pitchSummary}
                      onChange={handleUserChange}
                    />
                    <Input
                      label="In which year this company found..?"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleUserChange}
                    />

                    <Input
                      label="Industry..?"
                      name="industry"
                      value={formData.industry}
                      onChange={handleUserChange}
                    />
                    <Input
                      label="Enter the profit Margin..? (In persontage)"
                      name="profitMargin"
                      value={formData.profitMargin}
                      onChange={handleUserChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col w-1/2">
                    <Input
                      label="How much fund you need..?"
                      name="fundingNeeded"
                      value={formData.fundingNeeded}
                      onChange={handleUserChange}
                    />
                    <Input
                      label="Market opporunity..?"
                      name="marketOpportunity"
                      value={formData.marketOpportunity}
                      onChange={handleUserChange}
                    />
                    <Input
                      label="Advantage..?"
                      name="advantage"
                      value={formData.advantage}
                      onChange={handleUserChange}
                    />
                    <Input
                      label="Revenue / worth of your company..?"
                      name="revenue"
                      type="number"
                      value={formData.revenue}
                      onChange={handleUserChange}
                    />

                    <Input
                      label="Enter the Growth Rate..? (In persontage)"
                      name="growthRate"
                      value={formData.growthRate}
                      onChange={handleUserChange}
                    />
                  </div>
                </div>
              </form>

              <div className="flex justify-end pt-6 mt-6 border-t-2">
                <Button onClick={handleUserSubmit}>Save Changes</Button>
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
