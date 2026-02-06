import Navbar from "../components/Navbar";
import MissingPersonCard from "../components/MissingPersonCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, AlertCircle, Users, Shield } from "lucide-react";

export default function Home() {
  type MissingPerson = {
    _id: string;
    name: string;
    age?: number;
    lastSeenLocation?: string;
    lastSeenDate?: string;
    photoUrl?: string;
    relationship?: string;
    status?: "missing" | "found";
    createdBy?: string;
  };

  const [persons, setPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiBaseUrl =  "http://localhost:3000";

  useEffect(() => {
    let isMounted = true;
    async function fetchMissingPersons() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:3000/api/missing-persons", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch missing persons");
        }

        const data = await res.json();
        if (isMounted) setPersons(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMissingPersons();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (value?: string) => {
    if (!value) return "Unknown";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString();
  };

  const totalCases = persons.length;
  const reunitedFamilies = persons.filter((p) => p.status === "found").length;
  const activeCases = persons.filter((p) => p.status !== "found").length;
  const volunteerCount = new Set(
    persons.map((p) => p.createdBy).filter(Boolean)
  ).size;
  const successRate =
    totalCases === 0 ? "0%" : `${Math.round((reunitedFamilies / totalCases) * 100)}%`;

  const stats = [
    { label: "Reunited Families", value: `${reunitedFamilies}`, icon: <Heart className="h-6 w-6" /> },
    { label: "Active Cases", value: `${activeCases}`, icon: <AlertCircle className="h-6 w-6" /> },
    { label: "Volunteers", value: `${volunteerCount}`, icon: <Users className="h-6 w-6" /> },
    { label: "Success Rate", value: successRate, icon: <Shield className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <main className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Bringing <span className="text-yellow-300">Families</span> Together
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Reuniting missing loved ones with their families through community support and technology
            </p>
            
           
          </div>
        </main>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-blue-100 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-center mb-3 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Quick Actions */}
        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/report-missing-person"
              className="bg-white p-6 rounded-xl border border-blue-200 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Report Missing Person</h3>
                  <p className="text-sm text-gray-600 mt-1">Submit a new case</p>
                </div>
              </div>
            </Link>
            
            <button className="bg-white p-6 rounded-xl border border-purple-200 hover:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md group">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Share Information</h3>
                  <p className="text-sm text-gray-600 mt-1">Help spread awareness</p>
                </div>
              </div>
            </button>
            
            <Link
              to="/register"
              className="bg-white p-6 rounded-xl border border-green-200 hover:border-green-400 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Become Volunteer</h3>
                  <p className="text-sm text-gray-600 mt-1">Join our community</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Missing Persons Section */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Recent Missing Persons
              </h2>
              <p className="mt-2 text-gray-600">
                Help reunite these individuals with their families
              </p>
            </div>
            <select className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Recently Added</option>
              <option>Most Viewed</option>
              <option>Longest Missing</option>
              <option>By Location</option>
            </select>
          </div>

          {loading && (
            <p className="text-gray-500">Loading missing persons...</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && persons.length === 0 && (
            <p className="text-gray-500">No missing persons found.</p>
          )}
          {!loading && !error && persons.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {persons.slice(0, 6).map((person) => (
                <MissingPersonCard
                  key={person._id}
                  id={person._id}
                  name={person.name}
                  age={person.age}
                  location={person.lastSeenLocation}
                  lastSeen={formatDate(person.lastSeenDate)}
                  image={person.photoUrl ? `${apiBaseUrl}${person.photoUrl}` : undefined}
                  relation={person.relationship || "Family Member"}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/missing-persons"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View All Missing Persons
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Every Share Brings Hope
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Your help can make a difference. Share missing person information on social media 
              to increase visibility and chances of reunion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                Download Posters
              </button>
              <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
                Share on Social Media
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Note */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-gray-400">
            If you have any information about missing persons, please contact: 
            <span className="text-yellow-300 ml-2 font-semibold">0800-FIND-HOPE</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            All information is handled with utmost care and confidentiality
          </p>
        </div>
      </footer>
    </div>
  );
}
