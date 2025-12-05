import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAccessCode }) {
  const [verified, setVerified] = useState(false);
  const [input, setInput] = useState("");
  const [closed, setClosed] = useState(false);

  // If user closes popup → go home/login
  if (closed) {
    return <Navigate to="/login" replace />;
  }

  // Show popup if code required and user not verified yet
  if (requireAccessCode && !verified) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Enter Access Code
          </h2>

          <input
            type="password"
            placeholder="Enter code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />

          <div className="flex justify-between">
            <button
              onClick={() => setClosed(true)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                if (input === "11221122") {
                  setVerified(true);
                } else {
                  alert("❌ Incorrect code");
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
