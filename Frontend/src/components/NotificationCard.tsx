type NotificationCardProps = {
  title: string;
  message: string;
  date: string;
};

export default function NotificationCard({
  title,
  message,
  date,
}: NotificationCardProps) {
  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-gray-900">
          {title}
        </h4>

        {/* Unread dot (optional) */}
        <span className="ml-3 mt-1 h-2 w-2 rounded-full bg-blue-600" />
      </div>

      {/* Message */}
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        {message}
      </p>

      {/* Footer */}
      <div className="mt-3 text-xs text-gray-400">
        {date}
      </div>
    </div>
  );
}
