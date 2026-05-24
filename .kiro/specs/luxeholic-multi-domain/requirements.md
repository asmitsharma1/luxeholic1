# Requirements Document

## Introduction

Luxeholic is a luxury e-commerce platform built with React (TanStack Router + TanStack Start) that operates across three regional domains: `luxeholic.com.au` (Australia), `luxeholic.co.nz` (New Zealand), and `luxeholic.in` (India). All three domains serve the same compiled SPA codebase deployed via Hostinger with static Vite builds pushed from GitHub.

This feature refactors the app to:
1. Unify all authentication under Firebase Auth (removing the current split between Supabase auth in `routes/auth.tsx` and Firebase auth in `AuthModal.tsx`)
2. Migrate cart and wishlist persistence from Supabase to Firestore (removing `@supabase/supabase-js` dependency)
3. Implement domain-aware country detection so each domain defaults to its regional country/currency on first load
4. Upgrade the existing country toggle in `SiteHeader` to redirect users to the appropriate domain when switching regions
5. Ensure all pricing is displayed in the domain-appropriate currency (AUD, NZD, INR)
6. Configure the Vite build for SPA fallback so TanStack Router client-side routing works correctly on Hostinger

A single shared Firebase project is used across all three domains. Firebase Auth is already partially integrated via `useFirebaseAuth` and `src/integrations/firebase/`. Firestore generic CRUD helpers already exist in `src/integrations/firebase/firestore.ts`.

---

## Glossary

- **App**: The Luxeholic React SPA built with TanStack Router + TanStack Start
- **Auth_Service**: The Firebase Authentication service used for all user identity operations
- **Cart_Service**: The Firestore-backed cart persistence layer replacing the current Supabase `cart_items` table
- **Wishlist_Service**: The Firestore-backed wishlist persistence layer
- **Country_Context**: The React context defined in `src/lib/country.ts` that holds the active `Country` value and `setCountry` setter
- **Domain_Detector**: The module responsible for reading `window.location.hostname` on app initialisation and mapping it to a `Country` code
- **Domain_Toggle**: The country/region selector UI in `SiteHeader` that redirects the browser to the corresponding regional domain
- **Country**: One of the three supported region codes: `AU`, `NZ`, or `IN`
- **Domain_Map**: The static mapping of `Country` codes to canonical domain hostnames (`AU` → `luxeholic.com.au`, `NZ` → `luxeholic.co.nz`, `IN` → `luxeholic.in`)
- **Firebase_Project**: The single shared Google Firebase project whose credentials are stored in `VITE_FIREBASE_*` environment variables
- **Firestore**: The Firebase Cloud Firestore NoSQL database used for cart, wishlist, and order data
- **CartLine**: A single line item in the cart, containing `product_id`, `size`, `color`, `quantity`, and a resolved `product` snapshot
- **WishlistItem**: A saved product reference in a user's wishlist, containing `product_id` and a resolved `product` snapshot
- **Guest_Cart**: Cart state persisted to `localStorage` under the key `luxeholic:cart` for unauthenticated users
- **Merged_Cart**: The result of combining a Guest_Cart with a user's Firestore cart upon sign-in
- **SPA_Fallback**: The Vite/Hostinger configuration that serves `index.html` for all non-asset URL paths, enabling client-side routing
- **BrandsGateway**: The third-party product data integration in `src/integrations/brandsgateway/`

---

## Requirements

### Requirement 1: Unified Firebase Authentication

**User Story:** As a Luxeholic customer, I want a single consistent sign-in experience across all three regional domains, so that my account works seamlessly regardless of which domain I visit.

#### Acceptance Criteria

