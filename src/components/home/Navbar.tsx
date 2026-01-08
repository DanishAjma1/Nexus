import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ListItem = ({ data, to }: { data: string; to: string }) => {
    return (
      <Link to={to}>
        <li className="text-white py-3 px-4 hover:cursor-pointer hover:scale-105 transition-all duration-200 hover:text-orange-300 hover:bg-white/10 rounded-lg">
          {data}
        </li>
      </Link>
    );
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Campaigns", path: "/All-Campaigns" },
    { label: "FundRaise", path: "/Fundraises" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-16 h-8 md:w-20 md:h-20 rounded-lg flex items-center justify-center shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300">
              {/* <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> */}
              <img
                src="/tab-logo1.png"
                alt="TrustBridge AI Logo"
                className="w-auto h-full object-contain"
              />
            </div>
            <h1 className="text-white text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Trust Bridge AI
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <ul className="flex flex-row items-center space-x-1 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-800/50 px-2">
              {navItems.map((item) => (
                <ListItem key={item.path} data={item.label} to={item.path} />
              ))}
            </ul>

            {/* Sign Up Button for Desktop */}
            <Link to="/register">
              <Button className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/30">
                Sign Up
              </Button>
            </Link>

            {/* Login Button for Desktop */}
            <Link to="/login">
              <Button className="ml-2 px-6 py-2 bg-transparent border border-gray-700 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Sign Up Button for Mobile (visible when menu closed) */}
            {!isMenuOpen && (
              <Link to="/register">
                <Button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-4 pt-2 pb-6 space-y-2 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 shadow-xl">
            {/* Mobile Navigation Links */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-gray-800/50 overflow-hidden">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block text-white py-4 px-6 hover:bg-white/10 transition duration-200 border-b border-gray-800/50 last:border-b-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="text-base font-medium">{item.label}</span>
                    <svg
                      className="ml-auto h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-3">
              <Link to="/register" className="block" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  Sign Up Free
                </Button>
              </Link>

              <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full py-3 bg-transparent border-2 border-gray-700 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Footer */}
            <div className="pt-6 border-t border-gray-800">
              <p className="text-center text-gray-400 text-sm">
                Join 1000+ entrepreneurs & investors
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};