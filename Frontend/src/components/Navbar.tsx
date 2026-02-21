import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Search, Bell, User, Menu, X, Heart, Home, LayoutDashboard,
  Users, AlertCircle, LogIn, UserPlus, Shield, LogOut
} from "lucide-react";
import axios from "axios";
import { apiUrl } from "../utils/api";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  // ✅ Check login status via backend cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(apiUrl("/api/auth/me"), {
          withCredentials: true,
          headers: { "Cache-Control": "no-cache" },
          params: { t: Date.now() },
        });
        setIsLoggedIn(true);
        setUserRole(res.data?.role || null);
      } catch {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(apiUrl("/api/notifications"), {
          withCredentials: true,
        });
        const unread = Array.isArray(res.data)
          ? res.data.filter((n: { read?: boolean }) => !n.read).length
          : 0;
        setUnreadCount(unread);
      } catch {
        setUnreadCount(0);
      }
    };

    fetchNotifications();

    const onUnreadCountEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ count?: number }>;
      const count = customEvent.detail?.count;
      if (typeof count === "number") {
        setUnreadCount(Math.max(0, count));
      }
    };

    window.addEventListener("notifications:unreadCount", onUnreadCountEvent as EventListener);
    return () => {
      window.removeEventListener(
        "notifications:unreadCount",
        onUnreadCountEvent as EventListener
      );
    };
  }, [isLoggedIn]);

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUnreadCount(0);
    window.dispatchEvent(
      new CustomEvent("notifications:unreadCount", { detail: { count: 0 } })
    );

    try {
      await axios.post(apiUrl("/api/auth/logout"), {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      window.location.href = "/login";
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    ...(userRole === "admin"
      ? [{ to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }]
      : []),
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
            {isLoggedIn && (
              <Link
                to="/notifications"
                className="relative hidden md:inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 mr-1.5" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </button>
                </>
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

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
