# Bakkal Amca Online Grocery Shopping Management System

Bakkal Amca is a prototype online grocery shopping management system built for an Object Oriented Programming 2 course. It uses a Next.js application as both the API backend and the frontend, with Prisma and SQLite for persistence.

The project focuses on clean backend architecture, visible OOP principles, role-based customer/admin behavior, cart and checkout logic, and a simple usable interface.

## Technologies

- Next.js App Router
- TypeScript
- Prisma ORM
- SQLite
- React
- CSS
- bcryptjs
- jose
- Zod

## Features

- Customer registration and login
- HTTP-only cookie JWT authentication
- Customer and admin roles
- Product list, search, detail pages, and category filtering
- Product type support: fresh, frozen, packaged
- Cart add, update, remove, clear, and total calculation
- Checkout with fake credit card or cash on delivery
- Order history for customers
- Admin dashboard with counts, low-stock products, and recent orders
- Admin product create, edit, soft delete, and stock update
- Admin category create, edit, and delete
- Admin order list and status update
- Custom API error classes and centralized API error handling
- Zod request validation
- OOP domain layer with inheritance, interfaces, abstraction, encapsulation, and polymorphism

## Default Accounts

```txt
Admin
Email: admin@grocery.com
Password: admin123

Customer
Email: customer@grocery.com
Password: customer123
```

## Setup

1. Install dependencies.

```powershell
npm install
```

2. Create a local environment file.

```powershell
Copy-Item .env.example .env
```

3. Generate Prisma Client.

```powershell
npx prisma generate
```

4. Create the SQLite database.

```powershell
npx prisma db execute --file prisma/migrations/20260626195400_init/migration.sql --schema prisma/schema.prisma
```

5. Seed default data.

```powershell
npx prisma db seed
```

6. Start the development server.

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```txt
npm run dev              Start local development server
npm run build            Build production app
npm run start            Start production app after build
npm run lint             Run ESLint
npm run prisma:generate  Generate Prisma Client
npm run prisma:seed      Seed database
```

## Main Pages

```txt
/                    Home
/login               Login
/register            Register
/products            Product listing
/products/[id]       Product detail
/cart                Shopping cart
/checkout            Checkout
/orders              Customer order history
/admin               Admin dashboard
/admin/products      Admin product management
/admin/categories    Admin category management
/admin/orders        Admin order management
```

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register customer |
| POST | `/api/auth/login` | Public | Login and set auth cookie |
| POST | `/api/auth/logout` | Authenticated | Clear auth cookie |
| GET | `/api/auth/me` | Authenticated | Get current user |

### Products and Categories

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List/search/filter products |
| GET | `/api/products/[id]` | Public | Product detail |
| GET | `/api/categories` | Public | List categories |

### Cart

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/cart` | Customer | Get current cart |
| DELETE | `/api/cart` | Customer | Clear cart |
| POST | `/api/cart/items` | Customer | Add item |
| PUT | `/api/cart/items/[id]` | Customer | Update item quantity |
| DELETE | `/api/cart/items/[id]` | Customer | Remove item |

### Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders/checkout` | Customer | Create order from cart |
| GET | `/api/orders/my-orders` | Customer | Current user's orders |
| GET | `/api/orders/[id]` | Customer/Admin | Order detail |

### Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Dashboard statistics |
| GET | `/api/admin/products` | Admin | List products |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/products/[id]` | Admin | Update product |
| PATCH | `/api/admin/products/[id]` | Admin | Update stock |
| DELETE | `/api/admin/products/[id]` | Admin | Soft delete product |
| GET | `/api/admin/categories` | Admin | List categories |
| POST | `/api/admin/categories` | Admin | Create category |
| PUT | `/api/admin/categories/[id]` | Admin | Update category |
| DELETE | `/api/admin/categories/[id]` | Admin | Delete category |
| GET | `/api/admin/orders` | Admin | List all orders |
| GET | `/api/admin/orders/[id]` | Admin | Order detail |
| PATCH | `/api/admin/orders/[id]` | Admin | Update order status |

## Database Summary

The Prisma schema contains these main models:

- `User`: customer/admin accounts with hashed passwords
- `Category`: product grouping
- `Product`: grocery products with type-specific fields
- `Cart`: one cart per user
- `CartItem`: product and quantity in cart
- `Order`: checkout result with status and payment fields
- `OrderItem`: purchased product snapshot with name, unit price, and quantity

Important enums:

- `UserRole`: `ADMIN`, `CUSTOMER`
- `ProductType`: `FRESH`, `FROZEN`, `PACKAGED`
- `OrderStatus`: `PENDING`, `PREPARING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `CASH_ON_DELIVERY`
- `PaymentMethod`: `CASH_ON_DELIVERY`, `FAKE_CREDIT_CARD`

