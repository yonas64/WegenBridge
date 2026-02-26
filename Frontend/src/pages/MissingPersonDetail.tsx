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
import { apiBaseUrl, apiUrl } from "../utils/api";

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
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function fetchPerson() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(apiUrl(`/api/missing-persons/${id}`), {
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
  }, [id, navigate]);

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

  const getPhotoSrc = (photoUrl?: string) => {
    if (!photoUrl) return "";
    if (/^https?:\/\//i.test(photoUrl)) return photoUrl;
    return `${apiBaseUrl}${photoUrl}`;
  };

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  const handleShareInfo = async () => {
    if (!person) return;

    const shareText = [
      `Missing Person: ${person.name}`,
      person.age !== undefined ? `Age: ${person.age}` : "",
      person.gender ? `Gender: ${person.gender}` : "",
      `Last Seen Date: ${formatDate(person.lastSeenDate)}`,
      person.lastSeenLocation ? `Last Seen Location: ${person.lastSeenLocation}` : "",
      person.description ? `Description: ${person.description}` : "",
      person.contactPhone ? `Contact Phone: ${person.contactPhone}` : "",
      person.contactEmail ? `Contact Email: ${person.contactEmail}` : "",
      `Case Link: ${window.location.href}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Missing Person: ${person.name}`,
          text: shareText,
          url: window.location.href,
        });
      } else {
        await copyToClipboard(shareText);
        setActionMessage("Case information copied to clipboard.");
      }
    } catch {
      await copyToClipboard(shareText);
      setActionMessage("Case information copied to clipboard.");
    }
  };

  const handleDownloadPoster = async () => {
    if (!person) return;

    try {
      const width = 1200;
      const height = 1600;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to create poster");

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#eff6ff");
      gradient.addColorStop(1, "#fdf2f8");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#1d4ed8";
      ctx.font = "bold 86px Arial";
      ctx.fillText("MISSING PERSON", 80, 130);

      ctx.fillStyle = "#111827";
      ctx.font = "bold 72px Arial";
      ctx.fillText(person.name, 80, 230);

      const photoSrc = getPhotoSrc(person.photoUrl);
      if (photoSrc) {
        try {
          const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("image"));
            img.src = photoSrc;
          });
          ctx.drawImage(image, 80, 280, 520, 520);
        } catch {
          ctx.fillStyle = "#d1d5db";
          ctx.fillRect(80, 280, 520, 520);
        }
      } else {
        ctx.fillStyle = "#d1d5db";
        ctx.fillRect(80, 280, 520, 520);
      }

      ctx.fillStyle = "#111827";
      ctx.font = "bold 42px Arial";
      const infoX = 650;
      let infoY = 330;

      const lines = [
        person.age !== undefined ? `Age: ${person.age}` : "Age: Unknown",
        `Gender: ${person.gender || "Unknown"}`,
        `Last Seen: ${formatDate(person.lastSeenDate)}`,
        `Location: ${person.lastSeenLocation || "Unknown"}`,
        person.lastSeenTime ? `Time: ${person.lastSeenTime}` : "",
      ].filter(Boolean);

      for (const line of lines) {
        ctx.fillText(line, infoX, infoY);
        infoY += 62;
      }

      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "#dc2626";
      ctx.fillText("IF SEEN, CONTACT IMMEDIATELY", 80, 920);

      ctx.fillStyle = "#111827";
      ctx.font = "bold 40px Arial";
      if (person.contactName) {
        ctx.fillText(`Contact: ${person.contactName}`, 80, 1000);
      }
      if (person.contactPhone) {
        ctx.fillText(`Phone: ${person.contactPhone}`, 80, 1060);
      }
      if (person.contactEmail) {
        ctx.fillText(`Email: ${person.contactEmail}`, 80, 1120);
      }

      if (person.description) {
        ctx.fillStyle = "#374151";
        ctx.font = "32px Arial";
        const text = `Description: ${person.description}`;
        const maxWidth = width - 160;
        const words = text.split(" ");
        let line = "";
        let y = 1220;
        const lineHeight = 42;
        for (const word of words) {
          const testLine = `${line}${word} `;
          if (ctx.measureText(testLine).width > maxWidth) {
            ctx.fillText(line, 80, y);
            line = `${word} `;
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        if (line) ctx.fillText(line, 80, y);
      }

      ctx.fillStyle = "#6b7280";
      ctx.font = "26px Arial";
      ctx.fillText(`Case ID: ${person._id}`, 80, 1520);
      ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 80, 1560);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) throw new Error("Failed to build poster file");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${person.name.replace(/\s+/g, "_")}_missing_poster.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setActionMessage("Poster downloaded successfully.");
    } catch {
      setActionMessage("Failed to download poster.");
    }
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
        {!!actionMessage && !loading && !error && (
          <div className="mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            {actionMessage}
          </div>
        )}

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
                      <button
                        onClick={handleShareInfo}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
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
                              ? getPhotoSrc(person.photoUrl)
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
                          <button
                            onClick={handleDownloadPoster}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            Download Poster
                          </button>
                          <button
                            onClick={handleShareInfo}
                            className="flex-1 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                          >
                            Copy Information
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
