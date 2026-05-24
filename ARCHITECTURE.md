# 🏗️ Luxeholic Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         LUXEHOLIC                                │
│                  Luxury Brands Retailer                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   Firebase   │      │ BrandsGateway│     │   Supabase   │
│              │      │     API      │     │  (Existing)  │
│ - Auth       │      │              │     │              │
│ - Firestore  │      │ - Products   │     │ - Database   │
│ - Storage    │      │ - Orders     │     │ - Auth       │
│ - Analytics  │      │ - Brands     │     │              │
└──────────────┘      └──────────────┘     └──────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User Action (Sign In)
        │
        ▼
┌─────────────────┐
│  AuthModal.tsx  │ ◄─── useFirebaseAuth hook
└─────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Firebase Auth Service   │
│ - Email/Password        │
│ - Google OAuth          │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  User Session Created   │
│  - Token stored         │
│  - User state updated   │
└─────────────────────────┘
```

### 2. Product Browsing Flow

```
User Opens Shop
        │
        ▼
┌──────────────────────┐
│ ProductsShowcase.tsx │ ◄─── useBrandsGateway hooks
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│  React Query Cache   │
│  - Check cache first │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ BrandsGateway API    │
│ GET /products        │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│  Display Products    │
│  - Images            │
│  - Prices            │
│  - Filters           │
└──────────────────────┘
```

### 3. Shopping Cart Flow

```
Add to Cart
        │
        ▼
┌──────────────────┐
│  Local State     │ (React useState)
│  - Cart items    │
└──────────────────┘
        │
        ├─── If user logged in
        │         │
        │         ▼
        │   ┌──────────────────┐
        │   │ Firebase         │
        │   │ Firestore        │
        │   │ cart_items       │
        │   └──────────────────┘
        │
        └─── If user not logged in
                  │
                  ▼
            ┌──────────────────┐
            │ Browser Storage  │
            │ (temporary)      │
            └──────────────────┘
```

### 4. Checkout & Order Flow

```
User Clicks Checkout
        │
        ▼
┌──────────────────┐
│ Check Auth       │ ◄─── Firebase Auth
└──────────────────┘
        │
        ▼
┌──────────────────────┐
│ Create Order         │
│ (BrandsGateway API)  │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Save Order Details   │
│ (Firebase Firestore) │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Clear Cart           │
│ Show Confirmation    │
└──────────────────────┘
```

## Component Architecture

```
App
│
├── LuxuryShop.tsx (Main Container)
│   │
│   ├── Header
│   │   ├── Navigation
│   │   ├── Search
│   │   ├── Cart Icon
│   │   └── AuthModal
│   │       ├── Sign In Tab
│   │       └── Sign Up Tab
│   │
│   ├── Hero Section
│   │
│   ├── New Arrivals
│   │   └── Product Cards
│   │
│   ├── ProductsShowcase
│   │   ├── Filters
│   │   │   ├── Brand Select
│   │   │   └── Category Select
│   │   │
│   │   ├── Product Grid
│   │   │   └── Product Cards
│   │   │
│   │   └── Pagination
│   │
│   ├── Cart Summary (Floating)
│   │
│   └── Footer
│
└── Routes (TanStack Router)
    ├── / (Home)
    ├── /shop
    ├── /product/:id
    ├── /cart
    ├── /checkout
    └── /account
```

## Integration Layer

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Custom Hooks                          │
│  - useFirebaseAuth()                                     │
│  - useProducts()                                         │
│  - useCreateOrder()                                      │
│  - useBrands()                                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   React Query Layer                      │
│  - Caching                                               │
│  - Refetching                                            │
│  - Optimistic updates                                    │
└─────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Firebase Services   │    │  BrandsGateway API   │
│                      │    │                      │
│  - auth.ts           │    │  - products.ts       │
│  - firestore.ts      │    │  - orders.ts         │
│  - storage.ts        │    │  - config.ts         │
└──────────────────────┘    └──────────────────────┘
```

## File Organization

