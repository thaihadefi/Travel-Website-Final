# Travel Website: Full-Stack Online Tour Booking & Management Platform

[![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Express](https://img.shields.io/badge/Backend-Express%205-339933?style=flat-square&logo=express)](https://expressjs.com/)
[![Template](https://img.shields.io/badge/Template-Pug-A86454?style=flat-square&logo=pug)](https://pugjs.org/)
[![CSS3](https://img.shields.io/badge/Styling-CSS3-1572B6?style=flat-square&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Travel Website is a full-stack online tour booking platform and administrative back-office system built for customers and tour operators. The platform connects travelers with booking services through dynamic tour catalog browsing, category and city filtering, client-side cart persistence, multi-gateway payments (**ZaloPay**, **VNPay**, bank transfer, cash), real-time order tracking, role-based access control (RBAC), rich-text catalog management, soft-delete trash recovery, and Cloudinary asset cleanup.

---

## Key Features

### Customer Booking Workflow
- **Tour Discovery & Advanced Search:** Keyword and filter-based tour search supporting categories, cities, price ranges, departure dates, and dynamic URL slugification (`mongoose-slug-updater`).
- **Interactive Tour Pages:** Comprehensive schedules, itinerary details, departure dates, destination highlights, and high-resolution Cloudinary image galleries.
- **Cart & Order Persistence:** Interactive shopping cart with persistent session management (`localStorage`), real-time subtotal calculations, and order creation.
- **Multi-Gateway Payment Integration:** Seamless checkout workflows integrating **ZaloPay** e-wallet API, **VNPay** bank portal, direct bank transfer (`bank`), and cash payment (`money`).
- **Real-Time Booking & Order Tracking:** Customer lookup dashboard tracking order status transitions (`initial`, `done`, `cancel`) via unique booking codes.

### Store Manager Workflow
- **Catalog & Rich Editor:** Rich-text tour and category management (TinyMCE) supporting Cloudinary image uploads, pricing, availability caps, and soft-delete trash recovery across all entities.
- **Order & Customer Fulfillment:** Searchable order management inbox with direct status updates (`initial`, `done`, `cancel`), contact inquiry messages, and customer email dispatch via Nodemailer.
- **Sales Analytics & Performance Reporting:** Back-office dashboard presenting total revenue metrics, booking counts, category breakdowns, and performance statistics.

### Admin Moderation
- **Role-Based Access Control (RBAC):** Fine-grained permission-matrix administration protecting core management routes across custom admin roles (`tour-view`, `tour-create`, `category-edit`, etc.).
- **Account & Content Moderation:** Admin account verification workflow (`initial` -> `active`), contact submission management, customer message inbox moderation, and administrator profile updates.
- **Website Configuration:** Centralized settings management for website contact details, site metadata, and direct Cloudinary image upload endpoints.

---

## Technology Stack

- **Frontend:** Server-Side Rendering with Pug Templates, CSS3, Vanilla JavaScript ES6+, JustValidate, TinyMCE WYSIWYG, FilePond.
- **Backend:** Node.js, Express 5, JavaScript (ES6+), Nodemailer (Gmail SMTP), Bcryptjs, Joi, Axios, CryptoJS, Cookie-Parser, JWT Authentication.
- **Database & Storage:** MongoDB Atlas (Mongoose ORM), Mongoose Slug Updater (`mongoose-slug-updater`), Cloudinary CDN (`multer-storage-cloudinary`).
- **Infrastructure:** Layered Architecture, Role-Based Access Control (RBAC), Soft-Delete Trash Recovery, HttpOnly Cookies, Multer Direct-to-Cloudinary Streaming Upload, Docker, Docker Compose, Render Cloud Hosting.

---

## Project Structure

```text
travel-website/
├── config/                    # Database connections & global environment configurations
│   ├── database.config.js     # MongoDB Atlas connection setup
│   └── variable.config.js     # Global system variables & path constants
├── controllers/               # HTTP request handlers (admin/, client/)
│   ├── admin/                 # Back-office controllers (account, category, contact, dashboard, message, order, profile, setting, tour, upload, user)
│   └── client/                # Storefront controllers (cart, category, contact, home, order, search, tour)
├── helpers/                   # Utility helpers (category hierarchy tree, Cloudinary storage upload, mailer, string generator)
├── middlewares/               # Custom Express middlewares (admin/, client/)
│   ├── admin/                 # JWT authentication verification & RBAC setting middlewares
│   └── client/                # Customer category tree, city list, & website info middlewares
├── models/                    # Mongoose data models & schemas (Tour, Category, City, Order, Role, AccountAdmin, ContactMessage, etc.)
├── public/                    # Static web assets (admin/, assets/)
│   ├── admin/assets/          # Back-office CSS styles, JavaScript scripts, & icons
│   └── assets/                # Customer storefront CSS styles, JavaScript scripts, & media
├── routes/                    # Express routing modules (admin/, client/)
│   ├── admin/                 # Admin management routes & RBAC endpoints (account, category, tour, order, role, etc.)
│   └── client/                # Customer-facing storefront routes (home, tour, cart, search, order, contact)
├── validates/                 # Joi request payload validation schemas (admin/, client/)
│   ├── admin/                 # Back-office validation schemas (account, category, order, profile, setting, tour)
│   └── client/                # Customer storefront validation schemas (contact, order, search)
├── views/                     # Server-rendered Pug templates (admin/, client/)
│   ├── admin/                 # Back-office dashboard layouts, mixins, pages, & partials
│   └── client/                # Storefront layouts, mixins, pages, & partials
├── .dockerignore             # Docker container build exclusions file
├── .env.example              # Environment variables template configuration
├── .gitignore                # Git version control exclusions file
├── docker-compose.yml        # Multi-container Docker deployment script
├── dockerfile                # Production Docker container image configuration
├── DOCKER.md                 # Container deployment reference guide
├── index.js                  # Express backend application entry point
├── LICENSE                   # MIT License file (UIT-UA Team)
├── package.json              # Web application dependencies & npm/yarn scripts
├── README.md                 # Primary project documentation
└── yarn.lock                 # Yarn package lockfile
```

---

## Getting Started

> [!NOTE]
> **Deployment Note (Render Free Tier):** Render's free tier restricts outbound traffic on standard SMTP ports (25, 465, 587), affecting live transactional email delivery (OTP password reset). Outbound emails function normally in local development or when deployed on platforms with open outbound networking (DigitalOcean, Railway, AWS).

### Prerequisites
- Node.js (v18+)
- Yarn or npm
- MongoDB Atlas or local MongoDB instance
- Cloudinary account
- Gmail account with App Password (for SMTP emails)

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/thaihadefi/Travel-Website-Final.git
cd Travel-Website-Final

# Start containerized services using Docker Compose
docker-compose up -d
```

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/thaihadefi/Travel-Website-Final.git
cd Travel-Website-Final

# 2. Install project dependencies
yarn install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server
yarn start
```

---

## License

This project is licensed under the [MIT License](LICENSE).
