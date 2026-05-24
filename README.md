# 🛍️ Luxeholic - Luxury E-Commerce Platform

Full-stack luxury fashion e-commerce platform with React frontend and Node.js backend.

## 📁 Project Structure

```
luxeholic1/
├── frontend/          # React TypeScript app
├── backend/           # Node.js Express API
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Firebase credentials
npm start
```

**Frontend runs on:** http://localhost:3000

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API credentials
npm run dev
```

**Backend runs on:** http://localhost:5000

## 🔧 Environment Variables

### Frontend (.env)
```env
REACT_APP_FIREBASE_API_KEY=your-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_BRANDSGATEWAY_API_KEY=your-key
REACT_APP_BRANDSGATEWAY_API_SECRET=your-secret
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
BRANDSGATEWAY_API_KEY=your-key
BRANDSGATEWAY_API_SECRET=your-secret
```

## 📦 Tech Stack

### Frontend
- ⚛️ React 19 + TypeScript
- 🎨 TailwindCSS
- 🧩 Radix UI Components
- 🔥 Firebase Authentication
- 📡 TanStack Query
- 🌐 Axios

### Backend
- 🟢 Node.js + Express
- 🔐 Firebase Admin SDK
- 🛡️ Helmet (Security)
- 📊 Morgan (Logging)
- ⚡ Rate Limiting
- 🌍 CORS

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api`

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `GET /products/search?q=query` - Search products

### Orders
- `POST /orders` - Create new order
- `GET /orders/:orderId` - Get order details
- `GET /orders/user/:userId` - Get user orders
- `PATCH /orders/:orderId/status` - Update order status

### Authentication
- `POST /auth/verify` - Verify Firebase token
- `GET /auth/profile/:userId` - Get user profile
- `PATCH /auth/profile/:userId` - Update user profile

## ✨ Features

### 🔐 Authentication
- Email/Password authentication
- Google OAuth sign-in
- Password reset functionality
- Protected routes

### 🛒 E-Commerce
- Browse luxury products
- Advanced filtering (brand, category, price)
- Product search
- Shopping cart
- Wishlist
- Checkout process
- Order tracking

### 🎨 User Experience
- Responsive design
- Beautiful UI with Shadcn components
- Loading states
- Error handling
- Smooth animations

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Configure:
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variables
6. Deploy

### Backend (Railway/Render)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) or [render.com](https://render.com)
3. Create new project
4. Connect repository
5. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables
7. Deploy

## 🧪 Testing

### Test Backend
```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products
```

### Test Frontend
Open http://localhost:3000 in browser

## 📝 Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Make changes
4. Test locally
5. Commit and push

## 🔗 Integration

Frontend connects to backend via `REACT_APP_API_URL` environment variable.

All API calls use Axios with base URL configuration.

## 📄 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT

## 🆘 Support

For issues or questions:
- Check documentation in frontend/backend folders
- Open an issue on GitHub
- Contact support

---

**Built with ❤️ for luxury fashion enthusiasts**

*Start your luxury shopping experience today! 🚀*
