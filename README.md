# 🌍 Travel Website 

## 📋 Overview

This project is a full-stack web application that provides an online tour booking platform. It allows customers to browse tours, manage a shopping cart, place orders with multiple payment methods, and track their orders. At the same time, it provides an administration back office where administrators can manage tours, categories, orders, users, website configurations, and access control. 

The project is built on **Node.js**, **Express**, and **MongoDB**, with **Pug** templates for server-side rendering and a combination of custom JavaScript and third-party libraries on the frontend.

🌐 **Live Demo:** https://uit-ua.onrender.com/

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Docker Deployment](#-docker-deployment)
- [Local Development](#-local-development)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)

## ✨ Key Features

### Client Features
| Feature | Description |
|---------|-------------|
| 🏖️ **Tour Browsing** | Browse tours by category, city, price range, and departure date |
| 🔍 **Advanced Search** | Search tours by keyword with real-time filtering |
| 🛒 **Shopping Cart** | Add tours to cart with localStorage persistence |
| 📅 **Tour Details** | View detailed tour information, schedules, and image galleries |
| 💳 **Payment Integration** | Support for ZaloPay, VNPay, bank transfer, and cash payment |
| 📊 **Order Tracking** | View order history and status updates |
| 📱 **Responsive Design** | Optimized for mobile, tablet, laptop, and desktop devices |

### Admin Features
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Admin login, registration, password recovery with email verification |
| 📊 **Dashboard** | Overview of orders, revenue, and system statistics |
| 🗂️ **Tour Management** | Create, edit, delete tours with image uploads |
| 📁 **Category Management** | Organize tours into hierarchical categories |
| 👥 **User Management** | Manage customer accounts |
| 📦 **Order Management** | Process orders and update order status |
| 👨‍💼 **Admin Accounts** | Manage admin accounts with role assignment |
| 🔐 **Role & Permissions (RBAC)** | Fine-grained access control with customizable roles and permissions |
| 📧 **Contact Messages** | View and respond to customer inquiries |
| ⚙️ **Website Settings** | Configure site information and contact details |
| 👤 **Profile Management** | Update admin profile information |

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | Node.js + Express | REST API server |
| | Mongoose | MongoDB object modeling |
| | JWT | Token-based authentication |
| | bcrypt.js | Password hashing |
| **Frontend** | Pug | Server-side templating |
| | Vanilla JavaScript | Client-side interactivity |
| | CSS3 | Custom responsive styling |
| **Validation** | JustValidate | Client-side form validation |
| | Joi | Server-side validation |
| **File Upload** | Multer | Multipart form handling |
| | Cloudinary | Cloud image storage |
| | FilePond | File upload UI |
| **Editor** | TinyMCE | WYSIWYG content editor |
| **Payment** | ZaloPay API | Vietnamese e-wallet payment |
| | VNPay API | Vietnamese bank payment gateway |
| **Email** | Nodemailer | Transactional emails (Gmail SMTP) |
| **Database** | MongoDB | NoSQL database |
| **DevOps** | Docker | Containerization platform |
| | Docker Compose | Multi-container orchestration |
| | Docker Hub | Container image registry |
| | Render | Cloud deployment and hosting |
| | Git | Version control system |

## 📁 Project Structure

```
travel-website/
├── config/                    # Configuration files
│   ├── database.config.js     # MongoDB connection
│   └── variable.config.js     # Global variables & settings
├── controllers/               # Request handlers
│   ├── admin/                 # Admin panel controllers
│   │   ├── account.controller.js
│   │   ├── category.controller.js
│   │   ├── contact.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── message.controller.js
│   │   ├── order.controller.js
│   │   ├── profile.controller.js
│   │   ├── setting.controller.js
│   │   ├── tour.controller.js
│   │   ├── upload.controller.js
│   │   └── user.controller.js
│   └── client/                # Client-side controllers
│       ├── cart.controller.js
│       ├── category.controller.js
│       ├── contact.controller.js
│       ├── home.controller.js
│       ├── order.controller.js
│       ├── search.controller.js
│       └── tour.controller.js
├── models/                    # Database schemas
│   ├── account-admin.model.js
│   ├── category.model.js
│   ├── city.model.js
│   ├── contact-message.model.js
│   ├── contact.model.js
│   ├── forgot-password.model.js
│   ├── order.model.js
│   ├── role.model.js
│   ├── setting-website-info.model.js
│   └── tour.model.js
├── routes/                    # API routes
│   ├── admin/                 # Admin routes
│   └── client/                # Client routes
├── middlewares/               # Custom middleware
│   ├── admin/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── setting.middleware.js
│   └── client/
│       ├── category.middleware.js
│       ├── city.middleware.js
│       └── setting.middleware.js
├── validates/                 # Validation schemas
│   ├── admin/
│   └── client/
├── helpers/                   # Utility functions
│   ├── category.helper.js
│   ├── cloudinary.helper.js
│   ├── generate.helper.js
│   └── mail.helper.js
├── views/                     # Pug templates
│   ├── admin/                 # Admin panel views
│   │   ├── layouts/
│   │   ├── mixins/
│   │   ├── pages/
│   │   └── partials/
│   └── client/                # Client views
│       ├── layouts/
│       ├── mixins/
│       ├── pages/
│       └── partials/
├── public/                    # Static assets
│   ├── assets/                # Client assets
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── admin/                 # Admin panel assets
├── index.js                   # Application entry point
├── package.json
├── yarn.lock
├── Dockerfile                 # Docker build configuration
├── docker-compose.yml         # Docker Compose orchestration
├── .dockerignore             # Docker build exclusions
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── .gitignore
├── DOCKER.md                 # Docker deployment guide
└── README.md                 # Project documentation
```

## 🐳 Docker Deployment

### Quick Start

```bash
# Using Docker Compose (Recommended)
docker-compose up -d

# Or build from Dockerfile
docker build -t travel-website .
docker run -p 5001:5001 --env-file .env travel-website

# Or pull from Docker Hub
docker pull thaihadefi/travel-website:v1.0
docker run -p 5001:5001 --env-file .env thaihadefi/travel-website:v1.0
```

**📖 For detailed Docker instructions, see [DOCKER.md](DOCKER.md)**

**What's included:**
- ✅ `Dockerfile` - Build production image
- ✅ `docker-compose.yml` - One-command deployment
- ✅ Health checks & auto-restart
- ✅ MongoDB Atlas integration

## 🚀 Local Development

### Prerequisites

- Node.js 18+ and yarn
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image uploads)
- Gmail account with App Password (for emails)
- ZaloPay/VNPay merchant accounts (for payment integration)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/thaihadefi/Travel-Website-Final.git
cd Travel-Website-Final

# 2. Install dependencies
yarn install

# 3. Create .env file
cp .env.example .env

# 4. Configure environment variables (see below)
nano .env

# 5. Run the application
yarn start

# 7. Access the application
# Client: http://localhost:5001
# Admin: http://localhost:5001/admin
```

### Creating Admin Account

After first run, you need to create an admin account manually by registering a new account via admin registration page.

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE=mongodb+srv://username:password@cluster0.tlpf0fp.mongodb.net/database-name

# JWT Authentication
JWT_SECRET=your-random-secret-key

# Email Configuration (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ZaloPay Configuration
ZALOPAY_APPID=2554
ZALOPAY_KEY1=your-zalopay-key1
ZALOPAY_KEY2=your-zalopay-key2
ZALOPAY_DOMAIN=https://sb-openapi.zalopay.vn

# VNPay Configuration
VNPAY_TMNCODE=your-vnpay-tmncode
VNPAY_SECRET=your-vnpay-secret-key
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Website Domain (for payment callbacks)
WEBSITE_DOMAIN=http://localhost:5001

# TinyMCE (Optional)
TINYMCE_API_KEY=your-tinymce-api-key
```

### Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE` | ✅ | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | ✅ | Secret key for JWT token signing |
| `GMAIL_USER` | ✅ | Gmail account for sending emails |
| `GMAIL_PASS` | ✅ | Gmail App Password (not regular password) |
| `CLOUDINARY_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `ZALOPAY_APPID` | ✅ | ZaloPay App ID (sandbox: 2554) |
| `ZALOPAY_KEY1` | ✅ | ZaloPay Key 1 |
| `ZALOPAY_KEY2` | ✅ | ZaloPay Key 2 |
| `ZALOPAY_DOMAIN` | ✅ | ZaloPay API endpoint |
| `VNPAY_TMNCODE` | ✅ | VNPay Terminal Code |
| `VNPAY_SECRET` | ✅ | VNPay Hash Secret Key |
| `VNPAY_URL` | ✅ | VNPay Payment URL |
| `WEBSITE_DOMAIN` | ✅ | Your website URL (for payment callbacks) |
| `TINYMCE_API_KEY` | ❌ | TinyMCE API key (optional) |

## 📡 API Endpoints

### Client Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Homepage |
| `GET` | `/tour/detail/:slug` | Tour detail page |
| `GET` | `/category/:slug` | Tours by category |
| `GET` | `/search` | Search tours |
| `GET` | `/cart` | Cart page |
| `POST` | `/cart/detail` | Get cart details from localStorage |
| `GET` | `/contact` | Contact page |
| `POST` | `/contact/send-message` | Send contact message |
| `POST` | `/contact/create` | Create contact form submission |
| `POST` | `/order/create` | Create new order |
| `GET` | `/order/track` | Order tracking page |
| `POST` | `/order/track` | Track order by code |
| `GET` | `/order/success` | Order success page |
| `GET` | `/order/payment-zalopay` | ZaloPay payment redirect |
| `POST` | `/order/payment-zalopay-result` | ZaloPay payment callback |
| `GET` | `/order/payment-vnpay` | VNPay payment redirect |
| `GET` | `/order/payment-vnpay-result` | VNPay payment callback |

### Admin Routes (Prefix: `/admin`)

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard` | Dashboard statistics |
| `POST` | `/dashboard/revenue-chart` | Get revenue chart data |

#### Tour Management (`/admin/tour`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tour/list` | Tour list |
| `GET` | `/tour/create` | Create tour form |
| `POST` | `/tour/create` | Create new tour |
| `GET` | `/tour/edit/:id` | Edit tour form |
| `PATCH` | `/tour/edit/:id` | Update tour |
| `PATCH` | `/tour/delete/:id` | Soft delete tour |
| `GET` | `/tour/trash` | Deleted tours list |
| `PATCH` | `/tour/undo/:id` | Restore deleted tour |
| `DELETE` | `/tour/destroy/:id` | Permanently delete tour |
| `PATCH` | `/tour/change-multi` | Bulk actions on tours |

#### Category Management (`/admin/category`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/category/list` | Category list |
| `GET` | `/category/create` | Create category form |
| `POST` | `/category/create` | Create new category |
| `GET` | `/category/edit/:id` | Edit category form |
| `PATCH` | `/category/edit/:id` | Update category |
| `PATCH` | `/category/delete/:id` | Soft delete category |
| `GET` | `/category/trash` | Deleted categories list |
| `PATCH` | `/category/undo/:id` | Restore deleted category |
| `DELETE` | `/category/destroy/:id` | Permanently delete category |
| `PATCH` | `/category/change-multi` | Bulk actions on categories |

#### Order Management (`/admin/order`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/order/list` | Order list |
| `GET` | `/order/edit/:id` | Edit order form |
| `PATCH` | `/order/edit/:id` | Update order |
| `PATCH` | `/order/delete/:id` | Soft delete order |
| `GET` | `/order/trash` | Deleted orders list |
| `PATCH` | `/order/undo/:id` | Restore deleted order |
| `DELETE` | `/order/destroy/:id` | Permanently delete order |
| `PATCH` | `/order/change-multi` | Bulk actions on orders |

#### User Management (`/admin/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user/list` | User list |

#### Contact Management (`/admin/contact`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/contact/list` | Contact form submissions list |
| `PATCH` | `/contact/delete/:id` | Soft delete contact |
| `GET` | `/contact/trash` | Deleted contacts list |
| `PATCH` | `/contact/undo/:id` | Restore deleted contact |
| `DELETE` | `/contact/destroy/:id` | Permanently delete contact |
| `PATCH` | `/contact/change-multi` | Bulk actions on contacts |

#### Message Management (`/admin/message`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/message/list` | Customer messages list |
| `PATCH` | `/message/delete/:id` | Soft delete message |
| `GET` | `/message/trash` | Deleted messages list |
| `PATCH` | `/message/undo/:id` | Restore deleted message |
| `DELETE` | `/message/destroy/:id` | Permanently delete message |
| `PATCH` | `/message/change-multi` | Bulk actions on messages |

#### Profile Management (`/admin/profile`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/profile/edit` | Edit profile form |
| `PATCH` | `/profile/edit` | Update admin profile |
| `GET` | `/profile/change-password` | Change password form |
| `PATCH` | `/profile/change-password` | Update password |

#### Website Settings (`/admin/setting`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/setting/list` | Settings overview |
| `GET` | `/setting/website-info` | Website info settings |
| `PATCH` | `/setting/website-info` | Update website info |

#### Admin Account Management (`/admin/setting/account-admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/setting/account-admin/list` | Admin accounts list |
| `GET` | `/setting/account-admin/create` | Create admin form |
| `POST` | `/setting/account-admin/create` | Create new admin |
| `GET` | `/setting/account-admin/edit/:id` | Edit admin form |
| `PATCH` | `/setting/account-admin/edit/:id` | Update admin account |
| `PATCH` | `/setting/account-admin/delete/:id` | Soft delete admin |
| `GET` | `/setting/account-admin/trash` | Deleted admins list |
| `PATCH` | `/setting/account-admin/undo/:id` | Restore deleted admin |
| `DELETE` | `/setting/account-admin/destroy/:id` | Permanently delete admin |
| `PATCH` | `/setting/account-admin/change-multi` | Bulk actions on admins |

#### Role Management (`/admin/setting/role`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/setting/role/list` | Roles list |
| `GET` | `/setting/role/create` | Create role form |
| `POST` | `/setting/role/create` | Create new role |
| `GET` | `/setting/role/edit/:id` | Edit role form |
| `PATCH` | `/setting/role/edit/:id` | Update role |
| `PATCH` | `/setting/role/delete/:id` | Soft delete role |
| `GET` | `/setting/role/trash` | Deleted roles list |
| `PATCH` | `/setting/role/undo/:id` | Restore deleted role |
| `DELETE` | `/setting/role/destroy/:id` | Permanently delete role |
| `PATCH` | `/setting/role/change-multi` | Bulk actions on roles |

#### File Upload (`/admin/upload`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload/image` | Upload image to Cloudinary |

### Authentication Routes (Prefix: `/admin/account`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/login` | Login page |
| `POST` | `/login` | Authenticate admin |
| `GET` | `/register` | Registration page |
| `POST` | `/register` | Register new admin account |
| `GET` | `/register-initial` | Initial admin registration |
| `GET` | `/forgot-password` | Forgot password page |
| `POST` | `/forgot-password` | Send OTP to email |
| `GET` | `/otp-password` | OTP verification page |
| `POST` | `/otp-password` | Verify OTP code |
| `GET` | `/reset-password` | Reset password page |
| `POST` | `/reset-password` | Update new password |
| `POST` | `/logout` | Logout admin |

## 🔒 Security Features

- ✅ JWT-based authentication with httpOnly cookies
- ✅ Password hashing with bcrypt.js
- ✅ Input validation (client & server side with JustValidate and Joi)
- ✅ **Role-Based Access Control (RBAC)** - Fine-grained permission system
- ✅ Secure file upload validation
- ✅ NoSQL injection prevention
- ✅ XSS protection

### 🔐 RBAC Implementation

The project implements a sophisticated Role-Based Access Control system:

**Key Components:**
- **Role Model**: Stores role information with customizable permissions array
- **Account-Role Relationship**: Each admin account is assigned a role
- **Permission Middleware**: Automatically loads and verifies permissions on each request
- **Dynamic Permission Checking**: Views and controllers check specific permissions before allowing actions

**Available Permissions:**
- `dashboard-view` - View dashboard statistics
- `category-view`, `category-edit`, `category-delete`, `category-trash` - Category management
- `tour-view`, `tour-create`, `tour-edit`, `tour-delete`, `tour-trash` - Tour management
- `user-view` - View customer accounts
- `contact-view` - Contact form management
- `message-view` - Message management

**Admin Routes with RBAC:**
- `/admin/setting/role/list` - View all roles
- `/admin/setting/role/create` - Create new role with permissions
- `/admin/setting/role/edit/:id` - Edit role permissions
- `/admin/setting/role/delete/:id` - Soft delete role
- `/admin/setting/role/trash` - View deleted roles
- `/admin/setting/role/undo/:id` - Restore deleted role
- `/admin/setting/role/destroy/:id` - Permanently delete role

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| mongoose | ^8.17.1 | MongoDB ODM |
| mongoose-slug-updater | ^3.3.0 | Auto-generate slugs for URLs |
| pug | ^3.0.3 | Template engine |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| bcryptjs | ^3.0.2 | Password hashing |
| multer | ^2.0.2 | File upload handling |
| multer-storage-cloudinary | ^4.0.0 | Cloudinary storage for multer |
| cloudinary | ^2.7.0 | Cloud image storage |
| nodemailer | ^7.0.11 | Email sending |
| joi | ^18.0.1 | Server-side validation |
| moment | ^2.30.1 | Date formatting |
| axios | ^1.12.2 | HTTP client for payment APIs |
| crypto-js | ^4.2.0 | Encryption for payment signatures |
| cookie-parser | ^1.4.7 | Parse cookies |
| slugify | ^1.6.6 | Generate URL slugs |
| dotenv | ^17.2.1 | Environment variables |
| nodemon | ^3.1.10 | Development auto-reload |

## 🙏 Acknowledgments

- Course instructors
- GitHub Student Developer Pack
- **Render** - Free deployment platform
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Free cloud storage for images
- Open source community for libraries used

---

*This project is for educational purposes only.*


