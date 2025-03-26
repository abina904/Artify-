"use client";

import { useEffect, useState } from "react";
import "../../../styles/Admin.scss"; // Ensure correct path

const Summary = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, artworksRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/artworks"),
        ]);

        if (!usersRes.ok || !ordersRes.ok || !artworksRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const usersData = await usersRes.json();
        const ordersData = await ordersRes.json();
        const artworksData = await artworksRes.json();

        setUsers(usersData);
        setOrders(ordersData);
        setArtworks(artworksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li><a href="/admin/users">👤 Users</a></li>
            <li><a href="/admin/payments">📄 Payments</a></li>
            <li><a href="/admin/summary">📊 Summary</a></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <h1>Welcome, Admin!</h1>
        <p>Manage users, payments, and analytics.</p>

        <div className="summary-cards">
          <div className="card">
            <h3 className="blue-text">Total Users</h3>
            <p className="bold">{users.length}</p>
          </div>
          <div className="card">
            <h3 className="blue-text">Total Payments</h3>
            <p className="bold">₹{orders.length * 100}</p>
          </div>
          <div className="card">
            <h3 className="blue-text">Active Listings</h3>
            <p className="bold">{artworks.length}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Summary;
