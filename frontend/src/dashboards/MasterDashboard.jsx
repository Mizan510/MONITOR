import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MasterDashboard() {
  const navigate = useNavigate();

  const handleNavigate = (path) => navigate(path);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome to Master Dashboard
        </h2>

        {/* MENU ITEMS AS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1 */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">All Admin Controls</h3>
            <p className="text-gray-600 mb-4">Manage & control all admins</p>
            <button
              onClick={() => handleNavigate("/all-admin-control")}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
            >
              ➤ All Admin Controls
            </button>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">All User Reports</h3>
            <p className="text-gray-600 mb-4">View all report data</p>
            <button
              onClick={() => handleNavigate("/all-user-reports")}
              className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-900"
            >
              ➤ All User Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
