import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Heart,
  Home,
  LayoutDashboard,
  Users,
  AlertCircle,
  LogIn,
  UserPlus,
  Shield,
  LogOut
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in by looking for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login"; // redirect to login page
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
              <div className="sm:hidden text-lg font-bold text-gray-900">
                FR
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - Center Aligned */}
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
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                  3
                </span>
              </Link>

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
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fadeIn">
            <div className="space-y-1 px-2 mb-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="px-2 space-y-3">
              {isLoggedIn ? (
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="flex items-center justify-center w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </nav>
  );
}
