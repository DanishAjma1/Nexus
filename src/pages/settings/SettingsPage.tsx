import React, { useEffect, useState } from "react";
import { User, Lock, Palette, CreditCard } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
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
        fetchedUser = await getInvestorById(currentUser?.userId);
      else if (currentUser?.role === "entrepreneur")
        fetchedUser = await getEnterpreneurById(currentUser?.userId);

      setUser(fetchedUser);
    };
    fetchUser();
  }, [currentUser]);

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
