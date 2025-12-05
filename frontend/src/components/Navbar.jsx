import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  // LOGOUT HANDLER
  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="w-full bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">Master Dashboard</h1>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="hidden md:block bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
      >
        Logout
      </button>
    </nav>
  );
}
