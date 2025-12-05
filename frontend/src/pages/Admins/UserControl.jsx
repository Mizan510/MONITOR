import React, { useEffect, useState } from "react";

export default function UserControl() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET LOGGED-IN ADMIN ID
  const admin = JSON.parse(localStorage.getItem("user"));
  const adminId = admin?._id;

  // FETCH USERS OF THIS ADMIN
  async function fetchUsers() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/my-users/${adminId}`
      );

      const data = await res.json();

      if (res.ok) {
        setUsers(data.users);
      }
    } catch (err) {
      console.log("Fetch users error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!adminId) return;
    fetchUsers();
  }, [adminId]);

  // DELETE USER
  async function deleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/delete-user/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("User deleted successfully!");
        fetchUsers(); // REFRESH LIST
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Control Panel</h1>

      {users.length === 0 ? (
        <p className="text-gray-600">No users registered under you yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{u.name}</td>
                  <td className="p-3 border">{u.email}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
