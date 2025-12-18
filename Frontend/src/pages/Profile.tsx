import Navbar from "../components/Navbar";

export default function Profile() {
  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <div className="bg-white rounded shadow p-6 mb-4">
          <div className="flex items-center mb-4">
            <img
              src="https://via.placeholder.com/80"
              alt="User"
              className="w-20 h-20 rounded-full object-cover mr-4"
            />
            <div>
              <div className="font-semibold text-lg">John Doe</div>
              <div className="text-gray-600">johndoe@email.com</div>
            </div>
          </div>
          <div className="mb-2 text-gray-700">Member since: Jan 2024</div>
          <div className="mb-2 text-gray-700">Reports submitted: 3</div>
          <button className="bg-blue-700 text-white px-4 py-2 rounded font-semibold mt-4">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