1. THE Auth_Service SHALL support email/password sign-up, email/password sign-in, Google OAuth sign-in, password reset via email, and sign-out.
2. WHEN a user submits valid email and password credentials on the sign-in form, THE Auth_Service SHALL authenticate the user and return a Firebase `User` object within 5 seconds.
3. WHEN a user submits valid email, password, and optional display name on the sign-up form, THE Auth_Service SHALL create a new Firebase account, set the `displayName` profile field, and return a Firebase `User` object.
4. WHEN a user clicks "Continue with Google", THE Auth_Service SHALL initiate a Google OAuth popup flow and, upon success, return a Firebase `User` object.
5. WHEN a user requests a password reset with a registered email address, THE Auth_Service SHALL send a password reset email via Firebase and display a confirmation message to the user.
6. IF the Auth_Service returns an error during any authentication operation, THEN THE App SHALL display the Firebase error message to the user without navigating away from the current page.
7. WHEN a user signs out, THE Auth_Service SHALL call `signOut` on the Firebase Auth instance and THE App SHALL redirect the user to the home page.
8. THE App SHALL remove all imports of `@supabase/supabase-js` from authentication-related files (`routes/auth.tsx`, `routes/account.tsx`, `lib/cart.ts`).
9. THE App SHALL remove all references to `lovable.auth` and `integrations/lovable` from authentication flows.
10. WHEN the Firebase Auth state changes, THE App SHALL update the authenticated user state within 500ms across all components that consume the auth context, regardless of whether Firebase has finished propagating the change internally.
11. THE `routes/auth.tsx` page SHALL use `useFirebaseAuth` exclusively for all sign-in, sign-up, and Google OAuth operations.
12. THE `routes/account.tsx` page SHALL use `useFirebaseAuth` exclusively to determine the authenticated user and to perform sign-out.

---

### Requirement 2: Firestore Cart Persistence

**User Story:** As a Luxeholic customer, I want my shopping bag to be saved to my account so that items persist across sessions and devices.

#### Acceptance Criteria

1. THE Cart_Service SHALL store cart items in Firestore under the path `carts/{userId}/items/{itemId}` for authenticated users.
2. WHEN an authenticated user adds a product to the cart, THE Cart_Service SHALL write a document to `carts/{userId}/items/` containing `product_id`, `size`, `color`, `quantity`, and `updatedAt` fields.
3. WHEN an authenticated user adds a product that already exists in the cart with the same `product_id`, `size`, and `color`, THE Cart_Service SHALL increment the existing item's `quantity` rather than creating a duplicate document.
3a. WHEN an unauthenticated user adds a product that already exists in the Guest_Cart with the same `product_id`, `size`, and `color`, THE Cart_Service SHALL increment the existing item's `quantity` in `localStorage` rather than creating a duplicate entry.
4. WHEN an authenticated user removes a cart item, THE Cart_Service SHALL delete the corresponding Firestore document.
5. WHEN an authenticated user updates a cart item quantity to a value greater than zero, THE Cart_Service SHALL update the `quantity` field of the corresponding Firestore document.
6. WHEN an authenticated user updates a cart item quantity to zero, THE Cart_Service SHALL delete the corresponding Firestore document.
7. WHEN an authenticated user clears the cart, THE Cart_Service SHALL delete all documents under `carts/{userId}/items/`.
8. WHILE a user is unauthenticated, THE Cart_Service SHALL persist cart items to `localStorage` under the key `luxeholic:cart` using the existing Guest_Cart format.
9. WHEN a user signs in and a Guest_Cart exists in `localStorage`, THE Cart_Service SHALL merge the Guest_Cart items into the user's Firestore cart by adding quantities for matching items and inserting new items, then clear the Guest_Cart from `localStorage`.
10. IF a Firestore write operation fails, THEN THE Cart_Service SHALL display an error notification to the user and leave the local cart state unchanged.
11. THE Cart_Service SHALL expose the same interface as the current `useCart` hook: `{ lines, loading, refresh, add, remove, updateQty, clear, user }`.
12. THE Cart_Service SHALL remove all imports of `@supabase/supabase-js` and all calls to `supabase.from("cart_items")`.

---

### Requirement 3: Firestore Wishlist Persistence

**User Story:** As a Luxeholic customer, I want to save products to a wishlist so that I can return to them later.

#### Acceptance Criteria

1. THE Wishlist_Service SHALL store wishlist items in Firestore under the path `wishlists/{userId}/items/{productId}` for authenticated users.
2. WHEN an authenticated user adds a product to the wishlist, THE Wishlist_Service SHALL write a document containing `product_id` and `addedAt` fields.
3. WHEN an authenticated user removes a product from the wishlist, THE Wishlist_Service SHALL delete the corresponding Firestore document.
4. WHEN an authenticated user toggles a product that is already in the wishlist, THE Wishlist_Service SHALL remove it.
5. WHILE a user is unauthenticated, THE Wishlist_Service SHALL persist wishlist items to `localStorage` under the key `luxeholic:wishlist`.
6. WHEN a user signs in and a local wishlist exists in `localStorage`, THE Wishlist_Service SHALL merge the local wishlist items into the user's Firestore wishlist, then clear the local wishlist from `localStorage`.
7. IF a Firestore write operation fails, THEN THE Wishlist_Service SHALL display an error notification to the user and leave the local wishlist state unchanged.
8. THE Wishlist_Service SHALL expose a `useWishlist` hook returning `{ items, loading, add, remove, toggle, isWishlisted }`.

