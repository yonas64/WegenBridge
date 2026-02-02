import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Search, Bell, User, Menu, X, Heart, Home, LayoutDashboard,
  Users, AlertCircle, LogIn, UserPlus, Shield, LogOut
} from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login status via backend cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true, // sends cookie automatically
        });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/missing-persons", label: "Missing Persons", icon: <Users className="h-4 w-4" /> },
    { to: "/report-missing-person", label: "Report", icon: <AlertCircle className="h-4 w-4" /> },
    { to: "/about", label: "About", icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 mr-3 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  FamilyReconnect
                </div>
                <div className="text-xs text-gray-500 -mt-1">Bringing families together</div>
              </div>
              <div className="sm:hidden text-lg font-bold text-gray-900">FR</div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-full p-1 border border-gray-200">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                        : "text-gray-700 hover:text-blue-700 hover:bg-white"
                    }`
                  }
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    <LogIn className="h-4 w-4 mr-1.5" />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm"
                  >
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    Join
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
