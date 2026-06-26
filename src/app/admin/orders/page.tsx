"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: "PENDING" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    lineTotal: number;
  }>;
};

const statuses: Order["status"][] = ["PENDING", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    const response = await fetch("/api/admin/orders");
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Admin login is required.");
      return;
    }

    setOrders(data);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(orderId: string, status: Order["status"]) {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Order update failed.");
      return;
    }

    setMessage("Order status updated.");
    await loadOrders();
  }

  return (
    <main className="page-shell">
      <section className="page-title">
        <p className="eyebrow">Admin panel</p>
        <h1>Orders</h1>
        <div className="admin-subnav" aria-label="Admin sections">
          <a href="/admin">Dashboard</a>
          <a href="/admin/products">Products</a>
          <a href="/admin/categories">Categories</a>
          <a href="/admin/orders" className="active">
            Orders
          </a>
        </div>
      </section>

      {message ? (
        <p className={message.includes("failed") || message.includes("required") ? "alert error" : "alert"}>
          {message}
        </p>
      ) : null}

      <section className="order-list">
        {orders.length === 0 && !message ? <p className="muted">No orders yet.</p> : null}
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="card-heading">
              <div>
                <h2>Order {order.id.slice(-6)}</h2>
                <p className="muted">
                  {order.user.fullName} - {order.user.email} - {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <strong>${order.totalAmount.toFixed(2)}</strong>
            </div>

            <div className="admin-order-controls">
              <label>
                Status
                <select
                  value={order.status}
                  onChange={(event) => updateStatus(order.id, event.target.value as Order["status"])}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <div className="meta-row">
                <span className="status-badge">{order.paymentStatus}</span>
                <span className="status-badge">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="summary-row">
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <strong>${item.lineTotal.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
