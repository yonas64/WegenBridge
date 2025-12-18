import Navbar from "../components/Navbar";

export default function ReportSighting() {
  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Report Sighting</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">Select Missing Person</label>
            <select className="w-full border rounded px-3 py-2">
              <option>Jane Doe</option>
              <option>John Smith</option>
              <option>Mary Johnson</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Location</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3}></textarea>
          </div>
          <div className="mb-6">
            <label className="block mb-1">Photo</label>
            <input type="file" className="w-full" />
          </div>
          <button type="button" className="w-full bg-green-600 text-white py-2 rounded font-semibold">Submit Sighting</button>
        </form>
      </div>
    </div>
  );
}
