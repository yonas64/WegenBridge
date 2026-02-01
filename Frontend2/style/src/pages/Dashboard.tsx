import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { 
  Search, 
  Bell, 
  Users, 
  FileText, 
  BarChart3, 
  Shield,
  Calendar,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Heart
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Total Cases", value: "1,234", change: "+12%", icon: <FileText className="h-5 w-5" />, color: "blue" },
    { label: "Active Cases", value: "567", change: "-5%", icon: <AlertCircle className="h-5 w-5" />, color: "amber" },
    { label: "Reunited", value: "345", change: "+8%", icon: <Heart className="h-5 w-5" />, color: "green" },
    { label: "Volunteers", value: "89", change: "+23%", icon: <Users className="h-5 w-5" />, color: "purple" },
  ];

  const recentActivities = [
    { id: 1, action: "New case reported", user: "Sarah Johnson", time: "10 min ago", type: "case" },
    { id: 2, action: "Sighting reported", user: "Michael Chen", time: "25 min ago", type: "sighting" },
    { id: 3, action: "Family reunited", user: "David Brown", time: "1 hour ago", type: "success" },
    { id: 4, action: "New volunteer joined", user: "Emma Wilson", time: "2 hours ago", type: "volunteer" },
  ];

  const quickActions = [
    { title: "Search Database", description: "Look through missing persons database", icon: <Search className="h-6 w-6" />, color: "blue", link: "/search" },
    { title: "View Reports", description: "Check recent sighting reports", icon: <BarChart3 className="h-6 w-6" />, color: "purple", link: "/reports" },
    { title: "Volunteer Hub", description: "Connect with volunteers", icon: <Users className="h-6 w-6" />, color: "green", link: "/volunteers" },
    { title: "Safety Tips", description: "Learn safety guidelines", icon: <Shield className="h-6 w-6" />, color: "amber", link: "/safety" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, <span className="text-yellow-300">Admin</span>
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Your work helps families reconnect every day. Here's what's happening today.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            {/* Main Action Cards */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Quick Actions
                  </h2>
                  <p className="mt-1 text-gray-600">
                    Take immediate action to help families reconnect
                  </p>
                </div>
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Link
                  to="/report-missing-person"
                  className="group bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center text-center"
                >
                  <div className="bg-white/20 p-3 rounded-lg mb-4 group-hover:bg-white/30 transition-colors">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Report Missing Person</h3>
                  <p className="text-blue-100 text-sm">
                    Submit a new missing person case
                  </p>
                </Link>

                <Link
                  to="/report-sighting"
                  className="group bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center text-center"
                >
                  <div className="bg-white/20 p-3 rounded-lg mb-4 group-hover:bg-white/30 transition-colors">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Report Sighting</h3>
                  <p className="text-green-100 text-sm">
                    Submit information about a sighting
                  </p>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="group bg-gray-50 hover:bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className={`p-2 rounded-lg bg-${action.color}-100 text-${action.color}-600 w-fit mb-3 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Cases Section */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Cases Needing Attention</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <AlertCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Case #{1000 + i} - John Doe</h4>
                      <p className="text-sm text-gray-600">Missing since {i} days ago • Lagos, Nigeria</p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Info */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-1 ${
                      activity.type === 'success' ? 'bg-green-100 text-green-600' :
                      activity.type === 'case' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'sighting' ? 'bg-amber-100 text-amber-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
                       activity.type === 'case' ? <FileText className="h-5 w-5" /> :
                       activity.type === 'sighting' ? <Search className="h-5 w-5" /> :
                       <Users className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">by {activity.user}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 text-center text-blue-600 hover:text-blue-700 font-medium py-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                View All Activity
              </button>
            </div>

            {/* Success Stories */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Today's Success Story</h3>
              </div>
              
              <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                    RA
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Rebecca & Anthony</h4>
                    <p className="text-sm text-gray-600">Reunited after 3 months</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  "Thanks to the community's support, we found our son. This platform gave us hope when we needed it most."
                </p>
              </div>
              
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>15 families reunited this week</span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 p-6 border border-red-200">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Emergency Contact</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-red-100">
                  <p className="text-sm text-gray-600 mb-1">24/7 Hotline</p>
                  <p className="text-xl font-bold text-red-600">0800-FIND-HOPE</p>
                </div>
                <p className="text-sm text-gray-700">
                  For urgent cases or immediate assistance, call our 24/7 hotline. All calls are confidential.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Last updated: Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            • <span className="text-green-600 font-medium">System Status: All Operational</span>
          </p>
        </div>
      </main>
    </div>
  );
}