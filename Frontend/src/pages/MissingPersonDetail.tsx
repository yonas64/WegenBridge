import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router-dom";

export default function MissingPersonDetail() {
  const { id } = useParams();
  // Dummy data
  const person = {
    name: "Jane Doe",
    age: 34,
    location: "Lagos",
    description: "Last seen wearing a blue dress near the city center.",
    image: "",
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <img
            src={person.image || "https://via.placeholder.com/160"}
            alt={person.name}
            className="w-40 h-40 rounded object-cover mb-4 sm:mb-0 sm:mr-8"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{person.name}</h2>
            {id && <div className="text-sm text-gray-500 mb-1">ID: {id}</div>}
            <div className="mb-1 text-gray-700">Age: {person.age}</div>
            <div className="mb-1 text-gray-700">Last seen: {person.location}</div>
            <div className="mb-4 text-gray-700">{person.description}</div>
            <Link
              to="/report-sighting"
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
            >
              Report Sighting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
