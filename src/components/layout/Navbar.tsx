import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  MessageCircle,
  User,
  LogOut,
  Building2,
  CircleDollarSign,
  Shield,
  UsersRoundIcon,
  Briefcase,
  Handshake,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardRoute =
    user?.role === "entrepreneur"
      ? "/dashboard/entrepreneur"
      : user?.role === "investor"
      ? "/dashboard/investor"
      : user?.role === "admin"
      ? "/dashboard/admin"
      : "/login";

  const profileRoute = user ? `/profile/${user.role}/${user.userId}` : "/login";

  let navLinks: { icon: JSX.Element; text: string; path: string }[] = [];

  if (user?.role === "admin") {
    navLinks = [
      { icon: <Shield size={18} />, text: "Admin Dashboard", path: dashboardRoute },
      { icon: <Briefcase size={18} />, text: "Manage Users", path: "/admin/all-users" },
      { icon: <CircleDollarSign size={18} />, text: "Campaigns", path: "/admin/campaigns" },
      { icon: <UsersRoundIcon size={18} />, text: "Supporters", path: "/admin/Supporters" },
      { icon: <Bell size={18} />, text: "Notifications", path: "/notifications" },
    ];
  } else {
    navLinks = [
      { icon: user?.role === "entrepreneur" ? <Building2 size={18} /> : <CircleDollarSign size={18} />, text: "Dashboard", path: dashboardRoute },
      { icon: <MessageCircle size={18} />, text: "Messages", path: "/messages" },
      { icon: <Bell size={18} />, text: "Notifications", path: "/notifications" },
      { icon: <User size={18} />, text: "Profile", path: profileRoute },
    ];
  }

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-purple-900 rounded-md flex items-center justify-center">
                <Handshake className="text-white" />
              </div>
              <span className="text-lg font-bold text-purple-300 truncate">
                TrustBridge AI
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {user ? (
              <>
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="inline-flex items-center px-3 py-2 text-sm sm:text-base font-medium text-purple-200 hover:text-purple-100 hover:bg-purple-800 rounded-md transition-colors duration-200"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.text}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={18} />}
                  className="hidden sm:inline-flex text-purple-200 hover:text-purple-50"
                >
                  Logout
                </Button>
                <Link to={profileRoute} className="flex items-center space-x-2 ml-2">
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="sm"
                    status={user.isOnline ? "online" : "offline"}
                  />
                  <span className="text-sm sm:text-base font-medium text-purple-200 truncate">
                    {user.name}
                  </span>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="text-purple-200 border-purple-700 hover:bg-purple-800">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-purple-900 text-purple-200 hover:bg-purple-800">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-200 hover:text-purple-100 hover:bg-purple-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-purple-900 animate-fade-in">
          <div className="px-3 pt-2 pb-3 space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="sm"
                    status={user.isOnline ? "online" : "offline"}
                  />
                  <div className="truncate">
                    <p className="text-sm font-medium text-purple-200 truncate">{user.name}</p>
                    <p className="text-xs text-purple-400 capitalize truncate">{user.role}</p>
                  </div>
                </div>

                <div className="border-t border-purple-900 pt-2">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="flex items-center px-3 py-2 text-base font-medium text-purple-200 hover:text-purple-100 hover:bg-purple-800 rounded-md truncate"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.text}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-base font-medium text-purple-200 hover:text-purple-100 hover:bg-purple-800 rounded-md"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth className="text-purple-200 border-purple-700 hover:bg-purple-800">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button fullWidth className="bg-purple-900 text-purple-200 hover:bg-purple-800">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
