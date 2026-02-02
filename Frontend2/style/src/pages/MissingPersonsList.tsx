import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MissingPersonCard from "../components/MissingPersonCard";

type MissingPerson = {
  _id: string;
  name: string;
  age?: number;
  gender?: string;
  location?: string;
  lastSeen?: string;
  status?: "recent" | "critical" | "long-term";
  image?: string;
  relation?: string;
};

export default function MissingPersonsList() {
  const [persons, setPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMissingPersons() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "http://localhost:3000/api/missing-persons",
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
  }, [navigate]);

  return (
    <div>
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Missing Persons List</h2>

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
                location={person.location}
                lastSeen={person.lastSeen}
                status={person.status}
                image={person.image}
                relation={person.relation || "Family Member"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
