import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    setAdminName(user.name); // Store admin name
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* NAVBAR */}
      <div className="bg-white shadow p-4 rounded-xl mb-6 flex items-center justify-between">
        
        {/* LEFT SIDE – TITLE */}
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Welcome Admin, Mr. <span className="font-semibold">{adminName}</span>
          </p>
        </div>

        {/* RIGHT SIDE – LOGOUT BUTTON */}
        <Logout />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">User Registration</h2>
          <p className="text-gray-600 mb-4">Register your user from here</p>
          <button
            onClick={() => navigate("/admin-register")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Go for User Registration
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">My User Reports</h2>
          <p className="text-gray-600 mb-4">View all user submitted reports</p>
          <button
            onClick={() => navigate("/My-User-Reports")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            View Report
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">User Control</h2>
          <p className="text-gray-600 mb-4">Manage users and their permissions</p>
          <button
            onClick={() => navigate("/User-Control")}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
          >
            Control your User
          </button>
        </div>

      </div>
    </div>
  );
}
