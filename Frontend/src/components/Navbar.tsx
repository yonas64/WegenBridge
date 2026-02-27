import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Bell, User, Menu, X, Heart, Home, LayoutDashboard,
  Users, AlertCircle, LogIn, UserPlus, Shield, LogOut
} from "lucide-react";
import axios from "axios";
import { apiUrl } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isLoggedIn, logout } = useAuth();
  const userRole = user?.role || null;

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
    setUnreadCount(0);
    window.dispatchEvent(
      new CustomEvent("notifications:unreadCount", { detail: { count: 0 } })
    );

    const google = (window as any).google;
    if (google?.accounts?.id?.disableAutoSelect) {
      google.accounts.id.disableAutoSelect();
    }

    await logout();
    window.location.href = "/login";
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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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

          <div className="flex items-center space-x-3">
            {isLoggedIn && (
              <Link
                to="/notifications"
                className="relative hidden lg:inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

            <div className="hidden lg:flex items-center space-x-2">
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

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute right-4 top-[68px] w-[min(22rem,calc(100vw-2rem))] bg-white border border-gray-100 rounded-xl shadow-xl">
          <div className="px-3 py-3 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}

            {isLoggedIn && (
              <Link
                to="/notifications"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            <div className="border-t border-gray-100 my-2" />

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