```
src/
│
├── integrations/
│   ├── firebase/
│   │   ├── config.ts          # Firebase initialization
│   │   ├── auth.ts            # Auth functions
│   │   ├── firestore.ts       # Database operations
│   │   ├── storage.ts         # File storage
│   │   └── index.ts           # Exports
│   │
│   ├── brandsgateway/
│   │   ├── config.ts          # Axios instance
│   │   ├── types.ts           # TypeScript types
│   │   ├── products.ts        # Product API
│   │   ├── orders.ts          # Order API
│   │   └── index.ts           # Exports
│   │
│   └── supabase/              # Existing integration
│
├── hooks/
│   ├── useFirebaseAuth.ts     # Firebase auth hook
│   ├── useBrandsGateway.ts    # BrandsGateway hooks
│   └── use-mobile.tsx         # Utility hook
│
├── components/
│   ├── AuthModal.tsx          # Authentication UI
│   ├── ProductsShowcase.tsx   # Product catalog
│   ├── LuxuryShop.tsx         # Main shop
│   └── ui/                    # Shadcn components
│
├── routes/                    # TanStack Router pages
│   ├── index.tsx
│   ├── shop.tsx
│   ├── cart.tsx
│   └── checkout.tsx
│
└── lib/                       # Utilities
    └── utils.ts
```

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    Application State                     │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Server State │  │  Local State │  │   URL State  │
│              │  │              │  │              │
│ React Query  │  │ useState     │  │ TanStack     │
│              │  │ useReducer   │  │ Router       │
│              │  │              │  │              │
│ - Products   │  │ - Cart       │  │ - Page       │
│ - Orders     │  │ - UI state   │  │ - Filters    │
│ - User       │  │ - Forms      │  │ - Search     │
└──────────────┘  └──────────────┘  └──────────────┘
```

## API Request Flow

```
Component
    │
    ▼
Custom Hook (e.g., useProducts)
    │
    ▼
React Query (useQuery/useMutation)
    │
    ├─── Check Cache
    │    │
    │    ├─── Cache Hit → Return Data
    │    │
    │    └─── Cache Miss
    │              │
    │              ▼
    └─── Make API Request
              │
              ▼
         Axios Instance
              │
              ├─── Add Auth Headers
              ├─── Add API Keys
              └─── Set Timeout
              │
              ▼
         External API
         (Firebase/BrandsGateway)
              │
              ▼
         Response
              │
              ├─── Success → Cache & Return
              │
              └─── Error → Handle & Retry
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  - Environment variables                                 │
│  - Input validation                                      │
│  - XSS protection                                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Authentication                         │
│  - Firebase Auth tokens                                  │
│  - Session management                                    │
│  - OAuth providers                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  API Authorization                       │
│  - BrandsGateway API keys                                │
│  - Basic Auth (Base64)                                   │
│  - Request signing                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Database Security                       │
│  - Firestore security rules                              │
│  - User-based access control                             │
│  - Field-level permissions                               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Storage Security                        │
│  - Storage security rules                                │
│  - File type validation                                  │
│  - Size limits                                           │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Developer                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼ (git push)
┌─────────────────────────────────────────────────────────┐
│                    Git Repository                        │
│                    (GitHub/GitLab)                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼ (webhook)
┌─────────────────────────────────────────────────────────┐
│                  CI/CD Platform                          │
│              (Vercel/Netlify/GitHub Actions)             │
│                                                          │
│  1. Install dependencies                                 │
│  2. Run tests                                            │
│  3. Build production bundle                              │
│  4. Deploy to CDN                                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Production CDN                        │
│                                                          │
│  - Static assets                                         │
│  - Optimized bundles                                     │
│  - Global distribution                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      End Users                           │
└─────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────┐
│                   Optimization Layers                    │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Caching    │  │ Code Split   │  │   Images     │
│              │  │              │  │              │
│ React Query  │  │ Lazy loading │  │ Lazy load    │
│ Browser      │  │ Route-based  │  │ Optimize     │
│ CDN          │  │ Component    │  │ WebP format  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Monitoring & Analytics

```
Application
    │
    ├─── Firebase Analytics
    │    ├── User events
    │    ├── Page views
    │    └── Conversions
    │
    ├─── Error Tracking
    │    ├── Console errors
    │    ├── API failures
    │    └── Auth issues
    │
    └─── Performance
         ├── Load times
         ├── API latency
         └── User interactions
```

---

This architecture provides:
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Maintainability
- ✅ Developer experience
