import React from "react";
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 px-4 py-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-6 sm:p-8 border border-gray-100">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-3 tracking-tight">
          Contact Us
        </h1>

        <p className="text-red-600 text-center mb-10 text-xl xl:text-base">
          If don't have any account, Feel free to reach us:
        </p>

        {/* Contact Box */}
        <div className="bg-gray-100 p-4 sm:p-8 rounded-xl border border-gray-200 mb-8 shadow-sm">
          <p className="text-gray-700 text-center text-sm sm:text-base">
            📩{" "}
            <span className="font-semibold  text-xl text-gray-800">Email:</span>{" "}
            <span className="text-blue-600 text-2xl">comanfake@gmail.com</span>
          </p>
        </div>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="w-full mt-8 bg-gray-900 text-white font-semibold p-3 rounded-lg 
                     hover:bg-gray-800 transition-all shadow-md text-sm sm:text-base"
        >
          ⬅ Back to Login
        </button>
      </div>
    </div>
  );
};

export default ContactPage;
