import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ SPINNER STATE

  // 🔍 Check if any Master Admin exists
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check-admin");
        const data = await res.json();

        if (!data.exists) {
          alert("No Master Admin exists yet!");
        }
      } catch (err) {
        console.log("Server error checking admin", err);
      }
    }

    checkAdmin();
  }, []);

  // 🔄 Input change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 🚀 Submit Form
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true); // start spinner

    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const adminId = stored?._id;

      const res = await fetch("http://localhost:5000/api/auth/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          adminId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        setLoading(false); // stop spinner
        return;
      }

      setMessage("User registered successfully!");

      setForm({ name: "", email: "", password: "", role: "user" });

      setTimeout(() => navigate("/admin-dashboard"), 1500);
    } catch (err) {
      setMessage("Server error. Try again.");
    } finally {
      setLoading(false); // stop spinner always
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Admin Registration
        </h1>
        <p className="text-2xl text-red-500 font-semibold mb-1 text-center">
          User registration by Admin
        </p>

        {message && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* ✅ SUBMIT BUTTON WITH SPINNER */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? "Registering..." : "Register your User"}
          </button>
        </form>
      </div>
    </div>
  );
}
