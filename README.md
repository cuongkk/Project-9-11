# TravelKa - Tour Booking Platform

> **TravelKa** is a modern fullstack web application for online tour booking, integrated with e-payment gateways and smart AI support.

---

## Key Features

| Feature                  | Description                                                                       |
| ------------------------ | --------------------------------------------------------------------------------- |
| **JWT Authentication**   | Register, login, refresh token, and Admin/Client role authorization               |
| **Tour Management**      | Tour CRUD, Cloudinary image upload, advanced search and filtering                 |
| **Cart and Orders**      | Cart management, voucher application, and tour booking                            |
| **Integrated Payments**  | **ZaloPay** and **MoMo** (sandbox), callback handling, and signature verification |
| **AI Content Generator** | Auto-generate SEO content with Google Gemini AI                                   |
| **Admin Dashboard**      | Revenue analytics, order management, user and product administration              |
| **Blog and Journal**     | Travel article management with TinyMCE editor                                     |
| **Reviews and Ratings**  | Star-based tour rating system                                                     |
| **Voucher System**       | Create and apply discount codes with conditions                                   |
| **Email Service**        | Booking confirmation and password reset via Nodemailer                            |

---

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js v5
- **Database:** MongoDB + Mongoose ODM
- **Auth:** JWT (Access + Refresh Token), bcryptjs
- **Upload:** Multer + Cloudinary
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize, CORS
- **AI:** Google Generative AI (Gemini)
- **Payment:** ZaloPay API, MoMo API
- **Email:** Nodemailer + Gmail SMTP
- **Validation:** Joi

### Frontend

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** MUI (Material UI), Lucide, Phosphor Icons
- **State / Fetching:** SWR
- **Forms:** React Hook Form
- **Rich Editor:** TinyMCE
- **Charts:** Chart.js
- **Toast:** Sonner
- **Carousel:** Swiper

---

## Project Structure

```
Project-5/
├── backend/               # Express.js REST API
│   ├── src/
│   │   ├── configs/       # Database and Cloudinary config
│   │   ├── middlewares/   # Auth, RBAC, error, rate limit
│   │   ├── modules/       # Feature modules (tour, auth, payment, ai, ...)
│   │   │   ├── ai/
│   │   │   ├── auth/
│   │   │   ├── payment/
│   │   │   ├── tour/
│   │   │   └── ...
│   │   ├── routes/        # Main router
│   │   ├── utils/         # Helpers (cloudinary, response, ...)
│   │   └── validates/     # Joi schemas
│   ├── .env.example
│   └── index.ts           # App entry point
│
└── frontend/              # Next.js App Router
    ├── src/
    │   ├── app/           # Pages (App Router)
    │   │   ├── (client)/  # Client-facing pages
    │   │   └── admin/     # Admin dashboard pages
    │   ├── components/    # Shared and feature components
    │   ├── hooks/         # Custom React hooks
    │   ├── interfaces/    # TypeScript types
    │   └── utils/         # Frontend utilities
    └── .env.example
```

---

## Run The Project

### Requirements

- Node.js >= 18
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/travelka.git
cd travelka
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Fill in environment variables in .env
yarn install
yarn dev
```

> Backend runs at: `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in environment variables in .env.local
yarn install
yarn dev
```

> Frontend runs at: `http://localhost:3000`

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
GMAIL_USER=your@gmail.com
GMAIL_PASS=your_app_password

# AI
GEMINI_API_KEY=your_gemini_api_key

# ZaloPay (Sandbox)
ZALOPAY_APP_ID=2554
ZALOPAY_KEY1=...
ZALOPAY_KEY2=...
ZALOPAY_CALLBACK_URL=https://yourdomain.com/payment/callback

# MoMo (Sandbox)
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=...
MOMO_SECRET_KEY=...
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🔌 API Overview

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| `POST` | `/auth/register`         | Register a new account |
| `POST` | `/auth/login`            | Log in                 |
| `GET`  | `/dashboard/tours`       | Public tour list       |
| `GET`  | `/dashboard/tours/:slug` | Tour details           |
| `POST` | `/cart`                  | Add item to cart       |
| `POST` | `/order`                 | Create an order        |
| `POST` | `/payment/zalopay`       | Pay with ZaloPay       |
| `POST` | `/payment/momo`          | Pay with MoMo          |
| `POST` | `/ai/generate-content`   | Generate AI content    |
| `GET`  | `/health`                | Health check           |

---

## 🏥 Health Check

```
GET /health
→ { "status": "ok", "timestamp": "...", "uptime": ... }
```

---

## 📄 License

MIT © 2024 TravelKa Team
