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
      end
      className={({ isActive }) =>
        `flex items-center gap-3 ${isCollapsed ? 'justify-center py-3 px-2' : isActive ? 'py-2.5 px-4' : 'py-2.5 px-4 mx-2'} rounded-lg transition-all duration-200 ${isActive
          ? "bg-primary-500 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
      title={isCollapsed ? text : undefined}
    >
      <span className="transition-all duration-200">{icon}</span>
      {!isCollapsed && (
        <span className="text-sm font-medium truncate">
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

  // Filter common items - admin doesn't see Help & Support
  const filteredCommonItems = user.role === "admin" 
    ? commonItems.filter(item => item.to !== "/help")
    : commonItems;

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white h-full border-r border-gray-100 hidden md:block transition-all duration-400 ease-out shadow-sm`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`p-1 border-b border-gray-100 flex ${isCollapsed ? 'justify-center' : 'justify-end'} h-16`}>
          
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

          <div className="mt-8 pt-4 border-t border-gray-100">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                More
              </h3>
            )}
            <div className={`${isCollapsed ? 'px-2' : 'px-2'} space-y-0.5`}>
              {filteredCommonItems.map((item, index) => (
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
          <div className="p-4 border-t border-gray-100">
            <a
              href="https://mail.google.com/mail/?view=cm&to=aitrustbridge@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary-50 to-blue-50 hover:from-primary-100 hover:to-blue-100 transition-all duration-200 group cursor-pointer"
            >
              <div className="text-2xl">💬</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700">Need help?</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors truncate">
                  Contact support
                </p>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
