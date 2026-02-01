import Navbar from "../components/Navbar";
import MissingPersonCard from "../components/MissingPersonCard";

export default function Home() {
  const samplePersons = [
    { id: 1, name: "Jane Doe", age: 34, location: "Lagos", image: "" },
    { id: 2, name: "John Smith", age: 28, location: "Abuja", image: "" },
    { id: 3, name: "Mary Johnson", age: 19, location: "Kano", image: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Family Reconnection Project
          </h1>
          <p className="mt-4 max-w-3xl text-gray-700">
            Helping families reconnect with missing loved ones. Browse missing persons,
            report sightings, or submit a new missing person report.
          </p>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Missing Persons
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {samplePersons.map((person) => (
              <MissingPersonCard key={person.id} {...person} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
