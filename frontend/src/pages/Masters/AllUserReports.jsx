import React, { useEffect, useState } from "react";
import axios from "axios";
// Import all report components
import UserReportA from "../../components/UserReportA";
import UserReportB from "../../components/UserReportB";
import UserReportC from "../../components/UserReportC";
import UserReportD from "../../components/UserReportD";
import UserReportE from "../../components/UserReportE";
import UserReportN from "../../components/UserReportN";

const AllUserReports = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [usersUnderAdmin, setUsersUnderAdmin] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [allReports, setAllReports] = useState([]);
  const [deleteDate, setDeleteDate] = useState("");
  const [startDate, setStartDate] = useState(""); // <-- define startDate
  const [endDate, setEndDate] = useState(""); // <-- define endDate

  const masterName = "Md. Mizanur Rahman";

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/get-admins");
      setAdmins(res.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  // Fetch users under selected admin
  const fetchUsersUnderAdmin = async (adminId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/my-users/${adminId}`
      );
      setUsersUnderAdmin(res.data.users || []);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  // Fetch all reports (A, B, C, D, E, N)
  const fetchReports = async () => {
    try {
      const endpoints = [
        "http://localhost:5000/api/form-dataa",
        "http://localhost:5000/api/form-datab",
        "http://localhost:5000/api/form-datac",
        "http://localhost:5000/api/form-datad",
        "http://localhost:5000/api/form-datae",
        "http://localhost:5000/api/form-datan",
      ];

      const responses = await Promise.all(
        endpoints.map((url) => axios.get(url))
      );

      // Merge all reports into a single array
      const combined = responses.flatMap((res) => res.data);

      setAllReports(combined);
    } catch (err) {
      console.error("Report fetch error:", err.response?.data || err.message);
    }
  };

  // Usage in useEffect
  useEffect(() => {
    fetchAdmins();
    fetchReports(); // Fetch all reports this way
  }, []);

  useEffect(() => {
    if (selectedAdmin) {
      fetchUsersUnderAdmin(selectedAdmin);
      setSelectedUser("");
    }
  }, [selectedAdmin]);

  // -----------------------------------------
  // 🗑 DELETE DATA BY DATE RANGE
  // -----------------------------------------
  const deleteByDateRange = async () => {
  if (!selectedUser) return alert("Select a user first");
  if (!startDate || !endDate) return alert("Select start and end date");

  if (!window.confirm(
    `Delete all reports for ${selectedUser} from ${startDate} to ${endDate}?`
  )) return;

  const routes = ["A", "B", "C", "D", "E", "N"];

  try {
    const results = await Promise.allSettled(
      routes.map((r) =>
        axios.delete(`http://localhost:5000/api/form-data${r}/delete-by-date-range`, {
          params: { user: selectedUser, startDate, endDate }
        })
      )
    );

    // OPTIONAL: Log which routes failed
    results.forEach((res, idx) => {
      if (res.status === "rejected") {
        console.warn(`Route ${routes[idx]} delete failed`, res.reason);
      }
    });

    alert("Reports deleted successfully");

    try {
      await fetchAllReports();
    } catch (err) {
      console.error("Refresh failed:", err);
    }

  } catch (err) {
    console.error(err);
    alert("Unexpected error (should not happen)");
  }
};


  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Master – All User Reports
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Master
          </label>
          <select
            value={masterName}
            disabled
            className="w-full border px-3 py-2 rounded-lg bg-gray-100"
          >
            <option>{masterName}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Select Admin
          </label>
          <select
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">-- Select Admin --</option>
            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Select User Under Admin
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={!selectedAdmin}
            className="w-full border px-3 py-2 rounded-lg disabled:bg-gray-100"
          >
            <option value="">-- Select User --</option>
            {usersUnderAdmin.map((user) => (
              <option key={user._id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DELETE BY DATE RANGE */}
      {selectedUser && (
        <div className="mb-10 bg-red-50 p-5 rounded-lg border border-red-300">
          <h3 className="text-xl font-bold mb-3 text-red-700">
            Delete Reports by Date Range
          </h3>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded-lg"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded-lg"
              placeholder="End Date"
            />

            <button
              onClick={deleteByDateRange}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete Reports in Range
            </button>
          </div>
        </div>
      )}

      {selectedUser ? (
        <>
          {admins.find((a) => a._id === selectedAdmin)?.name.includes("A") && (
            <UserReportA
              loggedInUser={selectedUser}
              allReports={allReports}
              showUserName
            />
          )}
          {admins.find((a) => a._id === selectedAdmin)?.name.includes("B") && (
            <UserReportB
              loggedInUser={selectedUser}
              allReports={allReports}
              showUserName
            />
          )}
          {admins.find((a) => a._id === selectedAdmin)?.name.includes("C") && (
            <UserReportC
              loggedInUser={selectedUser}
              allReports={allReports}
              showUserName
            />
          )}
          {admins.find((a) => a._id === selectedAdmin)?.name.includes("D") && (
            <UserReportD
              loggedInUser={selectedUser}
              allReports={allReports}
              showUserName
            />
          )}
          {admins.find((a) => a._id === selectedAdmin)?.name.includes("E") && (
            <UserReportE
              loggedInUser={selectedUser}
              allReports={allReports}
              showUserName
            />
          )}
          {admins.find((a) => a._id === selectedAdmin)?.name.includes("N") && (
            <UserReportN
              loggedInUser={selectedUser}
              allReports={allReports}
              showUserName
            />
          )}
        </>
      ) : (
        <p className="text-red-600 text-center text-lg font-semibold">
          Select admin and user to view reports
        </p>
      )}
    </div>
  );
};

export default AllUserReports;
