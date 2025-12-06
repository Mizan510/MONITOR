import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const navigate = useNavigate();

  // CHECK IF ANY ADMIN EXISTS
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check-admin");
        const data = await res.json();
        if (!data.exists) {
          alert("No admin registered yet!");
        }
      } catch (err) {
        console.log("Check admin error:", err);
      }
    }
    checkAdmin();
  }, []);

  // HANDLE INPUT
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // LOGIN
async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setLoading(true); // ✅ Start spinner

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    // ------------------------------
    // 1️⃣ Check if account inactive
    // ------------------------------
    if (data.inactive) {
      alert(data.message || "Your account is inactive.");
      setLoading(false);
      return; // Stop login
    }

    // // ------------------------------
    // // 2️⃣ Check if subscription expired
    // // ------------------------------
    // if (data.expired) {
    //   alert(data.message || "Your subscription has expired.");
    //   setLoading(false);
    //   return; // Stop login
    // }

    // ------------------------------
    // 3️⃣ Successful login
    // ------------------------------
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));

      // ⭐ ROLE-BASED REDIRECT
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "user") {
        navigate("/user-dashboard");
      } else if (data.user.role === "superadmin") {
        navigate("/master-dashboard");
      } else {
        navigate("/login"); // fallback
      }
    } else {
      setError(data.message || "Login failed");
    }
  } catch (err) {
    setError("Server error. Try again.");
  } finally {
    setLoading(false); // ✅ Stop spinner
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl  rounded-3xl p-10 border border-gray-200">
        {/* MASTER ADMIN REGISTER LINK */}
        <h1
          onClick={() => navigate("/master-register")}
          className="text-4xl font-bold text-gray-800 text-center mb-2"
        >
          Welcome Back
        </h1>
        <p className="text-center text-gray-800 mb-8">
          Login to continue your access
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-center font-medium mb-4">{error}</p>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 rounded-lg p-3"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="w-full border border-gray-300 rounded-lg p-3"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* SUBMIT BUTTON WITH SPINNER */}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-semibold p-3 rounded-lg text-lg flex justify-center items-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Contact to Master admin */}
        <p className="text-center mt-5 text-gray-700">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/Contact-Page")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register Here
          </button>
        </p>

        {/* BACK TO HOME BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-6 bg-gray-200 text-gray-700 font-semibold p-3 rounded-lg 
                     hover:bg-gray-300 transition-all"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
