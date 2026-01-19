import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { Entrepreneur, Investor, UserRole } from "../../types";
import { InvestorSettings } from "./InvestorSettings";
import { EntrepreneurSettings } from "./EntrepreneurSettings";

interface ProfileSettingsProps {
  user?: Entrepreneur | Investor;
  currentUser: any;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  currentUser,
}) => {
  const { updateProfile } = useAuth();

  type UserDetails = {
    name?: string;
    email?: string;
    role?: UserRole | undefined;
    bio: string;
    location: string;
    avatarUrl?: string | File | null;
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
    // Use currentUser.userId for all roles including admin
    updateProfile(currentUser?.userId, userDetails);
  };

  return (
    <div className="space-y-6">
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
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </CardBody>
      </Card>

      {/* Update profile */}
      {currentUser?.role !== "admin" && (
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
      )}
    </div>
  );
};