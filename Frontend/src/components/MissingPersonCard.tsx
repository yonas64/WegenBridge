import { Link } from "react-router-dom";
import { User, MapPin, Calendar, Heart, Share2, AlertCircle } from "lucide-react";

type MissingPersonCardProps = {
  id: string | number;
  name: string;
  age?: number | string;
  location?: string;
  image?: string;
  lastSeen?: string;
  relation?: string;
  status?: "missing" | "found";
};

export default function MissingPersonCard(props: MissingPersonCardProps) {
  const {
    id,
    name,
    age,
    location,
    image,
    lastSeen = "Unknown",
    relation = "Family Member",
    status = "missing"
  } = props;
  // Status colors
  const statusColors = {
    missing: "bg-blue-100 text-blue-800 border-blue-200",
    found: "bg-green-100 text-green-800 border-green-200"
  };

  // Status labels
  const statusLabels = {
    missing: "Missing",
    found: "Found"
  };

  return (
    <div className="group bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6 flex flex-col h-full">
      
      {/* Header with Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}>
          <AlertCircle className="w-3 h-3 mr-1" />
          {statusLabels[status]}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Avatar with Gradient Border */}
      <div className="relative mx-auto -mt-2 mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
        <div className="relative">
          <img
            src={image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face"}
            alt={name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Name and Relation */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-blue-600 font-medium mt-1">
          {relation}
        </p>
      </div>

      {/* Info Grid */}
      <div className="bg-white/80 rounded-xl p-4 mb-5 border border-gray-100">
        <div className="space-y-3">
          {age && (
            <div className="flex items-center text-gray-700">
              <User className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-gray-500">Age</span>
                <p className="font-semibold text-gray-900">{age} years</p>
              </div>
            </div>
          )}
          
          {location && (
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4 text-red-500 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-gray-500">Last Seen Location</span>
                <p className="font-semibold text-gray-900">{location}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 text-amber-500 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-sm text-gray-500">Last Seen</span>
              <p className="font-semibold text-gray-900">{lastSeen}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex gap-3">
        <Link
          to={`/missing-persons/${id}`}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold text-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          View Full Details
        </Link>
        {/* <button className="p-3 bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors duration-300 border border-gray-200 hover:border-blue-300">
         <Share2 className="w-5 h-5" />
        </button> */}
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          24+ views
        </span>
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          3 tips
        </span>
      </div>
    </div>
  );
}
