"use client";

import { useEffect, useState } from "react";
import "../../styles/Admin.scss";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("welcome");

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === "users") fetchUsers();
    else if (section === "orders") fetchOrders();
  };

  const totalOrders = orders.reduce((sum, order) => sum + (order.amountPaid || 0), 0);
  const activeListings = orders.length;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li onClick={() => handleSectionChange("users")}>👤 Users</li>
            <li onClick={() => handleSectionChange("orders")}>📄 Orders</li>
            <li onClick={() => handleSectionChange("summary")}>📊 Summary</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeSection === "welcome" && (
          <>
            <h1>Welcome, Admin!</h1>
            <p>Manage users, orders, and analytics.</p>
          </>
        )}

        {activeSection === "summary" && (
          <>
            <h1>Summary</h1>
            <div className="stats-container">
              <div className="stat-box">
                <h2 className="stat-title">Total Users</h2>
                <p className="stat-value">{users.length}</p>
              </div>
              <div className="stat-box">
                <h2 className="stat-title">Total Orders</h2>
                <p className="stat-value">₹{totalOrders.toFixed(2)}</p>
              </div>
              <div className="stat-box">
                <h2 className="stat-title">Active Listings</h2>
                <p className="stat-value">{activeListings}</p>
              </div>
            </div>
          </>
        )}

        {/* Users Section */}
        {activeSection === "users" && (
          <>
            <h1>Registered Users</h1>
            {loading ? (
              <p className="loading">Loading users...</p>
            ) : error ? (
              <p className="error">Error: {error}</p>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? "Admin" : "User"}</td>
                      <td>
                        <button onClick={() => deleteUser(user._id)} className="delete-btn">
                          ❌ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Orders Section */}
        {activeSection === "orders" && (
          <>
            <h1>Orders</h1>
            {loading ? (
              <p className="loading">Loading orders...</p>
            ) : error ? (
              <p className="error">Error: {error}</p>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer ID</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id || order._id}>
                        <td>{order.id || "N/A"}</td>
                        <td>{order.user || order.userId || "Unknown"}</td>
                        <td>₹{order.amountPaid?.toFixed(2) || "0.00"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
