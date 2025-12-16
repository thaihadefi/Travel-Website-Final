# 🌍 Travel Website - Tour Booking Platform

## 📋 Overview

The Travel Website project is a full-stack web application that provides an online tour booking platform. It allows customers to browse tours, manage a shopping cart, place orders with multiple payment methods, and track their orders. At the same time, it provides an administration back office where administrators can manage tours, categories, orders, users, website configurations, and access control. 

The project is built on Node.js, Express, and MongoDB, with Pug templates for server-side rendering and a combination of custom JavaScript and third-party libraries on the frontend.

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
│   └── client/                # Client views
├── public/                    # Static assets
│   ├── assets/                # Client assets
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── admin/                 # Admin panel assets
├── index.js                   # Application entry point
├── package.json
└── dockerfile
```

## 🐳 Docker Deployment

### Container Architecture

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **web** | `node:alpine` | 5001 | Express application server |

### Quick Deploy

```bash
# 1. Clone repository
git clone https://github.com/thaihadefi/Travel-Website-Final.git
cd Travel-Website-Final

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Build and run with Docker
docker build -t travel-website .
docker run -p 5001:5001 --env-file .env travel-website

# 4. Verify container
docker ps

# 5. Access the application
# Client: http://localhost:5001
# Admin: http://localhost:5001/admin
```

### Docker Commands

| Command | Description |
|---------|-------------|
| `docker build -t travel-website .` | Build Docker image |
| `docker run -p 5001:5001 --env-file .env travel-website` | Run container with environment variables |
| `docker ps` | List running containers |
| `docker logs <container-id>` | View container logs |
| `docker exec -it <container-id> sh` | Access container shell |
| `docker stop <container-id>` | Stop container |

### Dockerfile

```dockerfile
FROM node:alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "index.js"]
```

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

After first run, you need to create an admin account manually by registering a new account via admin registration page

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
| `GET` | `/tours` | Tour list with filters |
| `GET` | `/tours/:slug` | Tour detail page |
| `GET` | `/category/:slug` | Tours by category |
| `GET` | `/search` | Search tours |
| `POST` | `/cart/detail` | Get cart details from localStorage |
| `POST` | `/order/create` | Create new order |
| `GET` | `/contact` | Contact page |
| `POST` | `/contact/send` | Send contact message |

### Admin Routes (Prefix: `/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard` | Dashboard statistics |
| `GET` | `/tours` | Tour list |
| `GET` | `/tours/create` | Create tour form |
| `POST` | `/tours/create` | Create new tour |
| `GET` | `/tours/edit/:id` | Edit tour form |
| `PATCH` | `/tours/edit/:id` | Update tour |
| `DELETE` | `/tours/delete/:id` | Soft delete tour |
| `GET` | `/categories` | Category list |
| `GET` | `/orders` | Order list |
| `PATCH` | `/orders/change-status/:id` | Update order status |
| `GET` | `/users` | User list |
| `GET` | `/accounts` | Admin account list |
| `GET` | `/profile` | Admin profile page |
| `PATCH` | `/profile/edit` | Update admin profile |
| `GET` | `/contacts` | Contact form submissions list |
| `GET` | `/messages` | Customer messages list |
| `GET` | `/setting/website-info` | Website settings page |
| `PATCH` | `/setting/website-info` | Update website settings |
| `GET` | `/setting/account-admin/list` | Admin accounts management |
| `GET` | `/setting/role/list` | Roles management |
| `POST` | `/upload/image` | Upload image to Cloudinary |

### Authentication Routes (Prefix: `/admin/account`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/login` | Login page |
| `POST` | `/login` | Authenticate admin |
| `GET` | `/register` | Registration page |
| `POST` | `/register` | Register new admin account |
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

- **Cloudinary** - Free cloud storage for images
- **MongoDB Atlas** - Database hosting
- **Render** - Free deployment platform
- Course instructors
- Open source community for libraries used

---

*This project is for educational purposes only.*


