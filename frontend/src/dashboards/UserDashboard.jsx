import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    setUserName(user.name); // Store user name
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* NAVBAR */}
      <div className="bg-white shadow p-4 rounded-xl mb-6 flex items-center justify-between">
        {/* LEFT SIDE – TITLE */}
        <div>
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Welcome User, Mr. <span className="font-semibold">{userName}</span>
          </p>
        </div>

        {/* RIGHT SIDE – LOGOUT BUTTON */}
        <Logout />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">Submit Data</h2>
          <p className="text-gray-600 mb-4">Send your Todays Data</p>
          <button
            onClick={() => navigate("/User-Submit-Form")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
}
