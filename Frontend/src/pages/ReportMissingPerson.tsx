import Navbar from "../components/Navbar";

export default function ReportMissingPerson() {
  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Report Missing Person</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Age</label>
            <input type="number" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Gender</label>
            <select className="w-full border rounded px-3 py-2">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Last Seen Location</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3}></textarea>
          </div>
          <div className="mb-6">
            <label className="block mb-1">Photo</label>
            <input type="file" className="w-full" />
          </div>
          <button type="button" className="w-full bg-blue-700 text-white py-2 rounded font-semibold">Submit Report</button>
        </form>
      </div>
    </div>
  );
}
