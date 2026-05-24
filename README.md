# 🛍️ Luxeholic - Luxury Brands Retailer

> A premium e-commerce platform for luxury fashion brands, powered by Firebase and BrandsGateway API

![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.83.0-red)

## ✨ Features

### 🔐 Authentication
- Email/Password authentication
- Google OAuth sign-in
- Password reset functionality
- Persistent user sessions
- Protected routes

### 🛒 E-Commerce
- Browse luxury products from top brands
- Advanced filtering (brand, category, price, size)
- Product search functionality
- Shopping cart with persistence
- Wishlist management
- Secure checkout process
- Order tracking

### 🎨 User Experience
- Responsive design (mobile, tablet, desktop)
- Beautiful UI with Shadcn components
- Loading states and skeletons
- Error handling and notifications
- Smooth animations and transitions

### 🔌 Integrations
- **Firebase**: Authentication, Firestore Database, Cloud Storage
- **BrandsGateway API**: Access to 100+ luxury brands
- **React Query**: Efficient data fetching and caching
- **Tailwind CSS**: Modern styling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or bun
- Firebase account
- BrandsGateway business account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd luxe-global-style-main

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your credentials to .env
# See SETUP.md for detailed instructions

# Run development server
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📚 Documentation

| File | Description |
|------|-------------|
| [SETUP.md](./SETUP.md) | Complete setup instructions |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Detailed usage examples |
| [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) | What's included |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Quick reference card |

## 🏗️ Project Structure

```
luxe-global-style-main/
├── src/
│   ├── components/          # React components
│   │   ├── AuthModal.tsx    # Authentication UI
│   │   ├── ProductsShowcase.tsx
│   │   ├── LuxuryShop.tsx   # Main shop component
│   │   └── ui/              # Shadcn UI components
│   ├── hooks/               # Custom React hooks
│   │   ├── useFirebaseAuth.ts
│   │   └── useBrandsGateway.ts
│   ├── integrations/        # Third-party integrations
│   │   ├── firebase/        # Firebase setup
│   │   ├── brandsgateway/   # BrandsGateway API
│   │   └── supabase/        # Supabase (existing)
│   ├── routes/              # TanStack Router pages
│   └── lib/                 # Utility functions
├── public/                  # Static assets
├── .env                     # Environment variables
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# BrandsGateway
VITE_BRANDSGATEWAY_API_KEY=your-api-key
VITE_BRANDSGATEWAY_API_SECRET=your-api-secret
```

See [SETUP.md](./SETUP.md) for detailed configuration instructions.

## 💻 Usage Examples

### Authentication

```typescript
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

function MyComponent() {
  const { user, signIn, signUp, signOut } = useFirebaseAuth();
  
  const handleLogin = async () => {
    await signIn('user@example.com', 'password');
  };
  
  return <button onClick={handleLogin}>Sign In</button>;
}
```

### Products

```typescript
import { useProducts } from '@/hooks/useBrandsGateway';

function ProductList() {
  const { data, isLoading } = useProducts({
    category: 'bags',
    brand: 'Gucci',
    limit: 20
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Orders

```typescript
import { useCreateOrder } from '@/hooks/useBrandsGateway';

function Checkout() {
  const createOrder = useCreateOrder();
  
  const handleCheckout = async () => {
    const order = await createOrder.mutateAsync({
      items: [...],
      shipping_address: {...}
    });
  };
}
```

## 🎨 Components

### Pre-built Components

- `<AuthModal />` - Complete authentication UI
- `<ProductsShowcase />` - Product catalog with filters
- `<LuxuryShop />` - Full e-commerce page

### UI Components (Shadcn)

40+ components including:
- Button, Card, Badge, Dialog
- Select, Input, Tabs, Alert
- Skeleton, Separator, and more

## 🧪 Testing

```bash
# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## 📦 Tech Stack

- **Frontend**: React 19, TypeScript
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS, Shadcn UI
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **API**: BrandsGateway REST API
- **Build Tool**: Vite

## 🌟 Key Features

### Firebase Integration
- ✅ Email/Password & Google OAuth
- ✅ Firestore database operations
- ✅ Cloud Storage for images
- ✅ Real-time data sync
- ✅ Secure authentication

### BrandsGateway Integration
- ✅ 100+ luxury brands catalog
- ✅ Real-time inventory
- ✅ Product search & filters
- ✅ Order management
- ✅ Shipping calculation
- ✅ Order tracking

### Developer Experience
- ✅ TypeScript for type safety
- ✅ React Query for data fetching
- ✅ Custom hooks for reusability
- ✅ Comprehensive error handling
- ✅ Loading states everywhere
- ✅ Responsive design

## 🚢 Deployment

### Build

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy to Netlify

```bash
netlify deploy --prod
```

**Important**: Add environment variables in your deployment platform!

## 🔐 Security

- Environment variables for sensitive data
- Firebase security rules (see SETUP.md)
- HTTPS only in production
- API key authentication
- Secure token handling
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linter and tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check [SETUP.md](./SETUP.md) for setup issues
- See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for usage help
- Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for quick tips
- Open an issue for bugs or questions

## 🎯 Roadmap

- [x] Firebase authentication
- [x] BrandsGateway integration
- [x] Product catalog
- [x] Shopping cart
- [x] Order management
- [ ] Payment integration (Stripe/PayPal)
- [ ] User profile page
- [ ] Order history
- [ ] Product reviews
- [ ] Admin dashboard

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) - Backend services
- [BrandsGateway](https://www.brandsgateway.com/) - Luxury products API
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful components
- [TanStack](https://tanstack.com/) - Router & Query
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Built with ❤️ for luxury fashion enthusiasts**

*Start selling luxury brands today! 🚀*
# luxeholic1
# luxeholic1
