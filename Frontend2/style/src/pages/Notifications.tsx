import Navbar from "../components/Navbar";
import NotificationCard from "../components/NotificationCard";

export default function Notifications() {
  // Dummy notifications
  const notifications = [
    { title: "Sighting Reported", message: "A sighting was reported for Jane Doe.", date: "2025-12-15" },
    { title: "Profile Updated", message: "Your profile information was updated.", date: "2025-12-10" },
    { title: "Missing Person Found", message: "John Smith has been found.", date: "2025-12-01" },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Notifications</h2>
        {notifications.map((n, idx) => (
          <NotificationCard key={idx} {...n} />
        ))}
      </div>
    </div>
  );
}
