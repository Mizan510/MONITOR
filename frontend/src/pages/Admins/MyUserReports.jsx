import React, { useState, useEffect } from "react";
import axios from "axios";
// Import all report components
import UserReportA from "../../components/UserReportA";
import UserReportB from "../../components/UserReportB";
import UserReportC from "../../components/UserReportC";
import UserReportD from "../../components/UserReportD";
import UserReportE from "../../components/UserReportE";
import UserReportN from "../../components/UserReportN";

const MyUserReports = () => {
  const [allReports, setAllReports] = useState([]);
  const [adminName, setAdminName] = useState("");

  const [usersUnderAdmin, setUsersUnderAdmin] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Load admin name
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("user"));
    setAdminName(admin?.name || "");
  }, []);

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

    // merge all  
    let combined = responses.flatMap((res) => res.data);

    setAllReports(combined);
  } catch (err) {
    console.error("Fetch error:", err.response?.data || err.message);
  }
};


  // Fetch users created by this admin
  const fetchUsers = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem("user"));
      const adminId = admin?._id;

      if (!adminId) return;

      const res = await axios.get(
        `http://localhost:5000/api/auth/my-users/${adminId}`
      );

      setUsersUnderAdmin(res.data.users);
    } catch (err) {
      console.error("User fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (adminName) {
      fetchReports();
      fetchUsers();
    }
  }, [adminName]);

// Show either selected user or all users under this admin
const filteredReports = selectedUser
  ? allReports.filter(r => r.userName === selectedUser)
  : allReports.filter(r =>
      usersUnderAdmin.some(u => u.name === r.userName)
    );



  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        User Reports Dashboard
      </h2>{" "}
      {/* Filters Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Logged-in Admin
            </label>
            <select
              value={adminName}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 font-semibold shadow-sm cursor-not-allowed"
            >
              <option>{adminName}</option>
            </select>
          </div>

          {/* User Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select User Under This Admin
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
      </div>
      {/* Reports Section */}
      <div className="mt-4">
  {adminName.includes("A") && (
    <UserReportA
      loggedInUser={selectedUser}
      allReports={filteredReports}
      usersUnderAdmin={usersUnderAdmin}
      showUserName
    />
  )}

  {adminName.includes("B") && (
    <UserReportB
      loggedInUser={selectedUser}
      allReports={filteredReports}
      usersUnderAdmin={usersUnderAdmin}
      showUserName
    />
  )}

  {adminName.includes("C") && (
    <UserReportC
      loggedInUser={selectedUser}
      allReports={filteredReports}
      usersUnderAdmin={usersUnderAdmin}
      showUserName
    />
  )}

  {adminName.includes("D") && (
    <UserReportD
      loggedInUser={selectedUser}
      allReports={filteredReports}
      usersUnderAdmin={usersUnderAdmin}
      showUserName
    />
  )}

  {adminName.includes("E") && (
    <UserReportE
      loggedInUser={selectedUser}
      allReports={filteredReports}
      usersUnderAdmin={usersUnderAdmin}
      showUserName
    />
  )}

  {adminName.includes("N") && (
    <UserReportN
      loggedInUser={selectedUser}
      allReports={filteredReports}
      usersUnderAdmin={usersUnderAdmin}
      showUserName
    />
  )}
</div>


    </div>
  );
};

export default MyUserReports;
