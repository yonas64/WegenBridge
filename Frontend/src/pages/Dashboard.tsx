import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600">
            Use the actions below to help families reconnect.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/report-missing-person"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Report Missing Person
            </Link>

            <Link
              to="/report-sighting"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              Report Sighting
            </Link>
          </div>

          <p className="mt-8 max-w-2xl text-gray-700">
            You can report missing persons, submit sightings, and browse current cases to support reunification efforts.
          </p>
        </section>
      </main>
    </div>
  );
}
