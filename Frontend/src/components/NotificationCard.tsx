import { Link } from "react-router-dom";

type NotificationCardProps = {
  title: string;
  message: string;
  date: string;
  read?: boolean;
  detailsLink?: string;
};

export default function NotificationCard({
  title,
  message,
  date,
  read = false,
  detailsLink,
}: NotificationCardProps) {
  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-gray-900">
          {title}
        </h4>

        {!read && <span className="ml-3 mt-1 h-2 w-2 rounded-full bg-blue-600" />}
      </div>

      {/* Message */}
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        {message}
      </p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-400">{date}</div>
        {detailsLink && (
          <Link
            to={detailsLink}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            See details
          </Link>
        )}
      </div>
    </div>
  );
}
