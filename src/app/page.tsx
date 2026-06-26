export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <img className="hero-logo" src="/bakkal-amca-logo.png" alt="Bakkal Amca" />
          <p className="eyebrow">Online Grocery Shopping Management System</p>
          <h1>Bakkal Amca Grocery</h1>
          <p>
            Browse seeded grocery products, add items to your cart, and complete a prototype
            checkout with fake payment.
          </p>
          <div className="actions">
            <a href="/products" className="button primary">
              Browse products
            </a>
            <a href="/login" className="button ghost">
              Login
            </a>
          </div>
        </div>
      </section>
      <section className="feature-grid" aria-label="Project features">
        <div>
          <h2>Customer flow</h2>
          <p>Register, login, browse products, manage cart, checkout, and view order history.</p>
        </div>
        <div>
          <h2>Clean API</h2>
          <p>Route handlers call services and repositories instead of containing business logic.</p>
        </div>
        <div>
          <h2>OOP evidence</h2>
          <p>Product inheritance, payment polymorphism, encapsulated cart and order behavior.</p>
        </div>
      </section>
    </main>
  );
}
