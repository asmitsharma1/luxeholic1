# 🚀 Luxeholic - Quick Reference Card

## 📦 What's Installed

```bash
✅ Firebase SDK - Authentication, Firestore, Storage
✅ Axios - HTTP client for BrandsGateway API
✅ React Query - Data fetching & caching
✅ Shadcn UI - Beautiful components
```

## 🔑 Environment Variables

```env
# Copy these to your .env file and fill in your values

# Firebase
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
VITE_FIREBASE_MEASUREMENT_ID=""

# BrandsGateway
VITE_BRANDSGATEWAY_API_KEY=""
VITE_BRANDSGATEWAY_API_SECRET=""
```

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build
```

## 📁 File Structure

```
src/
├── integrations/
│   ├── firebase/          # Firebase integration
│   └── brandsgateway/     # BrandsGateway API
├── hooks/
│   ├── useFirebaseAuth.ts
│   └── useBrandsGateway.ts
├── components/
│   ├── AuthModal.tsx
│   ├── ProductsShowcase.tsx
│   └── LuxuryShop.tsx
```

## 🔥 Firebase Quick Examples

### Authentication
```typescript
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const { user, signIn, signUp, signOut } = useFirebaseAuth();

// Sign in
await signIn('email@example.com', 'password');

// Sign up
await signUp('email@example.com', 'password', 'Name');

// Google sign in
await signInGoogle();
```

### Firestore
```typescript
import { createDocument, getDocuments } from '@/integrations/firebase';

// Create
await createDocument('orders', { userId: '123', total: 99.99 });

// Read
const { data } = await getDocuments('orders');
```

### Storage
```typescript
import { uploadFile } from '@/integrations/firebase';

await uploadFile('path/to/file.jpg', file, undefined, (progress) => {
  console.log(`Upload: ${progress}%`);
});
```

## 🛍️ BrandsGateway Quick Examples

### Products
```typescript
import { useProducts, useNewArrivals } from '@/hooks/useBrandsGateway';

// Get products
const { data } = useProducts({ category: 'bags', limit: 20 });

// New arrivals
const { data } = useNewArrivals(12);

// Search
const { data } = useSearchProducts('gucci bag');
```

### Orders
```typescript
import { useCreateOrder } from '@/hooks/useBrandsGateway';

const createOrder = useCreateOrder();

await createOrder.mutateAsync({
  items: [{ product_id: '123', sku: 'SKU', size: 'M', quantity: 1, price: 299 }],
  shipping_address: { /* ... */ }
});
```

## 🎨 UI Components

### Auth Modal
```typescript
import { AuthModal } from '@/components/AuthModal';

<AuthModal />
```

### Products Showcase
```typescript
import { ProductsShowcase } from '@/components/ProductsShowcase';

<ProductsShowcase />
```

### Complete Shop
```typescript
import { LuxuryShop } from '@/components/LuxuryShop';

<LuxuryShop />
```

## 🔐 Security Checklist

- [ ] Add Firebase credentials to `.env`
- [ ] Add BrandsGateway credentials to `.env`
- [ ] Set up Firestore security rules
- [ ] Set up Storage security rules
- [ ] Enable Firebase Authentication providers
- [ ] Never commit `.env` file
- [ ] Use HTTPS in production

## 📚 Documentation Files

- `SETUP.md` - Complete setup guide
- `INTEGRATION_GUIDE.md` - Usage examples
- `INTEGRATION_SUMMARY.md` - What's included
- `QUICK_REFERENCE.md` - This file!

## 🆘 Common Issues

### Firebase not initialized
**Fix**: Check `.env` has all `VITE_FIREBASE_*` variables

### BrandsGateway 401 error
**Fix**: Verify API key and secret are correct

### CORS errors
**Fix**: Contact BrandsGateway to whitelist your domain

### Module not found
**Fix**: Run `npm install` again

## 🎯 Next Steps

1. ✅ Integration complete
2. 📝 Add Firebase credentials
3. 📝 Add BrandsGateway credentials
4. 📝 Test authentication
5. 📝 Test product catalog
6. 📝 Customize design
7. 📝 Add payment gateway
8. 📝 Deploy to production

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [BrandsGateway](https://www.brandsgateway.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Shadcn UI](https://ui.shadcn.com/)

## 💡 Pro Tips

1. Use React Query DevTools for debugging
2. Check Firebase Console for auth/database issues
3. Use browser DevTools Network tab for API issues
4. Test with small product limits first
5. Implement error boundaries
6. Add loading states everywhere
7. Cache API responses with React Query
8. Use TypeScript for type safety

## 📞 Support

Need help? Check:
1. Browser console for errors
2. Firebase Console logs
3. Network tab for API calls
4. Documentation files in this project

---

**Happy Coding! 🎉**
