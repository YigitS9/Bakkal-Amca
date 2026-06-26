"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stockQuantity: number;
  }>;
  recentOrders: Array<{
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    user: {
      fullName: string;
      email: string;
    };
  }>;
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.error ?? "Admin login is required.");
          return null;
        }
        return data;
      })
      .then(setStats)
      .catch(() => setMessage("Could not load dashboard."));
  }, []);

  return (
    <main className="page-shell">
      <section className="page-title split-title">
        <div>
          <p className="eyebrow">Admin panel</p>
          <h1>Dashboard</h1>
        </div>
        <p className="muted page-kicker">Monitor store activity and jump into management tasks.</p>
      </section>

      {message ? <p className="alert error">{message}</p> : null}
      {!stats && !message ? <p className="muted">Loading dashboard...</p> : null}

      {stats ? (
        <>
          <section className="stat-grid" aria-label="Dashboard statistics">
            <Link href="/admin/products" className="stat-card action-card">
              <span>Products</span>
              <strong>{stats.totalProducts}</strong>
              <small>Manage catalog and stock</small>
            </Link>
            <Link href="/admin/categories" className="stat-card action-card">
              <span>Categories</span>
              <strong>{stats.totalCategories}</strong>
              <small>Organize product groups</small>
            </Link>
            <Link href="/admin/orders" className="stat-card action-card">
              <span>Orders</span>
              <strong>{stats.totalOrders}</strong>
              <small>Review and update status</small>
            </Link>
          </section>

          <section className="admin-grid">
            <article className="panel">
              <h2>Low-stock products</h2>
              {stats.lowStockProducts.length === 0 ? <p className="muted">No low-stock items.</p> : null}
              <div className="compact-list">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="summary-row">
                    <span>{product.name}</span>
                    <strong>{product.stockQuantity} left</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <h2>Recent orders</h2>
              {stats.recentOrders.length === 0 ? <p className="muted">No orders yet.</p> : null}
              <div className="compact-list">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="summary-row">
                    <span>{order.user.fullName} - {order.status}</span>
                    <strong>${order.totalAmount.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      ) : null}
    </main>
  );
}
