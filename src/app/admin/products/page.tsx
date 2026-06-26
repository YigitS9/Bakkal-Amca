"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  productType: "FRESH" | "FROZEN" | "PACKAGED";
  categoryId: string;
  expirationDate: string | null;
  originCountry: string | null;
  requiredTemperature: number | null;
  brand: string | null;
  barcode: string | null;
  category: Category;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  imageUrl: string;
  productType: "FRESH" | "FROZEN" | "PACKAGED";
  categoryId: string;
  expirationDate: string;
  originCountry: string;
  requiredTemperature: string;
  brand: string;
  barcode: string;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  imageUrl: "",
  productType: "PACKAGED",
  categoryId: "",
  expirationDate: "",
  originCountry: "",
  requiredTemperature: "",
  brand: "",
  barcode: ""
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    const response = await fetch("/api/admin/products");
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Admin login is required.");
      return;
    }

    setProducts(data);
  }

  async function loadCategories() {
    const response = await fetch("/api/admin/categories");
    const data = await response.json();
    if (response.ok) setCategories(data);
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  function updateField(field: keyof ProductForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId("");
    setForm(emptyForm);
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      imageUrl: product.imageUrl ?? "",
      productType: product.productType,
      categoryId: product.categoryId,
      expirationDate: product.expirationDate ? product.expirationDate.slice(0, 10) : "",
      originCountry: product.originCountry ?? "",
      requiredTemperature: product.requiredTemperature === null ? "" : String(product.requiredTemperature),
      brand: product.brand ?? "",
      barcode: product.barcode ?? ""
    });
  }

  function toPayload() {
    const expirationDate = form.expirationDate ? new Date(`${form.expirationDate}T00:00:00.000Z`).toISOString() : null;

    return {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      productType: form.productType,
      categoryId: form.categoryId,
      imageUrl: form.imageUrl || null,
      expirationDate,
      originCountry: form.originCountry || null,
      requiredTemperature: form.requiredTemperature ? Number(form.requiredTemperature) : null,
      brand: form.brand || null,
      barcode: form.barcode || null
    };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload())
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Product save failed.");
      return;
    }

    resetForm();
    setMessage("Product saved.");
    await loadProducts();
  }

  async function updateStock(product: Product, stockQuantity: number) {
    if (stockQuantity < 0) return;

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQuantity })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Stock update failed.");
      return;
    }

    setMessage("Stock updated.");
    await loadProducts();
  }

  async function deleteProduct(id: string) {
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Product delete failed.");
      return;
    }

    setMessage("Product deleted.");
    await loadProducts();
  }

  return (
    <main className="page-shell">
      <section className="page-title">
        <p className="eyebrow">Admin panel</p>
        <h1>Products</h1>
      </section>

      {message ? <p className={message.includes("failed") || message.includes("required") ? "alert error" : "alert"}>{message}</p> : null}

      <section className="admin-grid">
        <article className="panel">
          <h2>{editingId ? "Edit product" : "Create product"}</h2>
          <form className="form" onSubmit={submit}>
            <label>
              Name
              <input value={form.name} onChange={(event) => updateField("name", event.target.value)} />
            </label>
            <label>
              Description
              <input value={form.description} onChange={(event) => updateField("description", event.target.value)} />
            </label>
            <div className="form-grid">
              <label>
                Price
                <input value={form.price} onChange={(event) => updateField("price", event.target.value)} />
              </label>
              <label>
                Stock
                <input
                  value={form.stockQuantity}
                  onChange={(event) => updateField("stockQuantity", event.target.value)}
                />
              </label>
            </div>
            <label>
              Category
              <select value={form.categoryId} onChange={(event) => updateField("categoryId", event.target.value)}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Product type
              <select
                value={form.productType}
                onChange={(event) => updateField("productType", event.target.value as ProductForm["productType"])}
              >
                <option value="FRESH">Fresh</option>
                <option value="FROZEN">Frozen</option>
                <option value="PACKAGED">Packaged</option>
              </select>
            </label>
            <label>
              Image URL
              <input value={form.imageUrl} onChange={(event) => updateField("imageUrl", event.target.value)} />
            </label>
            {form.productType === "FRESH" ? (
              <div className="form-grid">
                <label>
                  Expiration date
                  <input
                    type="date"
                    value={form.expirationDate}
                    onChange={(event) => updateField("expirationDate", event.target.value)}
                  />
                </label>
                <label>
                  Origin country
                  <input
                    value={form.originCountry}
                    onChange={(event) => updateField("originCountry", event.target.value)}
                  />
                </label>
              </div>
            ) : null}
            {form.productType === "FROZEN" ? (
              <label>
                Required temperature
                <input
                  value={form.requiredTemperature}
                  onChange={(event) => updateField("requiredTemperature", event.target.value)}
                />
              </label>
            ) : null}
            {form.productType === "PACKAGED" ? (
              <div className="form-grid">
                <label>
                  Brand
                  <input value={form.brand} onChange={(event) => updateField("brand", event.target.value)} />
                </label>
                <label>
                  Barcode
                  <input value={form.barcode} onChange={(event) => updateField("barcode", event.target.value)} />
                </label>
              </div>
            ) : null}
            <div className="actions">
              <button type="submit" className="button primary">
                Save product
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
          <h2>Product list</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category.name}</td>
                    <td>{product.productType}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <div className="stock-control">
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => updateStock(product, product.stockQuantity - 1)}
                          aria-label="Decrease stock"
                        >
                          -
                        </button>
                        <span>{product.stockQuantity}</span>
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => updateStock(product, product.stockQuantity + 1)}
                          aria-label="Increase stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="button ghost" onClick={() => editProduct(product)}>
                          Edit
                        </button>
                        <button type="button" className="button danger" onClick={() => deleteProduct(product.id)}>
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
