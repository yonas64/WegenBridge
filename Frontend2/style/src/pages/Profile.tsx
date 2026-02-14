import Navbar from "../components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit3, Mail, Shield, UserCircle2 } from "lucide-react";

type ProfileUser = {
  _id: string;
  name: string;
  email: string;
  age?: number;
  role?: string;
  createdAt?: string;
  profileImage?: string;
};

type MissingPersonReport = {
  _id: string;
  name: string;
  age?: number;
  gender?: string;
  lastSeenLocation?: string;
  lastSeenDate?: string;
  description?: string;
  photoUrl?: string;
  status: "missing" | "found";
};

type SightingReport = {
  _id: string;
  location?: string;
  sightingDate?: string;
  description?: string;
  phoneNumber?: string;
  photoUrl?: string;
  missingPerson?: {
    _id: string;
    name?: string;
    status?: "missing" | "found";
  };
};

const API_BASE_URL = "http://localhost:3000";

const toDateInput = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

const formatDate = (value?: string) => {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString();
};

const imageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
};

const statusBadge = (status: "missing" | "found") =>
  status === "found"
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-blue-100 text-blue-700 border-blue-200";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [missingPersons, setMissingPersons] = useState<MissingPersonReport[]>([]);
  const [sightings, setSightings] = useState<SightingReport[]>([]);

  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", age: "", profileImage: null as File | null });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [editingMissingId, setEditingMissingId] = useState("");
  const [missingDraft, setMissingDraft] = useState({
    name: "",
    age: "",
    gender: "",
    lastSeenLocation: "",
    lastSeenDate: "",
    description: "",
    status: "missing" as "missing" | "found",
    photo: null as File | null,
  });

  const [editingSightingId, setEditingSightingId] = useState("");
  const [sightingDraft, setSightingDraft] = useState({
    location: "",
    sightingDate: "",
    description: "",
    phoneNumber: "",
    photo: null as File | null,
  });

  const totalReports = useMemo(
    () => missingPersons.length + sightings.length,
    [missingPersons.length, sightings.length]
  );

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to load profile");

      setUser(data.user || null);
      setMissingPersons(Array.isArray(data.missingPersons) ? data.missingPersons : []);
      setSightings(Array.isArray(data.sightings) ? data.sightings : []);
      setProfileForm({
        name: data.user?.name || "",
        email: data.user?.email || "",
        age: data.user?.age ? String(data.user.age) : "",
        profileImage: null,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const startProfileEdit = () => {
    setProfileMessage("");
    setProfileEditMode(true);
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age !== undefined ? String(user.age) : "",
      profileImage: null,
    });
  };

  const cancelProfileEdit = () => {
    setProfileEditMode(false);
    setProfileMessage("");
    setProfileForm((prev) => ({ ...prev, profileImage: null }));
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileMessage("");
    try {
      const form = new FormData();
      form.append("name", profileForm.name);
      form.append("email", profileForm.email);
      if (profileForm.age) form.append("age", profileForm.age);
      if (profileForm.profileImage) form.append("profileImage", profileForm.profileImage);

      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "PATCH",
        credentials: "include",
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setUser(data);
      setProfileMessage("Profile updated successfully.");
      setProfileEditMode(false);
      setProfileForm((prev) => ({ ...prev, profileImage: null }));
    } catch (err: any) {
      setProfileMessage(err.message || "Profile update failed.");
    } finally {
      setProfileSaving(false);
    }
  };

  const startEditMissing = (person: MissingPersonReport) => {
    setEditingMissingId(person._id);
    setMissingDraft({
      name: person.name || "",
      age: person.age !== undefined ? String(person.age) : "",
      gender: person.gender || "unknown",
      lastSeenLocation: person.lastSeenLocation || "",
      lastSeenDate: toDateInput(person.lastSeenDate),
      description: person.description || "",
      status: person.status || "missing",
      photo: null,
    });
  };

  const saveMissing = async (id: string) => {
    try {
      const form = new FormData();
      form.append("name", missingDraft.name);
      if (missingDraft.age) form.append("age", missingDraft.age);
      form.append("gender", missingDraft.gender);
      form.append("lastSeenLocation", missingDraft.lastSeenLocation);
      if (missingDraft.lastSeenDate) form.append("lastSeenDate", missingDraft.lastSeenDate);
      form.append("description", missingDraft.description);
      form.append("status", missingDraft.status);
      if (missingDraft.photo) form.append("photo", missingDraft.photo);

      const res = await fetch(`${API_BASE_URL}/api/missing-persons/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update report");

      setMissingPersons((prev) => prev.map((item) => (item._id === id ? data : item)));
      setEditingMissingId("");
    } catch (err: any) {
      alert(err.message || "Failed to update report");
    }
  };

  const toggleMissingStatus = async (person: MissingPersonReport) => {
    const nextStatus = person.status === "found" ? "missing" : "found";
    try {
      const res = await fetch(`${API_BASE_URL}/api/missing-persons/${person._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setMissingPersons((prev) => prev.map((item) => (item._id === person._id ? data : item)));
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const startEditSighting = (sighting: SightingReport) => {
    setEditingSightingId(sighting._id);
    setSightingDraft({
      location: sighting.location || "",
      sightingDate: toDateInput(sighting.sightingDate),
      description: sighting.description || "",
      phoneNumber: sighting.phoneNumber || "",
      photo: null,
    });
  };

  const saveSighting = async (id: string) => {
    try {
      const form = new FormData();
      form.append("location", sightingDraft.location);
      if (sightingDraft.sightingDate) form.append("sightingDate", sightingDraft.sightingDate);
      form.append("description", sightingDraft.description);
      form.append("phoneNumber", sightingDraft.phoneNumber);
      if (sightingDraft.photo) form.append("photo", sightingDraft.photo);

      const res = await fetch(`${API_BASE_URL}/api/sightings/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update sighting");

      setSightings((prev) => prev.map((item) => (item._id === id ? { ...item, ...data } : item)));
      setEditingSightingId("");
    } catch (err: any) {
      alert(err.message || "Failed to update sighting");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12 text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
            <div className="relative">
              <img
                src={imageUrl(user?.profileImage) || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"}
                alt={user?.name || "User"}
                className="w-28 h-28 rounded-2xl object-cover border border-gray-200 shadow-sm"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-md">
                <Camera className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name || "My Profile"}</h1>
                  <p className="text-gray-600 text-sm mt-1">Manage your account and all reports from one place.</p>
                </div>
                {!profileEditMode && (
                  <button
                    onClick={startProfileEdit}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {!profileEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-5">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1 flex items-center"><Mail className="h-3.5 w-3.5 mr-1" />Email</p>
                    <p className="font-medium text-gray-900 truncate">{user?.email || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1 flex items-center"><UserCircle2 className="h-3.5 w-3.5 mr-1" />Age</p>
                    <p className="font-medium text-gray-900">{user?.age ?? "-"}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1 flex items-center"><Shield className="h-3.5 w-3.5 mr-1" />Role</p>
                    <p className="font-medium text-gray-900 capitalize">{user?.role || "user"}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1">Total Reports</p>
                    <p className="font-medium text-gray-900">{totalReports}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-gray-200 p-4 bg-gray-50/60">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Name"
                      className="px-4 py-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="Email"
                      className="px-4 py-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="number"
                      value={profileForm.age}
                      onChange={(e) => setProfileForm((p) => ({ ...p, age: e.target.value }))}
                      placeholder="Age"
                      className="px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <label className="mt-3 block">
                    <span className="text-sm text-gray-600">Change profile image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileForm((p) => ({ ...p, profileImage: e.target.files?.[0] || null }))}
                      className="mt-1 block w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg bg-white"
                    />
                  </label>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={saveProfile}
                      disabled={profileSaving}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                    >
                      {profileSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelProfileEdit}
                      className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {profileMessage && <p className="text-sm text-emerald-700 mt-3">{profileMessage}</p>}
            </div>
          </div>
        </section>

        {error && <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3">{error}</div>}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Missing Person Reports</h2>
            <span className="text-sm text-gray-500">{missingPersons.length} report(s)</span>
          </div>

          {missingPersons.length === 0 && <p className="text-gray-500">No missing person reports yet.</p>}

          <div className="space-y-4">
            {missingPersons.map((person) => (
              <article key={person._id} className="border border-gray-200 rounded-xl p-4 bg-white">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={editingMissingId === person._id && missingDraft.photo ? URL.createObjectURL(missingDraft.photo) : imageUrl(person.photoUrl) || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"}
                    alt={person.name}
                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{person.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${statusBadge(person.status)}`}>{person.status}</span>
                    </div>

                    {editingMissingId === person._id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input value={missingDraft.name} onChange={(e) => setMissingDraft((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <input type="number" value={missingDraft.age} onChange={(e) => setMissingDraft((p) => ({ ...p, age: e.target.value }))} placeholder="Age" className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <input value={missingDraft.gender} onChange={(e) => setMissingDraft((p) => ({ ...p, gender: e.target.value }))} placeholder="Gender" className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <input value={missingDraft.lastSeenLocation} onChange={(e) => setMissingDraft((p) => ({ ...p, lastSeenLocation: e.target.value }))} placeholder="Last seen location" className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <input type="date" value={missingDraft.lastSeenDate} onChange={(e) => setMissingDraft((p) => ({ ...p, lastSeenDate: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <input type="file" accept="image/*" onChange={(e) => setMissingDraft((p) => ({ ...p, photo: e.target.files?.[0] || null }))} className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <textarea value={missingDraft.description} onChange={(e) => setMissingDraft((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="px-3 py-2 border border-gray-200 rounded-lg md:col-span-2" />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Location:</span> {person.lastSeenLocation || "Unknown"}</p>
                        <p><span className="font-medium">Last Seen:</span> {formatDate(person.lastSeenDate)}</p>
                        <p>{person.description || "No description"}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {editingMissingId === person._id ? (
                        <>
                          <button onClick={() => saveMissing(person._id)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
                          <button onClick={() => setEditingMissingId("")} className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => startEditMissing(person)} className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">Edit Report</button>
                      )}
                      <button onClick={() => toggleMissingStatus(person)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                        {person.status === "found" ? "Mark Missing" : "Mark Found"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Sighting Reports</h2>
            <span className="text-sm text-gray-500">{sightings.length} report(s)</span>
          </div>

          {sightings.length === 0 && <p className="text-gray-500">No sighting reports yet.</p>}

          <div className="space-y-4">
            {sightings.map((sighting) => (
              <article key={sighting._id} className="border border-gray-200 rounded-xl p-4 bg-white">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={editingSightingId === sighting._id && sightingDraft.photo ? URL.createObjectURL(sightingDraft.photo) : imageUrl(sighting.photoUrl) || "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=200&h=200&fit=crop&crop=face"}
                    alt="Sighting"
                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Case: {sighting.missingPerson?.name || "Unknown person"}</h3>

                    {editingSightingId === sighting._id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input value={sightingDraft.location} onChange={(e) => setSightingDraft((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <input type="date" value={sightingDraft.sightingDate} onChange={(e) => setSightingDraft((p) => ({ ...p, sightingDate: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <input value={sightingDraft.phoneNumber} onChange={(e) => setSightingDraft((p) => ({ ...p, phoneNumber: e.target.value }))} placeholder="Phone number" className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <input type="file" accept="image/*" onChange={(e) => setSightingDraft((p) => ({ ...p, photo: e.target.files?.[0] || null }))} className="px-3 py-2 border border-gray-200 rounded-lg" />
                        <textarea value={sightingDraft.description} onChange={(e) => setSightingDraft((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="px-3 py-2 border border-gray-200 rounded-lg md:col-span-2" />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Location:</span> {sighting.location || "Unknown"}</p>
                        <p><span className="font-medium">Date:</span> {formatDate(sighting.sightingDate)}</p>
                        <p>{sighting.description || "No description"}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      {editingSightingId === sighting._id ? (
                        <>
                          <button onClick={() => saveSighting(sighting._id)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
                          <button onClick={() => setEditingSightingId("")} className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => startEditSighting(sighting)} className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">Edit Sighting</button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
