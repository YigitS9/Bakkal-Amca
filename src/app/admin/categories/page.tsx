"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    products: number;
  };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");

  async function loadCategories() {
    const response = await fetch("/api/admin/categories");
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Admin login is required.");
      return;
    }

    setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setEditingId("");
    setForm({ name: "", description: "" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch(editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, description: form.description || null })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Category save failed.");
      return;
    }

    resetForm();
    setMessage("Category saved.");
    await loadCategories();
  }

  async function deleteCategory(id: string) {
    setMessage("");
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Category delete failed. Remove related products first.");
      return;
    }

    setMessage("Category deleted.");
    await loadCategories();
  }

  return (
    <main className="page-shell">
      <section className="page-title">
        <p className="eyebrow">Admin panel</p>
        <h1>Categories</h1>
        <div className="admin-subnav" aria-label="Admin sections">
          <a href="/admin">Dashboard</a>
          <a href="/admin/products">Products</a>
          <a href="/admin/categories" className="active">
            Categories
          </a>
          <a href="/admin/orders">Orders</a>
        </div>
      </section>

      {message ? <p className={message.includes("failed") || message.includes("required") ? "alert error" : "alert"}>{message}</p> : null}

      <section className="admin-grid">
        <article className="panel">
          <h2>{editingId ? "Edit category" : "Create category"}</h2>
          <form className="form" onSubmit={submit}>
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Description
              <input
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </label>
            <div className="actions">
              <button type="submit" className="button primary">
                Save category
              </button>
              {editingId ? (
                <button type="button" className="button ghost" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="panel wide-panel">
          <h2>Category list</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description ?? "-"}</td>
                    <td>{category._count?.products ?? 0}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="button ghost"
                          onClick={() => {
                            setEditingId(category.id);
                            setForm({
                              name: category.name,
                              description: category.description ?? ""
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="button danger" onClick={() => deleteCategory(category.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
