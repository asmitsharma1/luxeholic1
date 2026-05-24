# 🚀 Getting Started with Luxeholic

Welcome to Luxeholic! This guide will get you up and running in 15 minutes.

## 📋 What You Need

Before starting, make sure you have:
- ✅ Node.js 18+ installed
- ✅ A code editor (VS Code recommended)
- ✅ A Firebase account (free tier is fine)
- ✅ A BrandsGateway business account

## ⚡ Quick Setup (5 Steps)

### Step 1: Install Dependencies (2 min)

```bash
cd luxe-global-style-main
npm install
```

### Step 2: Set Up Firebase (5 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Enter "Luxeholic" → Continue
3. Enable Google Analytics (optional) → Create project
4. Once created, click the **Web icon** (</>) to add a web app
5. Register app as "Luxeholic Web"
6. Copy the configuration values

### Step 3: Configure Firebase Services (3 min)

**Enable Authentication:**
1. In Firebase Console, go to **Authentication** → Get started
2. Click **Sign-in method** tab
3. Enable **Email/Password** → Save
4. Enable **Google** → Add your email → Save

**Create Firestore Database:**
1. Go to **Firestore Database** → Create database
2. Choose **Start in test mode** → Next
3. Select your region → Enable

**Initialize Storage:**
1. Go to **Storage** → Get started
2. Start in **test mode** → Next
3. Select your region → Done

### Step 4: Add Environment Variables (2 min)

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase config:

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="luxeholic-xxxxx.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="luxeholic-xxxxx"
VITE_FIREBASE_STORAGE_BUCKET="luxeholic-xxxxx.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**For BrandsGateway** (add later when you have credentials):
```env
VITE_BRANDSGATEWAY_API_KEY="your-key"
VITE_BRANDSGATEWAY_API_SECRET="your-secret"
```

### Step 5: Start Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## ✅ Test Your Setup

### Test 1: Authentication
1. Click the **"Sign In"** button in the header
2. Go to **"Sign Up"** tab
3. Enter email and password
4. Click **"Create Account"**
5. ✅ You should be signed in!

### Test 2: Check Firebase Console
1. Go to Firebase Console → Authentication
2. ✅ You should see your user account listed

### Test 3: Products (Without BrandsGateway)
If you don't have BrandsGateway credentials yet, the products won't load. That's okay! You can:
- Test authentication ✅
- Test UI components ✅
- Add BrandsGateway later ✅

## 🛍️ Adding BrandsGateway (Optional Now)

### Get BrandsGateway Credentials

1. Visit [BrandsGateway](https://www.brandsgateway.com/)
2. Sign up for a business account
3. Complete verification (may take 1-2 days)
4. Once approved, go to API Settings
5. Generate API Key and Secret
6. Add to your `.env` file

### Test BrandsGateway Integration

Once you have credentials:
1. Restart your dev server
2. Products should now load on the homepage
3. Try filtering by brand or category
4. Try searching for products

## 📁 Project Structure

```
luxe-global-style-main/
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx          ← Authentication UI
│   │   ├── ProductsShowcase.tsx   ← Product catalog
│   │   └── LuxuryShop.tsx         ← Complete shop page
│   ├── hooks/
│   │   ├── useFirebaseAuth.ts     ← Auth hook
│   │   └── useBrandsGateway.ts    ← Products hook
│   ├── integrations/
│   │   ├── firebase/              ← Firebase setup
│   │   └── brandsgateway/         ← BrandsGateway API
│   └── routes/                    ← Pages
├── .env                           ← Your credentials (DO NOT COMMIT)
├── README.md                      ← Main documentation
├── SETUP.md                       ← Detailed setup guide
└── INTEGRATION_GUIDE.md           ← Usage examples
```

## 🎯 What's Working Now

After completing the quick setup:

✅ **Authentication**
- Sign up with email/password
- Sign in with email/password
- Sign in with Google
- Sign out
- Session persistence

✅ **UI Components**
- Beautiful authentication modal
- Responsive header and navigation
- Shopping cart icon
- Product cards (will show data when BrandsGateway is connected)

✅ **Firebase Integration**
- User authentication
- Firestore database ready
- Cloud Storage ready

⏳ **Pending BrandsGateway**
- Product catalog (needs API credentials)
- Order management (needs API credentials)

## 🔧 Common Issues & Solutions

### Issue: "Firebase not initialized"
**Solution**: Check that all `VITE_FIREBASE_*` variables are in `.env`

### Issue: "Module not found"
**Solution**: Run `npm install` again

### Issue: Port 3000 already in use
**Solution**: Kill the process or use a different port:
```bash
PORT=3001 npm run dev
```

### Issue: Changes not reflecting
**Solution**: 
1. Stop the dev server (Ctrl+C)
2. Clear browser cache
3. Restart: `npm run dev`

## 📚 Next Steps

Now that you're set up, explore:

1. **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Learn how to use Firebase and BrandsGateway
2. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick code examples
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Understand the system design
4. **[CHECKLIST.md](./CHECKLIST.md)** - Complete setup checklist

## 🎨 Customize Your Site

### Change Site Name
Edit `src/components/LuxuryShop.tsx`:
```typescript
<h1 className="text-2xl font-bold">YOUR BRAND NAME</h1>
```

### Change Colors
Edit `src/styles.css` or use Tailwind classes

### Add Your Logo
Replace the text logo with an image in the header

## 🚀 Deploy to Production

When you're ready to launch:

```bash
# Build for production
npm run build

# Test production build locally
npm run preview
```

Then deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **Other**: Upload `dist/` folder

**Important**: Add environment variables in your deployment platform!

## 💡 Pro Tips

1. **Use React Query DevTools** - Already installed, press `Ctrl+Shift+D`
2. **Check Firebase Console** - Monitor users, database, and errors
3. **Use Browser DevTools** - Network tab shows API calls
4. **Start Small** - Test with a few products first
5. **Read the Docs** - All documentation files are in the root folder

## 🆘 Need Help?

1. Check the documentation files
2. Look at browser console for errors
3. Check Firebase Console logs
4. Review the example components
5. Check Network tab for API issues

## 📞 Documentation Index

| File | Purpose |
|------|---------|
| **GETTING_STARTED.md** | This file - Quick start guide |
| **README.md** | Project overview |
| **SETUP.md** | Detailed setup instructions |
| **INTEGRATION_GUIDE.md** | Code examples and usage |
| **INTEGRATION_SUMMARY.md** | What's included |
| **QUICK_REFERENCE.md** | Quick code reference |
| **ARCHITECTURE.md** | System architecture |
| **CHECKLIST.md** | Complete setup checklist |

## 🎉 You're Ready!

You now have:
- ✅ A working development environment
- ✅ Firebase authentication set up
- ✅ Beautiful UI components
- ✅ Complete documentation
- ✅ Ready to add BrandsGateway when you have credentials

**Start building your luxury e-commerce empire! 🛍️✨**

---

Questions? Check the other documentation files or review the example components in `src/components/`.

Happy coding! 🚀
