import Navbar from "../components/Navbar";
import MissingPersonCard from "../components/MissingPersonCard";

export default function MissingPersonsList() {
  // Dummy data
  const persons = [
    { id: 1, name: "Jane Doe", age: 34, location: "Lagos", image: "" },
    { id: 2, name: "John Smith", age: 28, location: "Abuja", image: "" },
    { id: 3, name: "Mary Johnson", age: 19, location: "Kano", image: "" },
    { id: 4, name: "Samuel Lee", age: 45, location: "Ibadan", image: "" },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Missing Persons List</h2>
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            className="border rounded px-3 py-2 w-1/3"
            placeholder="Search by name or location"
          />
          <select className="border rounded px-3 py-2">
            <option>All Genders</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <select className="border rounded px-3 py-2">
            <option>All Ages</option>
            <option>0-18</option>
            <option>19-35</option>
            <option>36-60</option>
            <option>60+</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {persons.map((person) => (
            <MissingPersonCard key={person.id} {...person} />
          ))}
        </div>
      </div>
    </div>
  );
}
