import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  AlertCircle,
  Share2,
  Heart,
  ArrowLeft,
  Shield,
  Clock,
  Users,
} from "lucide-react";

type MissingPerson = {
  _id: string;
  name: string;
  age?: number;
  gender?: string;
  lastSeenLocation?: string;
  lastSeenDate?: string;
  lastSeenTime?: string;
  description?: string;
  photoUrl?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  relationship?: string;
  status?: "missing" | "found";
};

export default function MissingPersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState<MissingPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiBaseUrl =  "http://localhost:3000";

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function fetchPerson() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${apiBaseUrl}/api/missing-persons/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch missing person");
        }

        const data = await res.json();
        if (isMounted) setPerson(data);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPerson();
    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, id, navigate]);

  const caseStatus = {
    missing: {
      label: "Active Search",
      color: "bg-blue-100 text-blue-800",
      border: "border-blue-200",
    },
    found: {
      label: "Found",
      color: "bg-green-100 text-green-800",
      border: "border-green-200",
    },
  } as const;

  const formatDate = (value?: string) => {
    if (!value) return "Unknown";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/missing-persons"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Missing Persons
        </Link>

        {loading && <div className="text-gray-600">Loading person details...</div>}
        {!loading && error && <div className="text-red-600">{error}</div>}

        {!loading && !error && person && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 mr-3">
                          {person.name}
                        </h1>
                        {person.status && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${caseStatus[person.status].color} ${caseStatus[person.status].border}`}
                          >
                            {caseStatus[person.status].label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Case ID: {person._id}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                        <img
                          src={
                            person.photoUrl
                              ? `${apiBaseUrl}${person.photoUrl}`
                              : "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
                          }
                          alt={person.name}
                          className="relative w-64 h-64 rounded-2xl object-cover border-4 border-white shadow-2xl"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Personal Details
                            </h3>
                            <div className="space-y-3">
                              {person.age !== undefined && (
                                <div className="flex items-center">
                                  <div className="w-24 text-gray-600">Age:</div>
                                  <div className="font-medium text-gray-900">
                                    {person.age} years
                                  </div>
                                </div>
                              )}
                              {person.gender && (
                                <div className="flex items-center">
                                  <div className="w-24 text-gray-600">Gender:</div>
                                  <div className="font-medium text-gray-900">
                                    {person.gender}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Last Seen
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {formatDate(person.lastSeenDate)}
                                  </div>
                                  {person.lastSeenTime && (
                                    <div className="text-sm text-gray-600">
                                      {person.lastSeenTime}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {person.lastSeenLocation && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                                  <div className="font-medium text-gray-900">
                                    {person.lastSeenLocation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Contact Information
                            </h3>
                            <div className="space-y-3">
                              {person.contactName && (
                                <div className="flex items-center">
                                  <User className="h-4 w-4 text-gray-400 mr-3" />
                                  <div className="font-medium text-gray-900">
                                    {person.contactName}
                                    {person.relationship ? ` (${person.relationship})` : ""}
                                  </div>
                                </div>
                              )}
                              {person.contactPhone && (
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                                  <a
                                    href={`tel:${person.contactPhone}`}
                                    className="font-medium text-blue-600 hover:text-blue-700"
                                  >
                                    {person.contactPhone}
                                  </a>
                                </div>
                              )}
                              {person.contactEmail && (
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                                  <a
                                    href={`mailto:${person.contactEmail}`}
                                    className="font-medium text-blue-600 hover:text-blue-700"
                                  >
                                    {person.contactEmail}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {person.description && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Description
                              </h3>
                              <p className="text-gray-900 font-medium">
                                {person.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="flex flex-wrap gap-4">
                          <Link
                            to={`/report-sighting?case=${person._id}`}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
                          >
                            Report Sighting
                          </Link>
                          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Download Poster
                          </button>
                          <button className="flex-1 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300">
                            Share Information
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  Safety Information
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <span className="text-sm text-gray-700">
                      Do not approach if you feel unsafe
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <span className="text-sm text-gray-700">
                      Note the exact time and location
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <span className="text-sm text-gray-700">
                      Take photos if safe to do so
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <span className="text-sm text-gray-700">
                      Contact authorities immediately
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
