import { Link } from "react-router-dom";

type MissingPersonCardProps = {
  id: string | number;
  name: string;
  age?: number | string;
  location?: string;
  image?: string;
};

export default function MissingPersonCard({
  id,
  name,
  age,
  location,
  image,
}: MissingPersonCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col items-center text-center">
      
      {/* Avatar */}
      <div className="relative">
        <img
          src={image || "https://via.placeholder.com/150"}
          alt={name}
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Name */}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {name}
      </h3>

      {/* Info */}
      <div className="mt-1 space-y-1 text-sm text-gray-600">
        {age && <p>Age: <span className="font-medium">{age}</span></p>}
        {location && (
          <p className="truncate max-w-[220px]">
            Last seen: <span className="font-medium">{location}</span>
          </p>
        )}
      </div>

      {/* Action */}
      <Link
        to={`/missing-persons/${id}`}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
