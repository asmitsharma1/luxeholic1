# Luxeholic - Project Structure

Full-stack luxury e-commerce platform with separate frontend and backend.

## 📁 Project Structure

```
luxeholic1/
├── frontend/              # React TypeScript frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── assets/       # Images, fonts
│   │   ├── components/   # React components
│   │   │   ├── ui/       # Reusable UI components
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   └── LuxuryShop.tsx
│   │   ├── lib/          # Utilities
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── README.md
│
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   └── auth.js
│   │   └── server.js     # Main server
│   ├── package.json
│   └── README.md
│
└── PROJECT_STRUCTURE.md  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

#### 1. Install Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Add your Firebase credentials to .env
npm start
```
Frontend runs on: http://localhost:3000

#### 2. Install Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your API credentials to .env
npm run dev
```
Backend runs on: http://localhost:5000

## 🔧 Configuration

### Frontend (.env)
```env
REACT_APP_FIREBASE_API_KEY=your-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-id
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-id
BRANDSGATEWAY_API_KEY=your-key
```

## 📦 Tech Stack

### Frontend
- React 19 + TypeScript
- TailwindCSS
- Radix UI Components
- TanStack Query
- Firebase Auth
- Axios

### Backend
- Node.js + Express
- Firebase Admin SDK
- Helmet (Security)
- Morgan (Logging)
- Rate Limiting

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api`

### Products
- `GET /products` - List products
- `GET /products/:id` - Get product
- `GET /products/search?q=query` - Search

### Orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order
- `GET /orders/user/:userId` - User orders

### Auth
- `POST /auth/verify` - Verify token
- `GET /auth/profile/:userId` - Get profile

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway/Render)
```bash
cd backend
# Push to GitHub
# Connect to Railway/Render
```

## 📝 Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm start`
3. **Make changes** in respective folders
4. **Test** endpoints and UI
5. **Commit** changes

## 🔗 Integration

Frontend connects to backend via `REACT_APP_API_URL`.

All API calls go through Axios with base URL configuration.

## 📄 License

MIT
