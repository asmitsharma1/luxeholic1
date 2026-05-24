# Luxeholic Frontend

React TypeScript frontend for Luxeholic luxury e-commerce platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📦 Tech Stack

- **React 19** with TypeScript
- **TailwindCSS** for styling
- **Radix UI** components
- **TanStack Query** for data fetching
- **Firebase** for authentication
- **Axios** for API calls

## 🔧 Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Firebase and API credentials to `.env`

## 📁 Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── assets/      # Images and static assets
│   ├── components/  # React components
│   │   ├── ui/      # Reusable UI components
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   └── LuxuryShop.tsx
│   ├── lib/         # Utility functions
│   ├── App.tsx      # Main app component
│   ├── index.tsx    # Entry point
│   └── styles.css   # Global styles
└── package.json
```

## 🌐 Available Scripts

- `npm start` - Run development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔗 Backend Integration

The frontend connects to the backend API at `REACT_APP_API_URL`.

Default: `http://localhost:5000/api`

## 📝 Environment Variables

All environment variables must start with `REACT_APP_` prefix.

See `.env.example` for required variables.

## 🚢 Deployment

### Vercel
```bash
vercel --prod
```

### Build Output
```bash
npm run build
# Output: build/ directory
```

## 📄 License

MIT
