import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function AllAdminControl() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  function formatBD(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setCurrentUser(user);
    getAdmins();
    getUsers();
  }, []);

  async function getAdmins() {
    try {
      const res = await fetch(
        "https://monitor-r0u9.onrender.com/api/auth/get-admins"
      );
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getUsers() {
    try {
      const res = await fetch(
        "https://monitor-r0u9.onrender.com/api/auth/get-users"
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteAdmin(id) {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(
        `https://monitor-r0u9.onrender.com/api/auth/delete-admin/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        getAdmins();
        alert("Admin deleted");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(
        `https://monitor-r0u9.onrender.com/api/auth/delete-user/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) getUsers();
    } catch (err) {
      console.log(err);
    }
  }

  async function toggleAdminActive(id) {
    try {
      const res = await fetch(
        `https://monitor-r0u9.onrender.com/api/auth/toggle-admin-active/${id}`,
        { method: "PUT" }
      );

      if (res.ok) getAdmins();
    } catch (err) {
      console.log(err);
    }
  }

  async function toggleUserActive(id) {
    try {
      const res = await fetch(
        `https://monitor-r0u9.onrender.com/api/auth/toggle-user-active/${id}`,
        { method: "PUT" }
      );

      if (res.ok) getUsers();
    } catch (err) {
      console.log(err);
    }
  }

  /* ----------------------------------------------------
   EXPORT ADMINS TO EXCEL (Stylish & Organized)
---------------------------------------------------- */
  async function exportAdminsExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Admins");

    // Define columns
    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Created Time (BD)", key: "created", width: 25 },
      { header: "Status Changed (BD)", key: "updated", width: 25 },
      { header: "Status", key: "status", width: 15 },
    ];

    // Header styling
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // white text
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E79" }, // blue header
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Insert data
    admins.forEach((a) => {
      const row = sheet.addRow({
        name: a.name,
        email: a.email,
        created: formatBD(a.createdAt),
        updated: formatBD(a.updatedAt),
        status: a.isActive ? "Active" : "Inactive",
      });

      // Apply borders & alignment to each row
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "All_Admins.xlsx");
  }

  /* ----------------------------------------------------
   EXPORT USERS TO EXCEL (Styled Like Admin Excel)
---------------------------------------------------- */
  async function exportUsersExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Users");

    // Define columns
    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Created By", key: "createdBy", width: 25 },
      { header: "Created Time (BD)", key: "created", width: 25 },
      { header: "Status Changed (BD)", key: "updated", width: 25 },
      { header: "Status", key: "status", width: 15 },
    ];

    // Header styling
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // white
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E79" }, // navy blue
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Insert user data
    users.forEach((u) => {
      const row = sheet.addRow({
        name: u.name,
        email: u.email,
        createdBy: u.createdBy ? u.createdBy.name : "Master Admin",
        created: formatBD(u.createdAt),
        updated: formatBD(u.updatedAt),
        status: u.isActive ? "Active" : "Inactive",
      });

      // Apply borders + alignment to each cell
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Users.xlsx");
  }

  return (
    <div className="p-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Admin & User Management</h1>

      {/* ===================== ADMIN LIST ===================== */}
      <h2 className="text-2xl font-bold mb-2">All Admins</h2>

      {/* EXPORT BUTTON */}
      <button
        onClick={exportAdminsExcel}
        className="mb-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export Admins to Excel
      </button>

      <div className="overflow-x-auto mb-10">
        <table className="w-full border border-gray-500 border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Created Time (BD)</th>
              <th className="p-3 border">Status Changed (BD)</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {admins.length ? (
              admins.map((admin) => (
                <tr key={admin._id}>
                  <td className="p-3 border">{admin.name}</td>
                  <td className="p-3 border">{admin.email}</td>
                  <td className="p-3 border">{formatBD(admin.createdAt)}</td>
                  <td className="p-3 border">{formatBD(admin.updatedAt)}</td>

                  <td className="p-3 border text-center">
                    {admin.isActive ? "Active" : "Inactive"}
                  </td>

                  <td className="p-3 border text-center flex justify-center gap-2">
                    <button
                      onClick={() => toggleAdminActive(admin._id)}
                      className={`px-3 py-1 rounded ${
                        admin.isActive
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {admin.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteAdmin(admin._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 border text-center" colSpan="6">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== USER LIST ===================== */}
      <h2 className="text-2xl font-bold mb-2">All Users</h2>

      {/* EXPORT BUTTON */}
      <button
        onClick={exportUsersExcel}
        className="mb-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export Users to Excel
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-500 border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Created By</th>
              <th className="p-3 border">Created Time (BD)</th>
              <th className="p-3 border">Status Changed (BD)</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="p-3 border">{user.name}</td>
                  <td className="p-3 border">{user.email}</td>

                  <td className="p-3 border">
                    {user.createdBy ? user.createdBy.name : "Master Admin"}
                  </td>

                  <td className="p-3 border">{formatBD(user.createdAt)}</td>

                  <td className="p-3 border">{formatBD(user.updatedAt)}</td>

                  <td className="p-3 border text-center">
                    {user.isActive ? "Active" : "Inactive"}
                  </td>

                  <td className="p-3 border text-center flex justify-center gap-2">
                    <button
                      onClick={() => toggleUserActive(user._id)}
                      className={`px-3 py-1 rounded ${
                        user.isActive
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 border text-center" colSpan="7">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
