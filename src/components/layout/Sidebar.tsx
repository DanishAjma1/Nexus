import React, { useState } from "react";
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
  Menu,
  ChevronLeft,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center ${isCollapsed ? 'justify-center py-2 px-2' : 'py-2.5 px-4'} rounded-md transition-all duration-300 ${isActive
          ? "bg-primary-50 text-primary-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        } ${!isCollapsed ? 'hover:translate-x-1' : ''}`
      }
      title={isCollapsed ? text : undefined}
    >
      <span className={`${isCollapsed ? '' : 'mr-3'} transition-all duration-300 ${!isCollapsed ? 'animate-in zoom-in duration-300' : ''}`}>{icon}</span>
      {!isCollapsed && (
        <span className="text-sm font-medium animate-in fade-in slide-in-from-left-3 duration-500">
          {text}
        </span>
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white h-full border-r border-gray-200 hidden md:block transition-all duration-500 ease-in-out ${isCollapsed ? 'scale-x-95' : 'scale-x-100'}`}>
      <div className="h-full flex flex-col">
        {/* Toggle Button */}
        <div className={`p-1 border-b border-gray-200 flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:rotate-12"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Menu size={20} className="animate-in spin-in-180 duration-300" />
            ) : (
              <ChevronLeft size={20} className="animate-in spin-in-180 duration-300" />
            )}
          </button>
        </div>

        <div className="flex-1 py-1 overflow-y-auto">
          <div className={`${isCollapsed ? 'px-1' : 'px-3'} space-y-1 ${!isCollapsed ? 'animate-in slide-in-from-left duration-500' : ''}`}>
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          <div className="mt-8 px-3">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </h3>
            )}
            <div className={`${isCollapsed ? '' : 'mt-2'} space-y-1`}>
              {commonItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  text={item.text}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        </div>

        {!isCollapsed && (
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
        )}
      </div>
    </div>
  );
};
