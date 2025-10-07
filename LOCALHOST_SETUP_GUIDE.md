# 🚀 Localhost Testing Setup Guide

## Prerequisites

- PHP 8.1+
- Composer
- MySQL 8.0+
- Node.js 18+
- npm or yarn

---

## ⚡ Quick Start (Step-by-Step)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd ecom-backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 2: Configure Database

1. Create MySQL database:
```sql
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Edit `ecom-backend/.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### Step 2.5: Configure CORS (if needed)

If you get CORS errors, install the CORS package:
```bash
cd ecom-backend
composer require fruitcake/laravel-cors
```

Then add the middleware to `app/Http/Kernel.php` in the `$middleware` array:
```php
\Fruitcake\Cors\HandleCors::class,
```

And configure in `config/cors.php` (create if it doesn't exist):
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### Step 3: Run Migrations & Seed Database

```bash
# Run migrations
php artisan migrate

# Seed database with test data
php artisan db:seed --class=EcommerceSeeder

# Create storage symlink
php artisan storage:link
```

### Step 4: Start Backend Server

```bash
# Start Laravel development server
php artisan serve
# Backend will run on http://localhost:8000
```

### Step 5: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

### Step 6: Start Frontend Server

```bash
# Start Next.js development server
npm run dev
# Frontend will run on http://localhost:3000
```

---

## 🧪 Test Accounts

After seeding, you can login with these accounts:

### Admin Account
- **Email:** admin@ecommerce.test
- **Password:** password123
- **Role:** admin

### User Account
- **Email:** user@ecommerce.test
- **Password:** password123
- **Role:** user

### Rider Account
- **Email:** rider@ecommerce.test
- **Password:** password123
- **Role:** rider

---

## 🔍 Testing Checklist

- [ ] Backend server running on http://localhost:8000
- [ ] Frontend server running on http://localhost:3000
- [ ] Database created and migrated
- [ ] Test data seeded
- [ ] Can access login page: http://localhost:3000/login
- [ ] Can login with test accounts
- [ ] Role-based redirection working
- [ ] Can view products: http://localhost:3000/products
- [ ] API endpoints responding correctly

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "PDOException: SQLSTATE[HY000] [1045] Access denied"**
- Solution: Check MySQL credentials in `.env` file

**Error: "No application encryption key"**
- Solution: Run `php artisan key:generate`

**Error: "Storage not linked"**
- Solution: Run `php artisan storage:link`

**Error: "Class not found"**
- Solution: Run `composer dump-autoload`

### Frontend Issues

**Error: "NEXT_PUBLIC_API_URL is not defined"**
- Solution: Create `.env.local` file with `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

**Error: "Network Error" when calling API**
- Solution: Ensure backend server is running and CORS is configured

**Error: "Cannot read properties of undefined"**
- Solution: Check if API response structure matches frontend expectations

**Pages crashing on load**
- Solution: Ensure 'use client' directive is added to pages using React hooks

### CORS Issues

If you get CORS errors, update `ecom-backend/config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

---

## 📝 API Endpoints Currently Working

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout (requires auth)
- `GET /api/user` - Get authenticated user (requires auth)

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/{id}` - Update product (requires auth)
- `DELETE /api/products/{id}` - Delete product (requires auth)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (requires auth)
- `PUT /api/categories/{id}` - Update category (requires auth)
- `DELETE /api/categories/{id}` - Delete category (requires auth)

### Orders
- `GET /api/orders` - List orders (requires auth)
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders/{id}` - Get order details (requires auth)

### User Addresses
- `GET /api/user-addresses` - List user addresses (requires auth)
- `POST /api/user-addresses` - Create address (requires auth)

---

## 🎯 Current Limitations

### What Works
✅ User registration and login  
✅ Role-based authentication  
✅ Product listing  
✅ Basic CRUD for products, categories  
✅ Token-based API authentication  

### What Doesn't Work Yet
❌ Dashboard pages (admin/user/rider)  
❌ Cart functionality  
❌ Checkout process  
❌ Order management  
❌ File uploads  
❌ Payment processing  
❌ Rider assignment  
❌ Most admin features  

---

## 📧 Support

If you encounter issues not covered here, please:
1. Check the PROJECT_ANALYSIS.md file for known issues
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check Laravel and Next.js logs for error details

---

## 🔄 Reset Database

If you need to reset the database:

```bash
cd ecom-backend
php artisan migrate:fresh --seed
```

This will drop all tables, recreate them, and reseed with test data.

---

**Happy Testing! 🎉**
