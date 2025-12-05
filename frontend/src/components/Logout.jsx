import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    const confirmOut = window.confirm("Are you sure you want to logout?");
    if (!confirmOut) return;

    localStorage.removeItem("user"); // remove logged-in user
    navigate("/login"); // redirect
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold 
                 hover:bg-red-600 transition shadow"
    >
      Logout
    </button>
  );
}
