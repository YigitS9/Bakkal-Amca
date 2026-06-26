"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  stockQuantity: number;
  imageUrl: string | null;
  productType: string;
  storageInstructions: string;
  category: {
    name: string;
  };
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((response) => response.json())
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [params.id]);

  async function addToCart() {
    if (!product) return;

    setMessage("");
    const response = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity: 1 })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not add item to cart.");
      return;
    }

    setMessage("Item added to cart.");
  }

  if (!product) {
    return (
      <main className="page-shell">
        <p className="muted">Loading product...</p>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="detail-layout">
        <img className="detail-image" src={product.imageUrl ?? "/placeholder.png"} alt={product.name} />
        <div className="detail-copy">
          <p className="eyebrow">{product.category.name}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <dl className="detail-list">
            <div>
              <dt>Price</dt>
              <dd>${product.finalPrice.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Stock</dt>
              <dd>{product.stockQuantity}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{product.productType}</dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>{product.storageInstructions}</dd>
            </div>
          </dl>
          {message ? <p className="alert">{message}</p> : null}
          <div className="actions">
            <button
              type="button"
              className="button primary"
              onClick={addToCart}
              disabled={product.stockQuantity === 0}
            >
              Add to cart
            </button>
            <Link href="/products" className="button ghost">
              Back to products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
