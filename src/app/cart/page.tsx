"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  quantity: number;
  lineTotal: number;
  product: {
    name: string;
    imageUrl: string | null;
    stockQuantity: number;
  };
};

type Cart = {
  items: CartItem[];
  total: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [message, setMessage] = useState("");

  async function loadCart() {
    const response = await fetch("/api/cart");
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Login is required to view cart.");
      setCart(null);
      return;
    }

    setCart(data);
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateItem(id: string, quantity: number) {
    if (quantity <= 0) return;

    const response = await fetch(`/api/cart/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not update cart item.");
      return;
    }

    setCart(data);
    setMessage("");
  }

  async function removeItem(id: string) {
    const response = await fetch(`/api/cart/items/${id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not remove cart item.");
      return;
    }

    setCart(data);
    setMessage("");
  }

  async function clearCart() {
    const response = await fetch("/api/cart", { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not clear cart.");
      return;
    }

    setCart(data);
    setMessage("");
  }

  return (
    <main className="page-shell">
      <section className="page-title">
        <p className="eyebrow">Shopping cart</p>
        <h1>Your cart</h1>
      </section>

      {message ? <p className="alert error">{message}</p> : null}

      {!cart ? <p className="muted">Loading cart...</p> : null}
      {cart && cart.items.length === 0 ? (
        <section className="empty-state">
          <h2>Your cart is empty</h2>
          <p className="muted">Add products before checkout.</p>
          <Link href="/products" className="button primary">
            Browse products
          </Link>
        </section>
      ) : null}

      {cart && cart.items.length > 0 ? (
        <section className="cart-layout">
          <div className="list-panel">
            {cart.items.map((item) => (
              <article key={item.id} className="cart-row">
                <img src={item.product.imageUrl ?? "/placeholder.png"} alt={item.product.name} />
                <div>
                  <h2>{item.product.name}</h2>
                  <p className="muted">{item.product.stockQuantity} in stock</p>
                </div>
                <div className="quantity-control">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => updateItem(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stockQuantity}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <strong className="price">${item.lineTotal.toFixed(2)}</strong>
                <button type="button" className="button ghost" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>
          <aside className="summary-panel">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Total</span>
              <strong>${cart.total.toFixed(2)}</strong>
            </div>
            <Link href="/checkout" className="button primary full">
              Checkout
            </Link>
            <button type="button" className="button ghost full" onClick={clearCart}>
              Clear cart
            </button>
          </aside>
        </section>
      ) : null}
    </main>
  );
}
