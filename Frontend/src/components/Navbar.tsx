import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-blue-700">
          Family Reconnection
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                : "text-gray-700 hover:text-blue-700 transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                : "text-gray-700 hover:text-blue-700 transition"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/missing-persons"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                : "text-gray-700 hover:text-blue-700 transition"
            }
          >
            Missing Persons
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                : "text-gray-700 hover:text-blue-700 transition"
            }
          >
            Notifications
          </NavLink>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 hover:text-blue-700 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
