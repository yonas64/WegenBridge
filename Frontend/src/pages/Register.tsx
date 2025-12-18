import Navbar from "../components/Navbar";

export default function Register() {
  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Enter your name" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" placeholder="Enter your email" />
          </div>
          <div className="mb-6">
            <label className="block mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" placeholder="Enter your password" />
          </div>
          <button type="button" className="w-full bg-blue-700 text-white py-2 rounded font-semibold">Register</button>
        </form>
      </div>
    </div>
  );
}
