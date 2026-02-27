import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getLocalLogs } from "../utils/siemLogger";
import { apiUrl } from "../utils/api";
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
  AlertCircle,
  Heart,
} from "lucide-react";

type DashboardStats = {
  totalCases: number;
  activeCases: number;
  reunited: number;
  volunteers: number;
  successRate: number;
};

type Activity = {
  id: string;
  action: string;
  user: string;
  time: string;
  type: "case" | "sighting" | "volunteer";
};

type RecentCase = {
  _id: string;
  name?: string;
  lastSeenDate?: string;
  lastSeenLocation?: string;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    activeCases: 0,
    reunited: 0,
    volunteers: 0,
    successRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [recentCases, setRecentCases] = useState<RecentCase[]>([]);
  const [localLogs, setLocalLogs] = useState<
    {
      level: "info" | "warn" | "error";
      event: string;
      message?: string;
      ts: string;
      context: Record<string, unknown>;
    }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(apiUrl("/api/admin/dashboard"), {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }
        if (res.status === 403) {
          navigate("/");
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load dashboard");
        }

        const data = await res.json();
        if (isMounted) {
          setStats(data.stats || {});
          setRecentActivities(Array.isArray(data.recentActivities) ? data.recentActivities : []);
          setRecentCases(Array.isArray(data.recentCases) ? data.recentCases : []);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const refreshLogs = () => {
      if (!isMounted) return;
      setLocalLogs(getLocalLogs());
    };

    refreshLogs();
    const id = window.setInterval(refreshLogs, 3000);
    return () => {
      isMounted = false;
      window.clearInterval(id);
    };
  }, []);

  const statsCards = useMemo(
    () => [
      { label: "Total Cases", value: stats.totalCases, icon: <FileText className="h-5 w-5" />, color: "blue" },
      { label: "Active Cases", value: stats.activeCases, icon: <AlertCircle className="h-5 w-5" />, color: "amber" },
      { label: "Reunited", value: stats.reunited, icon: <Heart className="h-5 w-5" />, color: "green" },
      { label: "Volunteers", value: stats.volunteers, icon: <Users className="h-5 w-5" />, color: "purple" },
    ],
    [stats]
  );

  const quickActions = [
    { title: "Search Database", description: "Look through missing persons database", icon: <Search className="h-6 w-6" />, color: "blue", link: "/missing-persons" },
    { title: "View Reports", description: "Check recent sighting reports", icon: <BarChart3 className="h-6 w-6" />, color: "purple", link: "/reports" },
    { title: "Volunteer Hub", description: "Connect with volunteers", icon: <Users className="h-6 w-6" />, color: "green", link: "/volunteer" },
    { title: "Safety Tips", description: "Learn safety guidelines", icon: <Shield className="h-6 w-6" />, color: "amber", link: "/safety" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
                <span className="font-medium">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading dashboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-500">
                      <TrendingUp className="inline h-4 w-4 mr-1" />
                      {stats.successRate}%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
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
                  <div className="mt-6">
                    <Link
                      to="/admin/users"
                      className="inline-flex items-center px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Cases Needing Attention</h3>
                  <div className="space-y-4">
                    {recentCases.map((c) => (
                      <div key={c._id} className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <AlertCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            Case #{c._id.toString().slice(-4)} - {c.name || "Unknown"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Missing since {c.lastSeenDate ? new Date(c.lastSeenDate).toLocaleDateString() : "Unknown"}
                            {c.lastSeenLocation ? ` • ${c.lastSeenLocation}` : ""}
                          </p>
                        </div>
                        <Link
                          to={`/missing-persons/${c._id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    <Bell className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-1 ${
                            activity.type === "case"
                              ? "bg-blue-100 text-blue-600"
                              : activity.type === "sighting"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {activity.type === "case" ? (
                            <FileText className="h-5 w-5" />
                          ) : activity.type === "sighting" ? (
                            <Search className="h-5 w-5" />
                          ) : (
                            <Users className="h-5 w-5" />
                          )}
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

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Frontend Logs</h3>
                    <span className="text-xs text-gray-500">
                      {localLogs.length} captured
                    </span>
                  </div>

                  {localLogs.length === 0 ? (
                    <p className="text-sm text-gray-600">No logs captured yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-auto pr-2">
                      {localLogs
                        .slice()
                        .reverse()
                        .slice(0, 30)
                        .map((log, idx) => (
                          <div
                            key={`${log.ts}-${idx}`}
                            className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-semibold uppercase ${
                                  log.level === "error"
                                    ? "text-red-600"
                                    : log.level === "warn"
                                    ? "text-amber-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {log.level}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.ts).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {log.event}
                            </div>
                            {log.message && (
                              <div className="text-xs text-gray-600">
                                {log.message}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

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
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>System activity updated from live data</span>
                  </div>
                </div>

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

            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>
                Last updated: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                • <span className="text-green-600 font-medium">System Status: All Operational</span>
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
