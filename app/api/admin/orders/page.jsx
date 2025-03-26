"use client";

import React, { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Orders:", data);
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Orders</h2>
      <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer (User ID)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id || Math.random()}>
                <td>{order.id || "N/A"}</td>
                <td>{order.userId || "Unknown"}</td>
                <td>₹{order.amountPaid?.toFixed(2) || "0.00"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
