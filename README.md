# Multi-Role E-Commerce Platform (Admin, User, Rider)

## ⚙️ Tech Stack

- **Backend**: Laravel 11 (PHP 8+)
- **Database**: MySQL (Local)
- **Frontend**: Next.js / Nuxt.js
- **Storage**: Local (/storage/app/public/uploads)
- **Auth**: Laravel Sanctum / JWT
- **API Type**: REST (JSON)
- **Hosting**: Shared Web Hosting (cPanel)
- **Frontend-Backend Communication**: Axios / Fetch (JSON-based APIs)

## 👥 Roles

- **Admin** – full control
- **User** – can order, view, manage profile
- **Rider** – manages deliveries

### Role-Based Redirection

After login, redirect based on role:

- `/admin/dashboard`
- `/user/dashboard`
- `/rider/dashboard`

## 🧠 DFD (Data Flow Diagram)

### Level 0: Context Diagram

**Actors**: Admin, User, Rider

**System**: E-Commerce Platform

**External Entities**: Database (MySQL), Local Storage (Images/Videos)

**Data Flows**:

- User → Product Search, Order Placement → System
- Admin → Product, Order, User Management → System
- Rider → Delivery Updates → System
- System ↔ Database ↔ Storage

### Level 1: Main Processes

#### User Module

- Register/Login
- Browse Products
- Add to Cart / Checkout
- Track Orders
- Manage Profile

#### Admin Module

- Manage Users, Riders
- Manage Categories & Products
- Assign Orders
- View Reports

#### Rider Module

- View Assigned Orders
- Update Delivery Status
- View Earnings

#### Common Services

- Authentication (Login/Register)
- File Upload (Image/Video)
- Notifications

## 🗄️ Entity Relationship Diagram (ER Model)

### Main Entities:

#### users

- id (PK)
- name
- email
- password
- phone
- role (admin, user, rider)
- status (active, blocked)
- profile_image
- created_at
- updated_at

#### categories

- id (PK)
- name
- parent_id (nullable)
- slug
- status
- created_at
- updated_at

#### products

- id (PK)
- category_id (FK → categories.id)
- name
- slug
- description
- price
- discount_price (nullable)
- stock
- sku
- image (main image)
- video (nullable)
- status (active, inactive)
- created_at
- updated_at

#### product_images

- id (PK)
- product_id (FK → products.id)
- file_path

#### orders

- id (PK)
- user_id (FK → users.id)
- rider_id (FK → users.id)
- order_number
- total_amount
- payment_method (cod, online)
- payment_status (pending, paid, failed)
- delivery_status (pending, processing, on_way, delivered, cancelled)
- address
- created_at
- updated_at

#### order_items

- id (PK)
- order_id (FK → orders.id)
- product_id (FK → products.id)
- quantity
- price

#### rider_deliveries

- id (PK)
- rider_id (FK → users.id)
- order_id (FK → orders.id)
- status (assigned, picked, on_way, delivered)
- updated_at

#### banners

- id (PK)
- title
- image
- link_url (nullable)
- status
- created_at
- updated_at

#### addresses

- id (PK)
- user_id (FK → users.id)
- address_line
- city
- postal_code
- phone
- is_default (bool)
- created_at
- updated_at

#### payments

- id (PK)
- order_id (FK → orders.id)
- amount
- transaction_id
- method
- status
- created_at

### 🔗 Relationships Summary

| Entity | Relationship |
|--------|--------------|
| users → orders | 1 : Many |
| users → addresses | 1 : Many |
| categories → products | 1 : Many |
| products → order_items | 1 : Many |
| orders → order_items | 1 : Many |
| orders → rider_deliveries | 1 : 1 |
| orders → payments | 1 : 1 |
| riders → rider_deliveries | 1 : Many |

## 🧩 Backend Functional Modules

### Authentication Module

- Register, Login, Logout
- Role-based access control (middleware)
- Token management

### User Module

