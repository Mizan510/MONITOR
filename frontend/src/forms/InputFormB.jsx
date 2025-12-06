// InputFormB.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import UserReportB from "../components/UserReportB";
import SBUB from "../products/SBU-B";

const InputFormB = () => {
  const initialState = {};
  const [FormDataB, setFormDataB] = useState(initialState);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [allReports, setAllReports] = useState([]);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // <-- Loading state

  // Load logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))?.name || "";
    setLoggedInUser(user);
  }, []);

  // Fetch all reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(
        "https://monitor-r0u9.onrender.com/api/form-datab"
      );
      setAllReports(res.data);

      // Check if user already submitted today
      const today = new Date().toISOString().slice(0, 10);
      const submittedToday = res.data.some(
        (r) =>
          r.userName === loggedInUser &&
          new Date(r.createdAt).toISOString().slice(0, 10) === today
      );
      setAlreadySubmitted(submittedToday);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reports");
    }
  };

  useEffect(() => {
    if (loggedInUser) fetchReports();
  }, [loggedInUser]);

  const handleChange = (e) =>
    setFormDataB({ ...FormDataB, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser) return alert("Logged-in user not detected!");
    if (alreadySubmitted) {
      alert("You have already submitted today's report!");
      return;
    }

    setIsLoading(true); // <-- Start loading

    try {
      await axios.post("https://monitor-r0u9.onrender.com/api/form-datab", {
        ...FormDataB,
        userName: loggedInUser,
      });
      alert("Form submitted successfully!");
      setFormDataB(initialState);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Failed to submit form");
    } finally {
      setIsLoading(false); // <-- Stop loading
    }
  };

  return (
    <div className="p-4 w-full max-w-5xl mx-auto border rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Input Form for SBU-B</h2>

      {alreadySubmitted && (
        <p className="text-red-600 font-bold text-lg mb-2">
          You have already submitted today's report. Try again tomorrow.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="userName"
          value={loggedInUser}
          readOnly
          className="border px-2 py-1 w-full bg-gray-100"
        />

        <SBUB
          FormDataB={FormDataB}
          handleChange={handleChange}
          disabled={alreadySubmitted || isLoading} // disable inputs while loading
        />

        <div className="flex gap-2 flex-wrap">
          {/* Submit Button with Spinner */}
          <button
            type="submit"
            disabled={alreadySubmitted || isLoading}
            className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${
              alreadySubmitted || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading && (
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
            {isLoading
              ? "Submitting..."
              : alreadySubmitted
              ? "Already Submitted"
              : "Submit"}
          </button>
        </div>
      </form>

      {loggedInUser && (
        <UserReportB loggedInUser={loggedInUser} allReports={allReports} />
      )}
    </div>
  );
};

export default InputFormB;
