"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Cart = {
  items: Array<{
    id: string;
    quantity: number;
    lineTotal: number;
    product: {
      name: string;
    };
  }>;
  total: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("FAKE_CREDIT_CARD");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/cart")
      .then((response) => response.json())
      .then(setCart)
      .catch(() => setCart(null));
  }, []);

  async function checkout() {
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/orders/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethod })
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.error ?? "Checkout failed.");
      return;
    }

    window.location.href = "/orders";
  }

  return (
    <main className="page-shell">
      <section className="page-title">
        <p className="eyebrow">Fake payment</p>
        <h1>Checkout</h1>
      </section>

      <section className="cart-layout">
        <div className="list-panel">
          <h2>Order summary</h2>
          {!cart ? <p className="muted">Loading cart...</p> : null}
          {cart?.items.length === 0 ? <p className="muted">Your cart is empty.</p> : null}
          {cart?.items.map((item) => (
            <div key={item.id} className="summary-row">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <strong>${item.lineTotal.toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <aside className="summary-panel">
          <h2>Payment</h2>
          <div className="payment-options" aria-label="Payment method">
            <button
              type="button"
              className={paymentMethod === "FAKE_CREDIT_CARD" ? "payment-option active" : "payment-option"}
              onClick={() => setPaymentMethod("FAKE_CREDIT_CARD")}
            >
              <strong>Fake credit card</strong>
              <span>Instant prototype payment</span>
            </button>
            <button
              type="button"
              className={paymentMethod === "CASH_ON_DELIVERY" ? "payment-option active" : "payment-option"}
              onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
            >
              <strong>Cash on delivery</strong>
              <span>Pay when groceries arrive</span>
            </button>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong>${(cart?.total ?? 0).toFixed(2)}</strong>
          </div>
          {message ? <p className="alert error">{message}</p> : null}
          <button
            type="button"
            className="button primary full"
            onClick={checkout}
            disabled={isSubmitting || !cart || cart.items.length === 0}
          >
            {isSubmitting ? "Processing..." : "Place order"}
          </button>
          <Link href="/cart" className="button ghost full">
            Back to cart
          </Link>
        </aside>
      </section>
    </main>
  );
}
