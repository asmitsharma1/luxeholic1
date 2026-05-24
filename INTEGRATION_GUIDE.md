# Luxeholic - Integration Guide

This guide explains how to use Firebase and BrandsGateway API integrations in your Luxeholic luxury brands retailer website.

## Table of Contents

1. [Firebase Setup](#firebase-setup)
2. [BrandsGateway Setup](#brandsgateway-setup)
3. [Usage Examples](#usage-examples)

---

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable the following services:
   - **Authentication** (Email/Password and Google Sign-In)
   - **Firestore Database**
   - **Storage**
   - **Analytics** (optional)

### 2. Get Firebase Configuration

1. In Firebase Console, go to Project Settings
2. Scroll down to "Your apps" section
3. Click on the Web icon (</>) to add a web app
4. Copy the configuration values
5. Update your `.env` file with these values:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

### 3. Configure Authentication

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable **Email/Password** provider
3. Enable **Google** provider and configure OAuth consent screen

### 4. Set up Firestore Database

1. Go to Firestore Database in Firebase Console
2. Click "Create database"
3. Choose production mode or test mode
4. Select a location for your database

### 5. Set up Storage

1. Go to Storage in Firebase Console
2. Click "Get started"
3. Set up security rules as needed

---

## BrandsGateway Setup

### 1. Create BrandsGateway Account

1. Visit [BrandsGateway](https://www.brandsgateway.com/)
2. Sign up for a business account
3. Complete the verification process

### 2. Get API Credentials

1. Log in to your BrandsGateway dashboard
2. Navigate to API Settings or Developer section
3. Generate API Key and API Secret
4. Update your `.env` file:

```env
VITE_BRANDSGATEWAY_API_KEY="your-api-key"
VITE_BRANDSGATEWAY_API_SECRET="your-api-secret"
```

### 3. API Documentation

BrandsGateway API provides access to:

- **Products**: Browse luxury brand products
- **Brands**: Get list of available brands
- **Categories**: Product categories and subcategories
- **Orders**: Create and manage orders
- **Inventory**: Real-time stock availability

---

## Usage Examples

### Firebase Authentication

```typescript
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

function LoginComponent() {
  const { user, loading, signIn, signInGoogle, signOut } = useFirebaseAuth();

  const handleEmailLogin = async () => {
    const result = await signIn('user@example.com', 'password123');
    if (result.error) {
      console.error('Login failed:', result.error);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInGoogle();
    if (result.error) {
      console.error('Google login failed:', result.error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName || user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={handleEmailLogin}>Sign In with Email</button>
          <button onClick={handleGoogleLogin}>Sign In with Google</button>
        </div>
      )}
    </div>
  );
}
```

### Firestore Database Operations

```typescript
import { createDocument, getDocuments, updateDocument } from "@/integrations/firebase";

// Create a user profile
const createUserProfile = async (userId: string, data: any) => {
  const result = await createDocument("users", {
    userId,
    ...data,
  });

  if (result.error) {
    console.error("Error creating profile:", result.error);
  }
};

// Get all orders for a user
const getUserOrders = async (userId: string) => {
  const result = await getDocuments("orders", [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  ]);

  return result.data;
};
```

### BrandsGateway Products

```typescript
import { useProducts, useNewArrivals, useProductsByBrand } from '@/hooks/useBrandsGateway';

function ProductsPage() {
  // Get all products with filters
  const { data: productsData, isLoading } = useProducts({
    category: 'bags',
    gender: 'women',
    min_price: 100,
    max_price: 5000,
    page: 1,
    limit: 20,
  });

  // Get new arrivals
  const { data: newArrivals } = useNewArrivals(12);

  // Get products by brand
  const { data: gucciProducts } = useProductsByBrand('Gucci', {
    limit: 10,
  });

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div>
      <h1>Products</h1>
      {productsData?.products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.brand}</p>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### BrandsGateway Orders

```typescript
import { useCreateOrder, useOrders } from '@/hooks/useBrandsGateway';

function CheckoutPage() {
  const createOrderMutation = useCreateOrder();
  const { data: ordersData } = useOrders();

  const handleCheckout = async () => {
    const orderData = {
      items: [
        {
          product_id: 'prod_123',
          sku: 'SKU123',
          size: 'M',
          quantity: 1,
          price: 299.99,
        },
      ],
      shipping_address: {
        name: 'John Doe',
        address_line1: '123 Main St',
        city: 'New York',
        postal_code: '10001',
        country: 'US',
        phone: '+1234567890',
      },
    };

    try {
      const order = await createOrderMutation.mutateAsync(orderData);
      console.log('Order created:', order);
    } catch (error) {
      console.error('Order failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>Place Order</button>

      <h2>Your Orders</h2>
      {ordersData?.orders.map(order => (
        <div key={order.id}>
          <p>Order #{order.order_number}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
}
```

### Search Products

```typescript
import { useSearchProducts } from '@/hooks/useBrandsGateway';
import { useState } from 'react';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading } = useSearchProducts(searchQuery, {
    limit: 10,
  });

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search luxury products..."
      />

      {isLoading && <p>Searching...</p>}

      {searchResults?.products.map(product => (
        <div key={product.id}>
          <h4>{product.name}</h4>
          <p>{product.brand} - ${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Firebase Storage (Upload Product Images)

```typescript
import { uploadFile, getFileURL } from '@/integrations/firebase';
import { useState } from 'react';

function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    setUploading(true);

    const path = `products/${Date.now()}_${file.name}`;
    const result = await uploadFile(path, file, undefined, (progress) => {
      setProgress(progress);
    });

    if (result.error) {
      console.error('Upload failed:', result.error);
    } else {
      console.log('File uploaded:', result.url);
    }

    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      {uploading && <p>Uploading: {progress.toFixed(0)}%</p>}
    </div>
  );
}
```

---

## Project Structure

```
src/
├── integrations/
│   ├── firebase/
│   │   ├── config.ts          # Firebase initialization
│   │   ├── auth.ts            # Authentication functions
│   │   ├── firestore.ts       # Database operations
│   │   ├── storage.ts         # File storage operations
│   │   └── index.ts           # Exports
│   ├── brandsgateway/
│   │   ├── config.ts          # API client setup
│   │   ├── types.ts           # TypeScript types
│   │   ├── products.ts        # Product API calls
│   │   ├── orders.ts          # Order API calls
│   │   └── index.ts           # Exports
│   └── supabase/              # Existing Supabase integration
├── hooks/
│   ├── useFirebaseAuth.ts     # Firebase auth hook
│   └── useBrandsGateway.ts    # BrandsGateway hooks
```

---

## Important Notes

1. **Environment Variables**: Never commit your `.env` file to version control
2. **API Limits**: BrandsGateway may have rate limits - implement caching
3. **Security**: Use Firebase Security Rules to protect your data
4. **Error Handling**: Always handle errors from API calls
5. **Testing**: Test with BrandsGateway sandbox/test environment first

---

## Support

- **Firebase**: [Firebase Documentation](https://firebase.google.com/docs)
- **BrandsGateway**: Contact their support team for API issues
- **Project Issues**: Create an issue in your repository

---

## Next Steps

1. Configure Firebase project and update `.env`
2. Get BrandsGateway API credentials
3. Test authentication flow
4. Implement product catalog
5. Set up order management
6. Add payment integration (Stripe, PayPal, etc.)
7. Deploy to production

Happy coding! 🚀
