# Stock — Inventory Management Application

A full-stack inventory / stock management web application with a premium editorial UI.
Users can create an account, manage products, track stock movements (in / out), search,
filter and keep full control of their inventory. Every screen is connected to a real
Node.js + Express + MongoDB backend.

## 1. Project Overview

- **Frontend** — React (Vite) + Tailwind CSS + React Router + Axios + Lucide icons
- **Backend** — Node.js + Express + MongoDB (Mongoose) + JWT + bcryptjs + Multer
- **Features** — authentication, product CRUD, image upload, add/out stock with movement
  history, search, filters, low-stock detection, responsive table/cards UI, mobile bottom
  navigation.

Each user owns their own products. All product and movement queries are scoped to the
authenticated user (JWT). Password is never stored in plain text and never returned by the API.

## 2. Technologies

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS 3, React Router, Axios, Lucide React |
| Backend    | Node.js, Express 4                                   |
| Database   | MongoDB, Mongoose                                    |
| Auth       | JSON Web Tokens (JWT), bcryptjs                      |
| Uploads    | Multer (JPG / PNG / WEBP, max 5 MB)                  |

## 3. Project Structure

```
stock/
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── context/            # AuthContext
│       ├── hooks/              # useProducts
│       ├── layouts/            # MainLayout
│       ├── pages/              # Login, Signup, Home, AddStock, OutStock, StockList, ProductDetail
│       ├── services/           # Axios API layer
│       ├── utils/              # Helpers
│       ├── App.jsx
│       └── main.jsx
├── server/                     # Express backend
│   ├── config/                 # MongoDB connection
│   ├── controllers/            # Auth, Product, Stock logic
│   ├── middleware/             # JWT auth, error handling, upload
│   ├── models/                 # User, Product, StockMovement
│   ├── routes/                 # /api/auth, /api/products
│   ├── utils/                  # Token, SKU, async handler
│   ├── uploads/                # Uploaded product images
│   ├── .env
│   └── server.js
├── package.json                # Root scripts (concurrently)
└── README.md
```

## 4. Prerequisites

- **Node.js** 18 or newer
- **npm**
- **MongoDB** — either:
  - A local MongoDB installed and running, **or**
  - A free **MongoDB Atlas** cluster (cloud connection string)

> If you don't have MongoDB installed, grab a free cluster at
> https://www.mongodb.com/atlas and paste its connection string into `MONGODB_URI`.

## 5. MongoDB Setup

**Option A — Local MongoDB (Windows):**
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start the service: `net start MongoDB` (or it starts automatically)
3. The default connection string below works out of the box.

**Option B — MongoDB Atlas:**
1. Create a free cluster and a database user.
2. Copy the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/stock`).
3. Add your IP to the access list, then use that string as `MONGODB_URI`.

## 6. Environment Variables

Create `server/.env` (a template is already included in `server/.env` and
`server/.env.example`):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/stock_inventory
JWT_SECRET=change_this_to_a_long_random_secret_string
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=/api
```

The Vite dev server proxies `/api` and `/uploads` to the backend on port 5000, so no
frontend environment changes are needed for local development.

## 7. Installation

From the project root:

```bash
npm install           # root dev tools (concurrently)
npm run setup         # installs server + client dependencies
```

## 8. Running the Development Server

```bash
npm run dev
```

This starts both servers:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

You can also run them individually:

```bash
npm run server        # backend only
npm run client        # frontend only
```

Open http://localhost:5173, create an account, and start managing stock.

## 9. Production Build

```bash
npm run build
```

Builds the React app into `client/dist`. To serve the frontend and backend together in
production, point a static file server at `client/dist` and run the API with:

```bash
npm run server
```

## 10. API Overview

Base URL: `http://localhost:5000` (in dev, proxied through the Vite dev server at `/api`).

### Authentication — `/api/auth`

| Method | Endpoint          | Description                                  |
| ------ | ----------------- | -------------------------------------------- |
| POST   | `/api/auth/register` | Register a new user → `{ token, user }`    |
| POST   | `/api/auth/login`    | Login → `{ token, user }`                  |
| GET    | `/api/auth/me`       | Get current user (protected)               |

### Products — `/api/products` (all protected)

| Method | Endpoint                        | Description                                  |
| ------ | ------------------------------- | -------------------------------------------- |
| GET    | `/api/products`                 | List products (search / status / sort query) |
| GET    | `/api/products/:id`             | Get a single product                         |
| POST   | `/api/products`                 | Create product + initial `IN` movement       |
| PUT    | `/api/products/:id`             | Edit product info (image, name, type, size, note) |
| DELETE | `/api/products/:id`             | Delete product + its movements               |

**GET `/api/products` query params:**

- `search=shirt` — search by name or SKU
- `status=in-stock | low-stock | out-of-stock`
- `sort=name | quantity-asc | quantity-desc`

### Stock — `/api/products/:id` (all protected)

| Method | Endpoint                        | Description                                  |
| ------ | ------------------------------- | -------------------------------------------- |
| POST   | `/api/products/:id/add-stock`   | Add stock (atomically) + `IN` movement       |
| POST   | `/api/products/:id/out-stock`   | Remove stock (atomically) + `OUT` movement   |
| GET    | `/api/products/:id/movements`   | Stock movement history (newest first)        |

### Response format

Success:

```json
{ "success": true, "data": { ... } }
```

Error:

```json
{ "success": false, "message": "Human-readable message" }
```

HTTP codes used: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`.

## 11. Stock Business Logic

- Creating a product with initial quantity creates a movement with `type: IN`.
- `ADD STOCK` — `newQuantity = oldQuantity + amount` → `IN` movement.
- `OUT STOCK` — `newQuantity = oldQuantity - amount` → `OUT` movement.
- Out-stock is atomic (`findOneAndUpdate` with a `quantity >= amount` guard) so concurrent
  requests can never drive stock below zero.
- Quantity is never edited directly; it only changes through add/out stock so history stays accurate.
- Status is derived: `quantity > 5` → **In Stock**, `1–5` → **Low Stock**, `0` → **Out of Stock**.

## 12. Security

- Passwords hashed with bcryptjs (10 salt rounds).
- JWT issued on login/register, verified by middleware on every protected route.
- Ownership checks on every product/stock operation — users can never access another
  user's data.
- Multer restricts uploads to JPG/PNG/WEBP under 5 MB.
- Centralized error handler never exposes raw server errors to the client.