---

### Requirement 4: Firestore Order History

**User Story:** As a Luxeholic customer, I want to view my past orders in my account page so that I can track my purchase history.

#### Acceptance Criteria

1. THE App SHALL store order records in Firestore under the path `orders/{orderId}` with fields: `userId`, `country`, `total`, `status`, `createdAt`, and an `items` array.
2. WHEN an authenticated user visits the `/account` route, THE App SHALL query Firestore for all orders where `userId` equals the authenticated user's UID, ordered by `createdAt` descending.
3. THE `routes/account.tsx` page SHALL remove all calls to `supabase.from("orders")` and replace them with Firestore queries.
4. IF no orders exist for the authenticated user, THEN THE App SHALL display a message indicating no orders have been placed yet.
5. WHEN orders exist for the authenticated user, THE App SHALL hide the empty-orders message and display the order list instead.

---

### Requirement 5: Domain-Aware Country Detection

**User Story:** As a Luxeholic customer visiting a regional domain, I want the site to automatically show prices and content in my local currency, so that I don't have to manually select my region.

#### Acceptance Criteria

1. THE Domain_Detector SHALL map hostnames to Country codes using the Domain_Map: `luxeholic.com.au` → `AU`, `luxeholic.co.nz` → `NZ`, `luxeholic.in` → `IN`.
2. WHEN the App initialises in a browser environment, THE Domain_Detector SHALL read `window.location.hostname` and resolve the corresponding Country code from the Domain_Map.
3. WHEN a Country code is resolved from the Domain_Map, THE App SHALL use that Country code as the initial value for the Country_Context, overriding any value previously stored in `localStorage`.
4. WHEN `window.location.hostname` does not match any entry in the Domain_Map (e.g., `localhost`, staging domains), THE Domain_Detector SHALL fall back to the value stored in `localStorage` under `luxeholic:country`, and if no stored value exists, SHALL default to `AU`.
5. THE Domain_Detector SHALL be invoked before the first render of the Country_Context provider in `__root.tsx`.
6. WHEN the active Country is `AU`, THE App SHALL display all prices in AUD using the `en-AU` locale format.
7. WHEN the active Country is `NZ`, THE App SHALL display all prices in NZD using the `en-NZ` locale format, and THE App SHALL enforce that the currency code and locale always match the Country_Context value, preventing NZD prices from appearing when the active Country is `AU` or `IN`.
8. WHEN the active Country is `IN`, THE App SHALL display all prices in INR using the `en-IN` locale format.

---

### Requirement 6: Domain Toggle with Cross-Domain Redirect

**User Story:** As a Luxeholic customer, I want to switch between regional domains from the site header, so that I can browse and purchase in my preferred currency and region.

#### Acceptance Criteria

1. THE Domain_Toggle SHALL display the three available regions (Australia, New Zealand, India) in the `SiteHeader` country dropdown.
2. WHEN a user selects a region in the Domain_Toggle that corresponds to a different domain than the current hostname, THE Domain_Toggle SHALL redirect the browser to the canonical domain for that region using `window.location.href` assignment.
3. WHEN a user selects a region in the Domain_Toggle that corresponds to the current hostname, THE Domain_Toggle SHALL update the Country_Context without performing a redirect.
4. WHEN the Domain_Toggle performs a cross-domain redirect, THE App SHALL append a `?country={code}` query parameter to the destination URL so the target domain can confirm the intended country on arrival.
5. THE Domain_Toggle SHALL visually indicate the currently active region with a checkmark or equivalent indicator.
6. WHEN running on `localhost` or a non-production hostname, THE Domain_Toggle SHALL update the Country_Context in-place without performing any cross-domain redirect, preserving the existing development behaviour.
7. THE Domain_Toggle SHALL be accessible via keyboard navigation and SHALL include appropriate `aria-label` attributes on interactive elements.

---

### Requirement 7: Domain-Appropriate Pricing Display

**User Story:** As a Luxeholic customer, I want all product prices to be shown in the currency of the domain I am visiting, so that I can make informed purchasing decisions without manual conversion.

#### Acceptance Criteria