## OOP Principles Used

### Encapsulation

Domain classes keep internal state private and expose controlled public methods. For example, `Product` stock is changed through `reduceStock()` and `increaseStock()`, and `Cart` items are added through `addItem()`.

### Inheritance

The project uses an abstract `Product` class with `FreshProduct`, `FrozenProduct`, and `PackagedProduct` child classes. It also includes an abstract `User` class with `Customer` and `Admin` child classes.

### Interface and Abstraction

`IPaymentProcessor` defines a common payment abstraction. `CashOnDeliveryPayment` and `FakeCreditCardPayment` implement this interface.

### Polymorphism

`OrderService` selects an `IPaymentProcessor` implementation based on payment method, then processes checkout through the interface reference instead of depending on concrete payment classes.

### Design Integrity

The app separates route handlers, services, repositories, domain models, validators, auth helpers, and exceptions. API route files act as controllers and delegate business logic to services.

## UML Class Diagram

```mermaid
classDiagram
    class Product {
        <<abstract>>
        -string id
        -string name
        -string description
        -number price
        -number stockQuantity
        -string categoryId
        +getId() string
        +getName() string
        +getPrice() number
        +reduceStock(quantity) void
        +increaseStock(quantity) void
        +getStorageInstructions()* string
        +getFinalPrice() number
    }

    class FreshProduct {
        -Date expirationDate
        -string originCountry
        +getStorageInstructions() string
        +getFinalPrice() number
    }

    class FrozenProduct {
        -number requiredTemperature
        +getStorageInstructions() string
    }

    class PackagedProduct {
        -string brand
        -string barcode
        +getStorageInstructions() string
    }

    class User {
        <<abstract>>
        -string id
        -string fullName
        -string email
        -UserRole role
        +getDashboardLabel()* string
    }

    class Customer {
        -string address
        -string phoneNumber
        +getDashboardLabel() string
    }

    class Admin {
        -string adminCode
        +getDashboardLabel() string
    }

    class Cart {
        -CartItem[] items
        +addItem(product, quantity) void
        +getTotal() number
        +isEmpty() boolean
    }

    class CartItem {
        -Product product
        -number quantity
        +updateQuantity(quantity) void
        +getLineTotal() number
    }

    class Order {
        -string id
        -string userId
        -OrderItem[] items
        +getTotalAmount() number
    }

    class OrderItem {
        -string productName
        -number unitPrice
        -number quantity
        +getLineTotal() number
    }

    class IPaymentProcessor {
        <<interface>>
        +processPayment(order) PaymentResult
    }

    class CashOnDeliveryPayment {
        +processPayment(order) PaymentResult
    }

    class FakeCreditCardPayment {
        +processPayment(order) PaymentResult
    }

    class ProductFactory {
        +create(product) Product
    }

    class OrderService {
        +checkout(userId, paymentMethod) Order
    }

    Product <|-- FreshProduct
    Product <|-- FrozenProduct
    Product <|-- PackagedProduct
    User <|-- Customer
    User <|-- Admin
    Cart --> CartItem
    CartItem --> Product
    Order --> OrderItem
    IPaymentProcessor <|.. CashOnDeliveryPayment
    IPaymentProcessor <|.. FakeCreditCardPayment
    ProductFactory --> Product
    OrderService --> IPaymentProcessor
```

## Manual Test Checklist

- Register a new customer
- Login as seeded customer
- Login as seeded admin
- Reject wrong password
- Browse products
- Search products
- Filter by category
- View product detail
- Add product to cart
- Update cart quantity
- Remove cart item
- Checkout with fake credit card
- Checkout with cash on delivery
- Confirm cart clears after checkout
- View customer order history
- Create/edit/delete admin product
- Update admin stock
- Create/edit/delete category
- View all orders as admin
- Update order status as admin
- Confirm customer cannot access admin pages/API data

## Known Limitations

- Payments are fake and do not contact a real payment gateway.
- Product images use external placeholder URLs.
- Product deletion is implemented as a soft delete.
- Prisma migration command had schema-engine issues on this Windows environment, so the checked-in SQL migration can be applied with `prisma db execute`.
- Screenshots are not included yet.
