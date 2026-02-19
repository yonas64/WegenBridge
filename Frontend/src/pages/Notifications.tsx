import Navbar from "../components/Navbar";
import NotificationCard from "../components/NotificationCard";
import { useEffect, useState } from "react";
import { apiUrl } from "../utils/api";

type NotificationItem = {
  _id: string;
  title?: string;
  message: string;
  createdAt?: string;
  read?: boolean;
  relatedMissingPerson?: string;
  relatedSighting?: string;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchNotifications() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(apiUrl("/api/notifications"), {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch notifications");
        }

        const data = await res.json();
        const list: NotificationItem[] = Array.isArray(data) ? data : [];
        if (!isMounted) return;

        setNotifications(list);

        const unread = list.filter((n) => !n.read);
        if (unread.length > 0) {
          await Promise.all(
            unread.map((n) =>
              fetch(apiUrl(`/api/notifications/${n._id}/read`), {
                method: "PATCH",
                credentials: "include",
              }).catch(() => null)
            )
          );

          if (!isMounted) return;
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          window.dispatchEvent(
            new CustomEvent("notifications:unreadCount", { detail: { count: 0 } })
          );
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (value?: string) => {
    if (!value) return "Unknown";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString();
  };

  const detailsLink = (n: NotificationItem) => {
    if (n.relatedSighting) return `/sightings/${n.relatedSighting}`;
    if (n.relatedMissingPerson) return `/missing-persons/${n.relatedMissingPerson}`;
    return "/notifications";
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Notifications</h2>
        {loading && <p className="text-gray-500">Loading notifications...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && notifications.length === 0 && (
          <p className="text-gray-500">No notifications yet.</p>
        )}
        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-4">
            {notifications.map((n) => (
              <NotificationCard
                key={n._id}
                title={n.title || "Notification"}
                message={n.message}
                date={formatDate(n.createdAt)}
                read={Boolean(n.read)}
                detailsLink={detailsLink(n)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
