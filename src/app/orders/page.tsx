"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    lineTotal: number;
  }>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/orders/my-orders")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.error ?? "Login is required to view orders.");
          return [];
        }
        return data;
      })
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <main className="page-shell">
      <section className="page-title">
        <p className="eyebrow">Order history</p>
        <h1>Your orders</h1>
      </section>

      {message ? <p className="alert error">{message}</p> : null}
      {orders.length === 0 && !message ? (
        <section className="panel">
          <h2>No orders yet</h2>
          <p className="muted">Complete checkout to see orders here.</p>
          <Link href="/products" className="button primary">
            Browse products
          </Link>
        </section>
      ) : null}

      <section className="order-list">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="card-heading">
              <div>
                <h2>Order {order.id.slice(-6)}</h2>
                <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <strong>${order.totalAmount.toFixed(2)}</strong>
            </div>
            <div className="meta-row">
              <span>{order.status}</span>
              <span>{order.paymentStatus}</span>
              <span>{order.paymentMethod}</span>
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
