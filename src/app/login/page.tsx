"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("customer@grocery.com");
  const [password, setPassword] = useState("customer123");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.error ?? "Login failed.");
      return;
    }

    window.location.href = data.user.role === "ADMIN" ? "/admin" : "/products";
  }

  return (
    <main className="page-shell narrow">
      <section className="panel">
        <img className="auth-logo" src="/bakkal-amca-logo.png" alt="Bakkal Amca" />
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <form className="form" onSubmit={submit}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {message ? <p className="alert error">{message}</p> : null}
          <button type="submit" className="button primary" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="muted">
          Need an account? <Link href="/register">Register</Link>
        </p>
        <p className="muted small">Admin demo: admin@grocery.com / admin123</p>
      </section>
    </main>
  );
}
