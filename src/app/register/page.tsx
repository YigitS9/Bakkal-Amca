"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: ""
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        address: form.address || undefined,
        phoneNumber: form.phoneNumber || undefined
      })
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.error ?? "Registration failed.");
      return;
    }

    window.location.href = "/products";
  }

  return (
    <main className="page-shell narrow">
      <section className="panel">
        <p className="eyebrow">Create customer account</p>
        <h1>Register</h1>
        <form className="form" onSubmit={submit}>
          <label>
            Full name
            <input value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
          </label>
          <label>
            Email
            <input value={form.email} onChange={(event) => updateField("email", event.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          </label>
          <label>
            Address
            <input value={form.address} onChange={(event) => updateField("address", event.target.value)} />
          </label>
          <label>
            Phone number
            <input
              value={form.phoneNumber}
              onChange={(event) => updateField("phoneNumber", event.target.value)}
            />
          </label>
          {message ? <p className="alert error">{message}</p> : null}
          <button type="submit" className="button primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="muted">
          Already registered? <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
