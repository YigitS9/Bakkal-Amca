"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  stockQuantity: number;
  imageUrl: string | null;
  productType: string;
  category: Category;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (categoryId) params.set("categoryId", categoryId);
    return params.toString();
  }, [categoryId, search]);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/products${query ? `?${query}` : ""}`)
      .then((response) => response.json())
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [query]);

  async function addToCart(productId: string) {
    setMessage("");
    const response = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not add item to cart. Login may be required.");
      return;
    }

    setMessage("Item added to cart.");
  }

  return (
    <main className="page-shell">
      <section className="page-title">
        <p className="eyebrow">Shop groceries</p>
        <h1>Products</h1>
      </section>

      <section className="toolbar" aria-label="Product filters">
        <input
          placeholder="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </section>

      {message ? <p className="alert">{message}</p> : null}
      {isLoading ? <p className="muted">Loading products...</p> : null}

      <section className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <img src={product.imageUrl ?? "/placeholder.png"} alt={product.name} />
            <div className="card-body">
              <div className="card-heading">
                <h2>{product.name}</h2>
                <span>${product.finalPrice.toFixed(2)}</span>
              </div>
              <p>{product.description}</p>
              <div className="meta-row">
                <span>{product.category.name}</span>
                <span>{product.productType}</span>
                <span>{product.stockQuantity} in stock</span>
              </div>
              <div className="actions">
                <Link href={`/products/${product.id}`} className="button ghost">
                  Details
                </Link>
                <button
                  type="button"
                  className="button primary"
                  onClick={() => addToCart(product.id)}
                  disabled={product.stockQuantity === 0}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
