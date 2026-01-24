import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { NotificationDropdown } from "../common/NotificationDropdown";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Auto-close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const editProfileRoute = user
    ? `/settings`
    : "/login";

  // Navigation links by role
  let navLinks: { icon: JSX.Element; label: string; path: string }[] = [];
  let adminMobileLinks: { icon: JSX.Element; label: string; path: string }[] = [];

  if (user?.role === "admin") {
    navLinks = [
      {
        icon: <Shield size={18} />,
        label: "Dashboard",
        path: dashboardRoute,
      },
      {
        icon: <Briefcase size={18} />,
        label: "Users",
        path: "/admin/all-users",
      },
      {
        icon: <CircleDollarSign size={18} />,
        label: "Campaigns",
        path: "/admin/campaigns",
      },
      {
        icon: <UsersRoundIcon size={18} />,
        label: "Supporters",
        path: "/admin/Supporters",
      },
    ];
    adminMobileLinks = [
      {
        icon: <ClipboardCheck size={18} />,
        label: "Approvals",
        path: "/dashboard/admin/approvals",
      },
      {
        icon: <Ban size={18} />,
        label: "Suspended/Blocked",
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
        label: "Dashboard",
        path: dashboardRoute,
      },
      {
        icon: <MessageCircle size={18} />,
        label: "Messages",
        path: "/messages",
      },
      { icon: <User size={18} />, label: "Profile", path: profileRoute },
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
              <div className="flex items-center space-x-3">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    title={link.label}
                    aria-label={link.label}
                    className="inline-flex items-center justify-center w-10 h-10 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                  >
                    {link.icon}
                    <span className="sr-only">{link.label}</span>
                  </Link>
                ))}

                {/* Subtle divider between nav actions and profile cluster */}
                <span className="hidden md:block h-6 w-px bg-gray-200" aria-hidden="true" />

                {user && <NotificationDropdown />}

                {/* Profile dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 h-10 px-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-primary-200 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                    aria-label="Profile menu"
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                  >
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.name}
                      size="sm"
                      status={user.isOnline ? "online" : "offline"}
                    />
                    <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      {user.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${
                        isProfileMenuOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-100 bg-white shadow-lg z-50 py-1">
                      <Link
                        to={editProfileRoute}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User size={16} />
                        <span>Edit Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
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
                    {link.label}
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
                    {link.label}
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