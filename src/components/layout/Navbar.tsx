import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  MessageCircle,
  User,
  LogOut,
  Building2,
  CircleDollarSign,
  Shield,
  UsersRoundIcon,
  Briefcase,
  Settings,
  ClipboardCheck,
  Ban,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { NotificationDropdown } from "../common/NotificationDropdown";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Auto-close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine dashboard route by role
  const dashboardRoute =
    user?.role === "entrepreneur"
      ? "/dashboard/entrepreneur"
      : user?.role === "investor"
        ? "/dashboard/investor"
        : user?.role === "admin"
          ? "/dashboard/admin"
          : "/login";

  // Determine profile route by role
  const profileRoute = user ? `/profile/${user.role}/${user.userId}` : "/login";

  // Navigation links by role
  let navLinks: { icon: JSX.Element; text: string; path: string }[] = [];
  let adminMobileLinks: { icon: JSX.Element; text: string; path: string }[] = [];

  if (user?.role === "admin") {
    navLinks = [
      {
        icon: <Shield size={18} />,
        text: "Admin Dashboard",
        path: dashboardRoute,
      },
      {
        icon: <Briefcase size={18} />,
        text: "Manage Users",
        path: "/admin/all-users",
      },
      {
        icon: <CircleDollarSign size={18} />,
        text: "Campaigns",
        path: "/admin/campaigns",
      },
      {
        icon: <UsersRoundIcon size={18} />,
        text: "Supporters",
        path: "/admin/Supporters",
      },
    ];
    adminMobileLinks = [
      {
        icon: <ClipboardCheck size={18} />,
        text: "Account Approvals",
        path: "/dashboard/admin/approvals",
      },
      {
        icon: <Ban size={18} />,
        text: "Suspended & Blocked",
        path: "/admin/suspended-blocked",
      },
    ];
  } else {
    // Normal user (entrepreneur or investor)
    navLinks = [
      {
        icon:
          user?.role === "entrepreneur" ? (
            <Building2 size={18} />
          ) : (
            <CircleDollarSign size={18} />
          ),
        text: "Dashboard",
        path: dashboardRoute,
      },
      {
        icon: <MessageCircle size={18} />,
        text: "Messages",
        path: "/messages",
      },
      { icon: <User size={18} />, text: "Profile", path: profileRoute },
    ];
  }

  return (
    <nav className="sticky top-0 bg-white shadow-sm border-b border-gray-100 backdrop-blur-sm bg-white/95 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center">
                {/* <Handshake className="text-white" /> */}
                <img
                  src="/tab-logo1.png"
                  alt="TrustBridge AI Logo"
                  className="w-auto h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-gray-900">
                TrustBridge AI
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:ml-6">
            {user ? (
              <div className="flex items-center space-x-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.text}
                  </Link>
                ))}
                {user && <NotificationDropdown />}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={18} />}
                >
                  Logout
                </Button>
                <Link
                  to={profileRoute}
                  className="flex items-center space-x-2 ml-2"
                >
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="sm"
                    status={user.isOnline ? "online" : "offline"}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && <NotificationDropdown />}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none transition-transform duration-300"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6 transform rotate-0 scale-100 transition-all duration-300" />
              ) : (
                <Menu className="block h-6 w-6 transform rotate-0 scale-100 transition-all duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-b border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div
          className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100 delay-150" : "opacity-0"
          }`}
        >
          {user ? (
            <>
              <div className="flex items-center space-x-3 px-3 py-2">
                <Avatar
                  src={user.avatarUrl}
                  alt={user.name}
                  size="sm"
                  status={user.isOnline ? "online" : "offline"}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.text}
                  </Link>
                ))}

                {/* Admin-only mobile links */}
                {adminMobileLinks.map((link, index) => (
                  <Link
                    key={`mobile-admin-${index}`}
                    to={link.path}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.text}
                  </Link>
                ))}

                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={18} className="mr-3" />
                  Settings
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2 px-3 py-2">
              <Link
                to="/login"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" fullWidth>
                  Log in
                </Button>
              </Link>
              <Link
                to="/register"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button fullWidth>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};