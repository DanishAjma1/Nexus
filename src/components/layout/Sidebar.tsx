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
  ClipboardCheck,
  Ban,
  Send,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${isActive
          ? "bg-primary-50 text-primary-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Entrepreneur Sidebar

  const entrepreneurItems = [
    {
      to: "/dashboard/entrepreneur",
      icon: <Home size={20} />,
      text: "Dashboard",
    },
    {
      to: "/profile/entrepreneur/" + user.userId,
      icon: <Building2 size={20} />,
      text: "My Startup",
    },
    {
      to: "/investors",
      icon: <CircleDollarSign size={20} />,
      text: "Find Investors",
    },
    { to: "/messages", icon: <MessageCircle size={20} />, text: "Messages" },
    { to: "/notifications", icon: <Bell size={20} />, text: "Notifications" },
    { to: "/documents", icon: <FileText size={20} />, text: "Documents" },
    { to: "/dashboard/campaigns", icon: <Rocket size={20} />, text: "Campaigns" },
    { to: "/deals/view-deals", icon: <DollarSign size={20} />, text: "View Deals" },
  ];

  // Investor Sidebar
  const investorItems = [
    { to: "/dashboard/investor", icon: <Home size={20} />, text: "Dashboard" },
    {
      to: "/profile/investor/" + user.userId,
      icon: <CircleDollarSign size={20} />,
      text: "My Portfolio",
    },
    { to: "/entrepreneurs", icon: <Users size={20} />, text: "Find Startups" },
    { to: "/messages", icon: <MessageCircle size={20} />, text: "Messages" },
    { to: "/notifications", icon: <Bell size={20} />, text: "Notifications" },
    { to: "/dashboard/campaigns", icon: <Rocket size={20} />, text: "Campaigns" },
    { to: "/deals/sent-deals", icon: <FileText size={20} />, text: "Sent Deals" },
  ];

  //  Admin Sidebar
  const adminItems = [
    {
      to: "/dashboard/admin",
      icon: <Shield size={20} />,
      text: "Dashboard Overview",
    },

    {
      to: "/admin/all-users",
      icon: <Briefcase size={20} />,
      text: "Manage Users",
    },
    {
      to: "/dashboard/admin/approvals",
      icon: <ClipboardCheck size={20} />,
      text: "Account Approvals",
    },
    {
      to: "/admin/campaigns",
      icon: <Rocket size={20} />,
      text: "Active Campaigns",
    },

    {
      to: "/admin/supporters",
      icon: <User2Icon size={20} />,
      text: "Manage Supporters",
    },

    {
      to: "/admin/fraud-and-risk-detection",
      icon: <ShieldBan size={20} />,
      text: "Fraud and Risk Detection",
    },
    // {
    //   to: "/admin/flaggedAccounts",
    //   icon: <AlertTriangle size={20} />,
    //   text: "Flagged Accounts",
    // },
    {
      to: "/admin/send-notification",
      icon: <Send size={20} />,
      text: "Send Global Notification",
    },
    {
      to: "/admin/suspended-blocked",
      icon: <Ban size={20} />,
      text: "Suspended & Blocked",
    },
    {
      to: "/admin/deals",
      icon: <FileText size={20} />,
      text: "Deal Records",
    },
    {
      to: "/admin/payments",
      icon: <DollarSign size={20} />,
      text: "Payment Records",
    },
    { to: "/notifications", icon: <Bell size={20} />, text: "Notifications" },
  ];

  const commonItems = [
    { to: "/settings", icon: <Settings size={20} />, text: "Settings" },
    { to: "/help", icon: <HelpCircle size={20} />, text: "Help & Support" },
  ];

  // Role-based sidebar items
  const sidebarItems =
    user.role === "entrepreneur"
      ? entrepreneurItems
      : user.role === "investor"
        ? investorItems
        : user.role === "admin"
          ? adminItems
          : [];

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </div>

          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-600">Need assistance?</p>
            <h4 className="text-sm font-medium text-gray-900 mt-1">
              Contact Support
            </h4>
            <a
              href="https://mail.google.com/mail/?view=cm&to=aitrustbridge@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
            >
              aitrustbridge@gmail.com
            </a>


          </div>
        </div>
      </div>
    </div>
  );
};