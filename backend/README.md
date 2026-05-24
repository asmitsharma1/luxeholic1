# Luxeholic Backend API

Node.js/Express backend API for Luxeholic luxury e-commerce platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📦 Tech Stack

- **Node.js** with Express
- **Firebase Admin SDK** for authentication
- **Axios** for external API calls
- **Helmet** for security
- **Morgan** for logging
- **CORS** for cross-origin requests
- **Rate Limiting** for API protection

## 🔧 Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your credentials to `.env`

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── products.js    # Product endpoints
│   │   ├── orders.js      # Order endpoints
│   │   └── auth.js        # Auth endpoints
│   └── server.js          # Main server file
├── .env.example
├── package.json
└── README.md
```

## 🌐 API Endpoints

### Health Check
```
GET /health
```

### Products
```
GET    /api/products          # Get all products
GET    /api/products/:id      # Get single product
GET    /api/products/search   # Search products
```

### Orders
```
POST   /api/orders                    # Create order
GET    /api/orders/:orderId           # Get order details
GET    /api/orders/user/:userId       # Get user orders
PATCH  /api/orders/:orderId/status    # Update order status
```

### Authentication
```
POST   /api/auth/verify               # Verify Firebase token
GET    /api/auth/profile/:userId      # Get user profile
PATCH  /api/auth/profile/:userId      # Update user profile
```

## 🔐 Security Features

- ✅ Helmet for HTTP headers security
- ✅ CORS configuration
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation
- ✅ Error handling

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test products endpoint
curl http://localhost:5000/api/products
```

## 🚢 Deployment

### Environment Variables
Set all required environment variables in your hosting platform.

### Recommended Platforms
- **Heroku**
- **Railway**
- **Render**
- **AWS EC2**
- **DigitalOcean**

## 📝 Environment Variables

See `.env.example` for all required variables.

## 🔗 Frontend Integration

The backend is configured to accept requests from:
- Development: `http://localhost:3000`
- Production: Set `FRONTEND_URL` in environment variables

## 📄 License

MIT
