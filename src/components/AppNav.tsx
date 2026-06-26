"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CurrentUser = {
  fullName: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
};

export function AppNav() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        Bakkal Amca
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/orders">Orders</Link>
        {user?.role === "ADMIN" ? <Link href="/admin">Admin</Link> : null}
      </nav>
      <div className="nav-auth">
        {user ? (
          <>
            <span>{user.fullName}</span>
            <button type="button" className="button ghost" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="button ghost">
              Login
            </Link>
            <Link href="/register" className="button primary">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
