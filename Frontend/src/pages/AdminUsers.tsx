import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiUrl } from "../utils/api";
import { ArrowLeft, Users } from "lucide-react";

type AdminUser = {
  _id: string;
  name?: string;
  email?: string;
  role?: "user" | "admin";
  isFrozen?: boolean;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(apiUrl("/api/admin/users"), {
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
          throw new Error(data.message || "Failed to load users");
        }
        const data = await res.json();
        if (isMounted) setUsers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to load users");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const toggleFreeze = async (target: AdminUser) => {
    if (!target?._id) return;
    const nextFrozen = !target.isFrozen;
    const confirmed = window.confirm(
      nextFrozen
        ? `Freeze account for ${target.name || target.email || "this user"}?`
        : `Unfreeze account for ${target.name || target.email || "this user"}?`
    );
    if (!confirmed) return;

    setActionLoadingId(target._id);
    setActionMessage(null);
    try {
      const res = await fetch(apiUrl(`/api/admin/users/${target._id}/freeze`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFrozen: nextFrozen }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update user");
      setUsers((prev) =>
        prev.map((u) => (u._id === target._id ? { ...u, isFrozen: nextFrozen } : u))
      );
      setActionMessage(data.message || "User updated");
    } catch (err: any) {
      setActionMessage(err.message || "Failed to update user");
    } finally {
      setActionLoadingId(null);
    }
  };

  const removeUser = async (target: AdminUser) => {
    if (!target?._id) return;
    const confirmed = window.confirm(
      `Remove ${target.name || target.email || "this user"}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setActionLoadingId(target._id);
    setActionMessage(null);
    try {
      const res = await fetch(apiUrl(`/api/admin/users/${target._id}`), {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to remove user");
      setUsers((prev) => prev.filter((u) => u._id !== target._id));
      setActionMessage(data.message || "User removed");
    } catch (err: any) {
      setActionMessage(err.message || "Failed to remove user");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="inline-flex items-center text-gray-700">
            <Users className="h-5 w-5 mr-2" />
            <span className="font-semibold">User Management</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          {actionMessage && (
            <p className="mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              {actionMessage}
            </p>
          )}
          {loading && <p className="text-gray-500">Loading users...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && users.length === 0 && (
            <p className="text-gray-500">No users found.</p>
          )}
          {!loading && !error && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-900">{u.name || "Unknown"}</td>
                      <td className="py-3 pr-4 text-gray-700">{u.email || "-"}</td>
                      <td className="py-3 pr-4 text-gray-700 capitalize">{u.role || "user"}</td>
                      <td className="py-3 pr-4">
                        {u.isFrozen ? (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Frozen
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={actionLoadingId === u._id || u.role === "admin"}
                            onClick={() => toggleFreeze(u)}
                            className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {u.isFrozen ? "Unfreeze" : "Freeze"}
                          </button>
                          <button
                            type="button"
                            disabled={actionLoadingId === u._id || u.role === "admin"}
                            onClick={() => removeUser(u)}
                            className="px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
