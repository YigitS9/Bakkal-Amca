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
    return params.toString();
  }, [search]);

  const visibleProducts = useMemo(() => {
    if (!categoryId) return products;
    return products.filter((product) => product.category.id === categoryId);
  }, [categoryId, products]);

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

      <section className="product-discovery" aria-label="Product filters">
        <div className="search-panel">
          <label>
            Search all products
            <input
              placeholder="Try milk, rice, pizza..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <span className="result-count">
            {visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="category-chip-row" aria-label="Categories">
          <button
            type="button"
            className={categoryId === "" ? "category-chip active" : "category-chip"}
            onClick={() => setCategoryId("")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={categoryId === category.id ? "category-chip active" : "category-chip"}
              onClick={() => setCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {message ? <p className="alert">{message}</p> : null}
      {isLoading ? <p className="muted">Loading products...</p> : null}
      {!isLoading && visibleProducts.length === 0 ? (
        <section className="empty-state">
          <h2>No products found</h2>
          <p>Try a different search term or switch to all categories.</p>
          <button
            type="button"
            className="button ghost"
            onClick={() => {
              setSearch("");
              setCategoryId("");
            }}
          >
            Reset filters
          </button>
        </section>
      ) : null}

      <section className="product-grid">
        {visibleProducts.map((product) => (
          <article key={product.id} className="product-card">
            <Link href={`/products/${product.id}`} className="product-image-link">
              <img src={product.imageUrl ?? "/placeholder.png"} alt={product.name} />
            </Link>
            <div className="card-body">
              <div className="card-heading">
                <h2>{product.name}</h2>
                <span className="price">${product.finalPrice.toFixed(2)}</span>
              </div>
              <p>{product.description}</p>
              <div className="meta-row">
                <span>{product.category.name}</span>
                <span>{product.productType}</span>
                <span className={product.stockQuantity <= 10 ? "stock-badge low" : "stock-badge"}>
                  {product.stockQuantity} in stock
                </span>
              </div>
              <div className="card-actions">
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
