import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MasterRegister() {
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    password: "",
    role: "admin",
    assignedForm: ""
  };

  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // 🟦 SPINNER STATE

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // 🟦 START SPINNER

    try {
      const response = await fetch("http://localhost:5000/api/auth/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false); // 🟥 STOP SPINNER ON ERROR
        return;
      }

      setSuccess("Admin registered successfully!");
      setForm(initialState);

    } catch (err) {
      setError("Server error. Try again.");
    }

    setLoading(false); // 🟥 STOP SPINNER
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Master Register for Admin Registration
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Only Master Admin can create new Admin accounts
        </p>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-lg text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Admin Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter admin name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Admin Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter admin password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* ASSIGN FORM */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Assign Input Form
            </label>
            <select
              name="assignedForm"
              value={form.assignedForm}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Select One Form</option>
              <option value="inputFormA">Input Form A</option>
              <option value="inputFormB">Input Form B</option>
              <option value="inputFormC">Input Form C</option>
              <option value="inputFormD">Input Form D</option>
              <option value="inputFormE">Input Form E</option>
              <option value="inputFormN">Input Form N</option>
            </select>
          </div>

          {/* SUBMIT BUTTON WITH SPINNER */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl text-lg font-semibold transition
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Register Admin"
            )}
          </button>
        </form>

        <button
          onClick={() => navigate("/master-dashboard")}
          className="w-full mt-4 bg-gray-800 text-white p-3 rounded-xl text-lg font-semibold hover:bg-gray-900 transition"
        >
          Go to Master Dashboard
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-3 bg-gray-200 text-gray-800 p-3 rounded-xl text-lg font-semibold hover:bg-gray-300 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
