# 🛍️ Noor — Full-Stack Ecommerce Store

A full-stack ecommerce platform built with Angular + Node.js/Express + MongoDB.

---

## 📁 Project Structure

```
Noor/
├── backend/          ← Node.js + Express API
│   ├── models/       ← MongoDB schemas (User, Product, Order)
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← JWT auth middleware
│   ├── server.js     ← API entry point
│   └── .env          ← Environment variables
│
└── frontend/         ← Angular application
    ├── public/       ← Static assets
    └── src/
        ├── app/      ← Application modules, pages, services
        ├── styles.css
        ├── main.ts
        └── index.html
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install

# Create or update your environment file
copy .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET

npm run dev
# API runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
# App runs on http://localhost:4200
```

---

## ✅ Implemented Features

- [x] User registration and login with JWT
- [x] Product listing with search, category filter, pagination
- [x] Product detail page
- [x] Shopping cart with add/remove/update quantity
- [x] Checkout page
- [x] Order history and profile pages
- [x] Admin dashboard and order management
- [x] Role-based access control (customer / admin)
- [x] API proxy from Angular to backend

---

## 🛠️ Tech Stack

| Layer      | Tech                                   |
|------------|----------------------------------------|
| Frontend   | Angular 21, Tailwind CSS, PrimeNG       |
| Backend    | Node.js, Express, Mongoose             |
| Database   | MongoDB                                |
| Auth       | JWT, bcryptjs                          |
| File Upload| Multer                                 |

---

## 🚦 Notes

- Frontend development server uses the Angular proxy config to forward `/api` calls to `http://localhost:5000`.
- The backend exposes API routes under `/api/products`, `/api/users`, `/api/orders`, `/api/auth`, and `/api/admin`.
- Make sure MongoDB is running locally before starting the backend.

---

## 🔑 Create Admin User

After registering a normal user, promote the account in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
