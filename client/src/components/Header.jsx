import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, admin, logoutUser, logoutAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (user) {
      logoutUser();
      navigate("/");
    } else if (admin) {
      logoutAdmin();
      navigate("/");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getAvatarInitial = () => {
    if (user && user.name) return user.name.charAt(0).toUpperCase();
    if (admin && admin.username) return admin.username.charAt(0).toUpperCase();
    return "V";
  };

  return (
    <header className="bg-transparent shadow-none sticky top-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mt-5 md:mt-7 w-[94%] md:w-auto h-14 md:h-16 mx-auto flex justify-between items-center rounded-full bg-[#0c1220]/90 border border-white/10 backdrop-blur px-4 md:px-6 shadow-lg pointer-events-auto">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2 select-none">
            {/* Mobile avatar on the far left when logged in */}
            {(user || admin) && (
              <button
                onClick={() =>
                  navigate(user ? "/dashboard" : "/admin/dashboard")
                }
                className="md:hidden w-8 h-8 rounded-full bg-white/10 border border-cyan-400/40 text-cyan-200 flex items-center justify-center mr-2"
              >
                {getAvatarInitial()}
              </button>
            )}
            <h1 className="text-2xl font-extrabold leading-none">
              <span className="text-white">VI</span>
              <span className="tech-outline align-top">SION</span>
              <span className="text-white">'25</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive("/")
                  ? "text-cyan-400 bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <Link
              to="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive("/events")
                  ? "text-cyan-400 bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Events
            </Link>
            <Link
              to="/team"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive("/team")
                  ? "text-cyan-400 bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0 0a4 4 0 100-8 4 4 0 000 8m8-4a4 4 0 110-8 4 4 0 010 8"
                />
              </svg>
              Team
            </Link>
            <Link
              to="/gallery"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive("/gallery")
                  ? "text-cyan-400 bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"
                />
              </svg>
              Gallery
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive("/contact")
                  ? "text-cyan-400 bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 10a8.38 8.38 0 01-.9 3.8l-1.1 2.2a2 2 0 01-1.8 1H7.7a2 2 0 01-1.8-1l-1.1-2.2A8.38 8.38 0 013 10V5a2 2 0 012-2h14a2 2 0 012 2v5z"
                />
              </svg>
              Contact
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-9 h-9 rounded-full bg-white/10 border border-cyan-400/40 text-cyan-200 flex items-center justify-center"
                >
                  {getAvatarInitial()}
                </button>
                <Link
                  to="/dashboard"
                  className="px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 text-sm"
                >
                  Logout
                </button>
              </>
            ) : admin ? (
              <>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="w-9 h-9 rounded-full bg-white/10 border border-red-400/40 text-red-300 flex items-center justify-center"
                >
                  {getAvatarInitial()}
                </button>
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-1.5 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-sm"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white px-2 py-1.5 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 rounded-md  hover:bg-cyan-600 text-white text-sm border-1 border-cyan-400"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile auth/menu btn */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white/80 hover:text-white p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-20 z-40 pointer-events-auto">
            <div className="mx-0 sm:mx-0 px-4">
              <div className="glass-card rounded-xl p-3 bg-[#0a0f1a]/80">
                <nav className="space-y-1">
                  <Link
                    to="/"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/")
                        ? "text-cyan-400 bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/events"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/events")
                        ? "text-cyan-400 bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Events
                  </Link>
                  <Link
                    to="/team"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/team")
                        ? "text-cyan-400 bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Team
                  </Link>
                  <Link
                    to="/gallery"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/gallery")
                        ? "text-cyan-400 bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Gallery
                  </Link>
                  <Link
                    to="/contact"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/contact")
                        ? "text-cyan-400 bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  {user && (
                    <Link
                      to="/dashboard"
                      className={`block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/5`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {admin && (
                    <Link
                      to="/admin/dashboard"
                      className={`block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/5`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </nav>
                <div className="pt-3 border-t border-white/10 mt-3">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">{user.name}</span>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  ) : admin ? (
                    <div className="flex items-center justify-between">
                      <span className="text-red-400/90">
                        Admin: {admin.username}
                      </span>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white/80 hover:text-white px-3 py-2 text-sm"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
