# Deploy to Vercel

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository: `asmitsharma1/luxeholic1`
5. Configure project:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/client`
   - **Install Command:** `npm install`
6. Add Environment Variables (if needed):
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_BRANDSGATEWAY_API_KEY=your-api-key
   VITE_BRANDSGATEWAY_API_SECRET=your-api-secret
   ```
7. Click **"Deploy"**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Automatic Deployments

Once connected, Vercel will automatically deploy:
- ✅ Every push to `main` branch → Production
- ✅ Every pull request → Preview deployment

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### Firebase (Required)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

### BrandsGateway (Required)
- `VITE_BRANDSGATEWAY_API_KEY`
- `VITE_BRANDSGATEWAY_API_SECRET`

## Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. SSL certificate will be automatically provisioned

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Node.js version (should be 18.x or higher)

### 404 Errors
- The `vercel.json` file handles SPA routing
- All routes redirect to `/index.html`

### Environment Variables Not Working
- Make sure they start with `VITE_`
- Redeploy after adding new variables
- Check they're set for the correct environment (Production/Preview)

## Performance

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Edge caching
- ✅ Gzip/Brotli compression

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