1. THE App SHALL use the `priceFor(country, price_country, price_usd)` function from `src/lib/country.ts` to resolve the display price for every product, cart line, and order summary.
2. THE App SHALL use the `formatPrice(country, amount)` function from `src/lib/country.ts` to format all monetary values displayed to the user.
3. WHEN the active Country is `AU`, THE App SHALL format prices using `Intl.NumberFormat` with `currency: "AUD"` and `locale: "en-AU"`, converting from the source currency if necessary.
4. WHEN the active Country is `NZ`, THE App SHALL format prices using `Intl.NumberFormat` with `currency: "NZD"` and `locale: "en-NZ"`, converting from the source currency if necessary.
5. WHEN the active Country is `IN`, THE App SHALL format prices using `Intl.NumberFormat` with `currency: "INR"` and `locale: "en-IN"`, converting from the source currency if necessary.
6. WHEN a product does not have a `price_country` entry for the active Country, THE App SHALL apply the fallback multiplier defined in `priceFor` (`AU: 1.55`, `NZ: 1.70`, `IN: 84`) against `price_usd`.
7. THE cart subtotal and order total SHALL be recalculated using the active Country whenever the Country_Context value changes.

---

### Requirement 8: Static SPA Build and Hostinger Deployment

**User Story:** As a Luxeholic developer, I want the Vite build to produce a static SPA that works correctly on Hostinger, so that all client-side routes resolve without 404 errors.

#### Acceptance Criteria

1. THE App SHALL be buildable with `vite build` producing a static output in the `dist/` directory.
2. THE `vite.config.ts` SHALL configure the build output directory as `dist/`.
3. WHEN a user navigates directly to any route (e.g., `/shop`, `/product/some-slug`, `/cart`), THE App SHALL serve `index.html` and allow TanStack Router to handle the route client-side.
4. THE `dist/` directory SHALL contain a `.htaccess` file (or equivalent Hostinger configuration) that rewrites all non-asset requests to `index.html` to enable SPA fallback.
5. THE `.htaccess` file SHALL use Apache `mod_rewrite` rules: `RewriteEngine On`, `RewriteCond %{REQUEST_FILENAME} !-f`, `RewriteCond %{REQUEST_FILENAME} !-d`, `RewriteRule ^ index.html [L]`.
6. THE GitHub Actions workflow (`.github/workflows/deploy-gh-pages.yml`) SHALL be updated or supplemented to produce the `dist/` output compatible with Hostinger's expected directory structure.
7. THE App SHALL not require a Node.js server process at runtime; all server-side rendering SHALL be disabled in favour of client-side rendering for the Hostinger deployment target.
8. THE `VITE_FIREBASE_*` environment variables SHALL be injected at build time via Hostinger's environment variable configuration or the `.env` file, and SHALL NOT be committed to the repository.

---

### Requirement 9: Supabase Removal

**User Story:** As a Luxeholic developer, I want all Supabase dependencies removed from the codebase, so that the app has a single, consistent backend (Firebase/Firestore) and the bundle size is reduced.

#### Acceptance Criteria

1. THE App SHALL remove the `@supabase/supabase-js` package from `package.json` dependencies after all Supabase usages have been migrated.
2. THE App SHALL remove the `src/integrations/supabase/` directory after migration is complete.
3. THE App SHALL remove the `src/integrations/lovable/` directory if it is used solely for Supabase OAuth delegation.
4. THE App SHALL remove all `VITE_SUPABASE_*` environment variable references from `.env.example` and application code.
5. WHEN the migration is complete, THE App SHALL compile without TypeScript errors related to missing Supabase types or imports.
6. THE App SHALL remove the `@lovable.dev/cloud-auth-js` package from `package.json` if it is used solely for Supabase authentication delegation.

---

### Requirement 10: Authentication State Consistency Across Domains

**User Story:** As a Luxeholic customer, I want my sign-in state to be recognised when I switch between regional domains, so that I do not have to sign in again after changing regions.

#### Acceptance Criteria

1. WHEN a user is signed in on `luxeholic.com.au` and navigates to `luxeholic.co.nz`, THE Auth_Service SHALL restore the user's Firebase session on the new domain via Firebase's built-in token persistence.
2. THE App SHALL configure Firebase Auth persistence to `browserLocalStorage` so that the auth token survives page reloads and cross-domain navigations within the same browser.
3. WHILE `auth_state_loading` is `true`, THE App SHALL display a loading indicator and SHALL NOT redirect the user to the sign-in page prematurely, regardless of whether the loading state is caused by initial auth resolution, a timeout, or a failure.
4. WHEN a user is not authenticated and attempts to access the `/account` route, THE App SHALL redirect the user to `/auth`.
5. WHEN a user successfully authenticates and was redirected from a protected route, THE App SHALL redirect the user back to `/account` after sign-in.

