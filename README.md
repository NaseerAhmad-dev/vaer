# 🛍️ Vaer — Premium Ecommerce Store

A full-stack ecommerce platform built with React + Node.js/Express + MongoDB.

---

## 📁 Project Structure

```
Vaer/
├── backend/          ← Node.js + Express API
│   ├── models/       ← MongoDB schemas (User, Product, Order)
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← JWT auth middleware
│   ├── server.js     ← Entry point
│   └── .env.example  ← Environment variables template
│
└── frontend/         ← React app
    └── src/
        ├── components/   ← Navbar, ProductCard
        ├── context/      ← Auth & Cart state
        ├── pages/        ← Home, Products, Cart, Login, Admin
        ├── services/     ← Axios API calls
        └── styles/       ← Global CSS (dark + gold theme)
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install

# Copy and fill in your environment variables
cp .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET

npm run dev
# API runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## ✅ Features (Base)

- [x] User registration & login (JWT)
- [x] Product listing with search, filter by category, pagination
- [x] Shopping cart (add, remove, update qty)
- [x] Admin dashboard (stats, order management)
- [x] Role-based access (customer / admin)
- [x] Responsive dark premium UI

## 🔜 Coming Next (add one by one)

- [ ] Product detail page
- [ ] Checkout & order placement
- [ ] My orders page
- [ ] Product image upload
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Inventory management
- [ ] Discount codes

---

## 🛠️ Tech Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React 18, React Router v6   |
| Backend  | Node.js, Express            |
| Database | MongoDB + Mongoose          |
| Auth     | JWT + bcryptjs              |
| Styling  | CSS Modules, custom design  |

---

## 🔑 First Admin Account

After registering a user, set their role to admin directly in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
