# Luxeholic Setup Guide

## Quick Start

Follow these steps to get your Luxeholic luxury retailer website up and running with Firebase and BrandsGateway integration.

## Prerequisites

- Node.js 18+ installed
- npm or bun package manager
- Firebase account
- BrandsGateway business account

## Step 1: Install Dependencies

```bash
npm install
# or
bun install
```

## Step 2: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable these services:
   - **Authentication** → Enable Email/Password and Google providers
   - **Firestore Database** → Create database in production mode
   - **Storage** → Initialize storage
   - **Analytics** → (Optional)

4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the configuration values

5. Update `.env` file with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY="your-actual-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## Step 3: Configure BrandsGateway

1. Sign up at [BrandsGateway](https://www.brandsgateway.com/)
2. Complete business verification
3. Navigate to API settings in your dashboard
4. Generate API credentials

5. Update `.env` file with BrandsGateway credentials:

```env
VITE_BRANDSGATEWAY_API_KEY="your-api-key"
VITE_BRANDSGATEWAY_API_SECRET="your-api-secret"
```

## Step 4: Firebase Security Rules

### Firestore Rules

Go to Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Cart items
    match /cart_items/{itemId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Wishlist
    match /wishlist/{itemId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Rules

Go to Storage → Rules and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 5: Run Development Server

```bash
npm run dev
# or
bun run dev
```

Visit `http://localhost:3000` to see your app!

## Step 6: Test the Integration

### Test Firebase Authentication

1. Click "Sign In" button
2. Try creating an account with email/password
3. Try signing in with Google
4. Check Firebase Console → Authentication to see registered users

### Test BrandsGateway Products

1. Navigate to the products section
2. Products should load from BrandsGateway API
3. Try filtering by brand or category
4. Check browser console for any API errors

### Test Cart & Orders

1. Add products to cart
2. Click checkout (requires authentication)
3. Order should be created in BrandsGateway
4. Order details saved to Firebase Firestore

## Project Structure

```
src/
├── components/
│   ├── AuthModal.tsx           # Firebase authentication UI
│   ├── ProductsShowcase.tsx    # BrandsGateway products display
│   ├── LuxuryShop.tsx          # Main shop component
│   └── ui/                     # Shadcn UI components
├── hooks/
│   ├── useFirebaseAuth.ts      # Firebase auth hook
│   └── useBrandsGateway.ts     # BrandsGateway API hooks
├── integrations/
│   ├── firebase/               # Firebase integration
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   └── storage.ts
│   └── brandsgateway/          # BrandsGateway integration
│       ├── config.ts
│       ├── types.ts
│       ├── products.ts
│       └── orders.ts
```

## Common Issues

### Firebase Initialization Error

**Error**: "Missing Firebase environment variables"

**Solution**: Make sure all `VITE_FIREBASE_*` variables are set in `.env` file

### BrandsGateway 401 Unauthorized

**Error**: "Authentication failed"

**Solution**:

- Verify API key and secret are correct
- Check if your BrandsGateway account is active
- Ensure credentials are properly encoded

### CORS Errors

**Error**: "CORS policy blocked"

**Solution**:

- BrandsGateway API should allow your domain
- Contact BrandsGateway support to whitelist your domain
- For development, you might need to use a proxy

## Environment Variables Checklist

Make sure your `.env` file has all these variables:

- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_FIREBASE_MEASUREMENT_ID`
- [ ] `VITE_BRANDSGATEWAY_API_KEY`
- [ ] `VITE_BRANDSGATEWAY_API_SECRET`

## Next Steps

1. ✅ Set up Firebase and BrandsGateway
2. ✅ Test authentication flow
3. ✅ Test product catalog
4. 📝 Customize product display
5. 📝 Add payment integration (Stripe/PayPal)
6. 📝 Implement user profile page
7. 📝 Add order history
8. 📝 Deploy to production

## Deployment

### Build for Production

```bash
npm run build
# or
bun run build
```

### Deploy to Vercel/Netlify

1. Connect your Git repository
2. Add environment variables in deployment settings
3. Deploy!

### Important: Production Checklist

- [ ] Update Firebase security rules for production
- [ ] Enable Firebase App Check
- [ ] Set up proper error logging
- [ ] Configure rate limiting
- [ ] Add monitoring and analytics
- [ ] Test payment flow thoroughly
- [ ] Set up backup strategy

## Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **BrandsGateway Support**: Contact their support team
- **React Query Docs**: https://tanstack.com/query/latest
- **Shadcn UI**: https://ui.shadcn.com/

## License

This project is for educational and commercial use.

---

**Happy Selling! 🛍️✨**
