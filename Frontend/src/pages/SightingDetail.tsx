import Navbar from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiBaseUrl, apiUrl } from "../utils/api";

type SightingDetailType = {
  _id: string;
  location?: string;
  sightingDate?: string;
  description?: string;
  phoneNumber?: string;
  photoUrl?: string;
  missingPerson?: {
    _id?: string;
    name?: string;
    photoUrl?: string;
  };
  reportedBy?: {
    name?: string;
    email?: string;
  };
};

export default function SightingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sighting, setSighting] = useState<SightingDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function fetchDetail() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(apiUrl(`/api/sightings/detail/${id}`), {
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch sighting details");
        }

        if (isMounted) setSighting(data);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const formatDate = (value?: string) => {
    if (!value) return "Unknown";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
  };

  const imageUrl = sighting?.photoUrl ? `${apiBaseUrl}${sighting.photoUrl}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm">
          Back to notifications
        </Link>

        {loading && <p className="mt-4 text-gray-500">Loading sighting details...</p>}
        {!loading && error && <p className="mt-4 text-red-600">{error}</p>}

        {!loading && !error && sighting && (
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sighting Detail</h1>
              <p className="text-sm text-gray-500 mt-1">Sighting ID: {sighting._id}</p>
            </div>

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Sighting"
                className="w-full max-h-[420px] object-cover rounded-xl border border-gray-200"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{sighting.location || "Unknown"}</p>
              </div>
              <div>
                <p className="text-gray-500">Sighting Date</p>
                <p className="font-medium text-gray-900">{formatDate(sighting.sightingDate)}</p>
              </div>
              <div>
                <p className="text-gray-500">Reporter Phone</p>
                <p className="font-medium text-gray-900">{sighting.phoneNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500">Reporter</p>
                <p className="font-medium text-gray-900">
                  {sighting.reportedBy?.name || "Unknown"}
                  {sighting.reportedBy?.email ? ` (${sighting.reportedBy.email})` : ""}
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Description</p>
              <p className="mt-1 text-gray-900">{sighting.description || "No description provided."}</p>
            </div>

            {sighting.missingPerson?._id && (
              <Link
                to={`/missing-persons/${sighting.missingPerson._id}`}
                className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View related missing person: {sighting.missingPerson.name || "Open case"}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
