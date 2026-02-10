import "./ManageUsers.css";
import { useContext, useEffect, useState } from "react";
import ModeContext from "../context/ModeContext";
import dayjs from "dayjs";

const API_URL = "http://localhost:3001/users";

function ManageUsers() {
  const ctx = useContext(ModeContext);

  // ✅ states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------- GET USERS ----------
  const getUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data); // ✅ correct
    } catch (error) {
      console.error("GET Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // -----------------------------

  useEffect(() => {
    getUsers(); // ✅ function call
  }, []);

  // -----------delete users----------
  const deleteUserById = async (id) => {
    try {
      setLoading(true);
  
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
  
      // ✅ UI & state update
      setUsers(users.filter((user) => user.id !== id));
  
      alert("User deleted");
    } catch (error) {
      console.error("DELETE Error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={`main-container ${ctx.mode}`}>
      <h1 className="manage-users-title">Manage Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Login Time</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.mobile}</td>
                <td>
                  {user.createdAt 
                    ? dayjs(user.createdAt).format('DD-MM-YYYY, hh:mm:ss A') 
                    : "N/A"}
                </td>
                <td>{user.role}</td>
                <td className="action-buttons">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn"  onClick={() => deleteUserById(user.id)}>Delete</button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUsers;
