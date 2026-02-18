import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MissingPersonCard from "../components/MissingPersonCard";
import { apiBaseUrl, apiUrl } from "../utils/api";

type MissingPerson = {
  _id: string;
  name: string;
  age?: number;
  gender?: string;
  lastSeenLocation?: string;
  lastSeenDate?: string;
  status?: "missing" | "found";
  photoUrl?: string;
  relationship?: string;
};

export default function MissingPersonsList() {
  const [persons, setPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    q: "",
    gender: "",
    status: "missing",
    location: "",
    fromDate: "",
    toDate: "",
    ageMin: "",
    ageMax: "",
    sort: "createdAt:desc",
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const formatDate = (value?: string) => {
    if (!value) return "Unknown";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString();
  };

  useEffect(() => {
    async function fetchMissingPersons() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          apiUrl(`/api/missing-persons?${queryString}`),
          {
            method: "GET",
            credentials: "include", // 🍪 SEND COOKIE
          }
        );

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch missing persons");
        }

        const data = await res.json();
        setPersons(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchMissingPersons();
  }, [navigate, queryString]);

  return (
    <div>
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Missing Persons List</h2>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Search name, location, description..."
          />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Filter by location"
          />
          <select
            name="gender"
            value={filters.gender}
            onChange={(e) => setFilters((p) => ({ ...p, gender: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">All genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">All statuses</option>
            <option value="missing">Missing</option>
            <option value="found">Found</option>
          </select>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={(e) => setFilters((p) => ({ ...p, fromDate: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={(e) => setFilters((p) => ({ ...p, toDate: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <input
            type="number"
            name="ageMin"
            value={filters.ageMin}
            onChange={(e) => setFilters((p) => ({ ...p, ageMin: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Min age"
            min="0"
          />
          <input
            type="number"
            name="ageMax"
            value={filters.ageMax}
            onChange={(e) => setFilters((p) => ({ ...p, ageMax: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Max age"
            min="0"
          />
          <select
            name="sort"
            value={filters.sort}
            onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="lastSeenDate:desc">Last Seen (Newest)</option>
            <option value="lastSeenDate:asc">Last Seen (Oldest)</option>
            <option value="age:asc">Age (Youngest)</option>
            <option value="age:desc">Age (Oldest)</option>
          </select>
          <button
            type="button"
            onClick={() =>
              setFilters({
                q: "",
                gender: "",
                status: "missing",
                location: "",
                fromDate: "",
                toDate: "",
                ageMin: "",
                ageMax: "",
                sort: "createdAt:desc",
              })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>

        {loading && (
          <p className="text-gray-500">Loading missing persons...</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && persons.length === 0 && (
          <p className="text-gray-500">No missing persons found.</p>
        )}

        {!loading && !error && persons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {persons.map((person) => (
              <MissingPersonCard
                key={person._id}
                id={person._id}
                name={person.name}
                age={person.age}
                location={person.lastSeenLocation}
                lastSeen={formatDate(person.lastSeenDate)}
                status={person.status}
                image={person.photoUrl ? `${apiBaseUrl}${person.photoUrl}` : undefined}
                relation={person.relationship || "Family Member"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
