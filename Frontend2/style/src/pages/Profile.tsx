import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  Heart, 
  Settings, 
  Shield,
  Bell,
  LogOut
} from "lucide-react";

export default function Profile() {
  const user = {
    name: "John Doe",
    email: "johndoe@email.com",
    joinDate: "January 2024",
    reportsSubmitted: 3,
    casesFollowed: 5,
    role: "Volunteer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              {/* Profile Header */}
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-2">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <div className="text-lg font-bold text-gray-900">{user.reportsSubmitted}</div>
                  </div>
                  <div className="text-sm text-gray-600">Reports Submitted</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center mb-2">
                    <Heart className="h-5 w-5 text-purple-600 mr-2" />
                    <div className="text-lg font-bold text-gray-900">{user.casesFollowed}</div>
                  </div>
                  <div className="text-sm text-gray-600">Cases Followed</div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="font-medium text-gray-900">{user.joinDate}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Account Type</div>
                    <div className="font-medium text-gray-900">{user.role}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link
                  to="/edit-profile"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/my-reports"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">My Reports</span>
                </Link>
                
                <Link
                  to="/notifications"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Bell className="h-5 w-5 text-amber-600 mr-3" />
                  <span className="font-medium text-gray-900">Notifications</span>
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Settings className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Account Settings</span>
                </Link>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                Account Security
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Your account information is encrypted and protected.
              </p>
              <button className="w-full text-center text-green-700 hover:text-green-800 font-medium py-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                Change Password
              </button>
            </div>

            {/* Sign Out */}
            <button className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}