- Profile view/edit
- Address management
- Order management
- View history

### Admin Module

- Manage users/riders
- Manage categories/products
- Assign riders to orders
- View reports

### Rider Module

- Assigned orders
- Status update
- Delivery history

### Product Module

- CRUD products
- Upload images/videos
- Search/filter products

### Order Module

- Create order
- Track status
- Admin assignment

### Payment Module

- Handle COD and online transactions
- Update order payment status

### Banner Module

- Homepage banners
- Admin CRUD

## 🧠 API Routes Overview

### Auth
```
POST /api/register
POST /api/login
POST /api/logout
GET  /api/user
```

### Admin
```
GET    /api/admin/dashboard
GET    /api/admin/users
PATCH  /api/admin/user/{id}
DELETE /api/admin/user/{id}
GET    /api/admin/orders
PATCH  /api/admin/order/{id}/status
POST   /api/admin/product
PUT    /api/admin/product/{id}
DELETE /api/admin/product/{id}
GET    /api/admin/reports/sales
POST   /api/admin/banner
```

### User
```
GET    /api/products
GET    /api/products/{id}
GET    /api/categories
POST   /api/cart
GET    /api/cart
POST   /api/order
GET    /api/user/orders
GET    /api/user/profile
PUT    /api/user/profile
```

### Rider
```
GET    /api/rider/orders
PATCH  /api/rider/order/{id}/status
GET    /api/rider/history
GET    /api/rider/profile
PUT    /api/rider/profile
```

## 🖥️ Frontend Pages (Next.js / Nuxt.js)

### Public:

- `/` → Homepage
- `/login`
- `/register`
- `/products`
- `/product/[id]`
- `/cart`
- `/checkout`

### User:

- `/user/dashboard`
- `/user/orders`
- `/user/profile`
- `/user/address`

### Admin:

- `/admin/dashboard`
- `/admin/users`
- `/admin/products`
- `/admin/orders`
- `/admin/reports`
- `/admin/banners`

### Rider:

- `/rider/dashboard`
- `/rider/orders`
- `/rider/history`
- `/rider/profile`

## 📦 Storage

All images/videos stored locally at:

`/storage/app/public/uploads/`

Only file paths saved in MySQL.

## 🧭 Workflow Summary

1. User/Admin/Rider → Login → Token generated
2. Based on role → redirected to specific dashboard
3. All requests via REST API
4. MySQL handles all persistent data
5. Local storage for media
6. Admin fully controls product, user, order management
7. Secure role-based middleware for access


also secure it using api keys  , flow will be  , all should be encrypted higher security 

#Test using  Test Script mcp

## 📋 Project Status & Missing Features

### ✅ Currently Implemented:
- Basic authentication (login/register)
- User model with role-based system
- Product listing page
- Basic API structure
- Role middleware
- Database migrations for all entities

### ❌ Missing Features:
- **Frontend Pages**: Only 3 pages exist (login, register, products) - missing 12+ pages
- **API Endpoints**: Most endpoints in README are not implemented
- **Admin/Rider/User dashboards**
- **Order management system**
- **Cart functionality**
- **Payment processing**
- **File upload handling**
- **API security enhancements**
- **Database seeders and factories**
- **Frontend routing and navigation**
- **State management**
- **Form validation**
- **Error handling**
- **Responsive design**

### 🚧 Incomplete:
- Product model missing some fields (discount_price, video, status)
- Missing controller implementations
- Missing API route implementations
- No frontend layout/navigation
- No dashboard pages
# I've analyzed your e-commerce platform and identified the current state:

✅ __Completed:__

- Product model enhanced with missing fields (discount_price, video, status, slug)
- ProductImage model created
- Basic API structure exists
- Authentication working with role-based redirection

⚠️ __Critical Issues Found:__

- Only 3 frontend pages exist (login, register, products)
- Most API endpoints not implemented
- No responsive layout
- Missing cart/order functionality
- Incomplete controllers

# last step  for testing use test script 
