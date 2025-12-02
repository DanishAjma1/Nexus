import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Building2,
  CircleDollarSign,
  Users,
  MessageCircle,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  AlertTriangle,
  Rocket,
  DollarSign,
  User2Icon,
  ShieldBan,
  Briefcase,
  Shield,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
          isActive
            ? "bg-purple-800 text-purple-200"
            : "text-purple-200 hover:bg-purple-900 hover:text-purple-50"
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

interface SidebarProps {
  sidebarOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen = false, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const entrepreneurItems = [
    { to: "/dashboard/entrepreneur", icon: <Home size={20} />, text: "Dashboard" },
    { to: "/profile/entrepreneur/" + user.userId, icon: <Building2 size={20} />, text: "My Startup" },
    { to: "/investors", icon: <CircleDollarSign size={20} />, text: "Find Investors" },
    { to: "/messages", icon: <MessageCircle size={20} />, text: "Messages" },
    { to: "/notifications", icon: <Bell size={20} />, text: "Notifications" },
    { to: "/documents", icon: <FileText size={20} />, text: "Documents" },
    { to: "/viewdeals", icon: <DollarSign size={20} />, text: "View Deals" },
  ];

  const investorItems = [
    { to: "/dashboard/investor", icon: <Home size={20} />, text: "Dashboard" },
    { to: "/profile/investor/" + user.userId, icon: <CircleDollarSign size={20} />, text: "My Portfolio" },
    { to: "/entrepreneurs", icon: <Users size={20} />, text: "Find Startups" },
    { to: "/messages", icon: <MessageCircle size={20} />, text: "Messages" },
    { to: "/notifications", icon: <Bell size={20} />, text: "Notifications" },
    { to: "/deals", icon: <FileText size={20} />, text: "Deals" },
  ];

  const adminItems = [
    { to: "/dashboard/admin", icon: <Shield size={20} />, text: "Dashboard Overview" },
    { to: "/admin/all-users", icon: <Briefcase size={20} />, text: "Manage Users" },
    { to: "/admin/campaigns", icon: <Rocket size={20} />, text: "Active Campaigns" },
    { to: "/admin/supporters", icon: <User2Icon size={20} />, text: "Manage Supporters" },
    { to: "/admin/fraud-and-risk-detection", icon: <ShieldBan size={20} />, text: "Fraud and Risk Detection" },
    { to: "/admin/flaggedAccounts", icon: <AlertTriangle size={20} />, text: "Flagged Accounts" },
  ];

  const commonItems = [
    { to: "/settings", icon: <Settings size={20} />, text: "Settings" },
    { to: "/help", icon: <HelpCircle size={20} />, text: "Help & Support" },
  ];

  const sidebarItems =
    user.role === "entrepreneur"
      ? entrepreneurItems
      : user.role === "investor"
      ? investorItems
      : user.role === "admin"
      ? adminItems
      : [];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 bg-black h-full border-r border-purple-900 flex-col">
        <div className="flex-1 py-4 overflow-y-auto px-3">
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
          ))}

          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-purple-900">
          <div className="bg-purple-900 rounded-md p-3">
            <p className="text-xs text-purple-400">Need assistance?</p>
            <h4 className="text-sm font-medium text-purple-200 mt-1">Contact Support</h4>
            <a
              href="mailto:support@businessnexus.com"
              className="mt-2 inline-flex items-center text-xs font-medium text-purple-300 hover:text-purple-100"
            >
              support@businessnexus.com
            </a>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-75"
            onClick={onClose}
          />
          <div className="relative flex w-64 flex-col bg-black h-full border-r border-purple-900 overflow-y-auto">
            <div className="flex-1 py-4 px-3">
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  text={item.text}
                  onClick={onClose}
                />
              ))}

              <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  Settings
                </h3>
                <div className="mt-2 space-y-1">
                  {commonItems.map((item, index) => (
                    <SidebarItem
                      key={index}
                      to={item.to}
                      icon={item.icon}
                      text={item.text}
                      onClick={onClose}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-purple-900">
              <div className="bg-purple-900 rounded-md p-3">
                <p className="text-xs text-purple-400">Need assistance?</p>
                <h4 className="text-sm font-medium text-purple-200 mt-1">Contact Support</h4>
                <a
                  href="mailto:support@businessnexus.com"
                  className="mt-2 inline-flex items-center text-xs font-medium text-purple-300 hover:text-purple-100"
                >
                  support@businessnexus.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
