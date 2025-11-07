# E-Commerce Backend API

Node.js/Express backend for the ShopSphere e-commerce platform.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Setup database:
```bash
# Import schema.sql into your MySQL database
mysql -u root -p < database/schema.sql
```

4. Start server:
```bash
npm run dev  # Development
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/categories/all` - Get all categories

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:product_id` - Update cart item
- `DELETE /api/cart/:product_id` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Analytics (Admin)
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/customers` - Customer analytics
- `GET /api/analytics/overview` - Dashboard overview

## Database Schema

- **users**: User accounts and authentication
- **categories**: Product categories
- **products**: Product catalog
- **orders**: Customer orders
- **order_items**: Order line items
- **cart**: Shopping cart items

## Authentication

Uses JWT tokens. Include in Authorization header:
```
Authorization: Bearer <token>
```