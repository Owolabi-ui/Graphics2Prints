# Vercel Deployment Guide for Graphics2Prints

## Prerequisites
- Vercel account linked to your GitHub repository
- Production database setup (Neon PostgreSQL recommended)
- Google OAuth credentials configured
- Paystack live API keys

## Deployment Steps

### Step 1: Environment Variables
Set these in your Vercel dashboard under Project Settings > Environment Variables:

```env
# Authentication
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://www.graphics2prints.com

# Database
DATABASE_URL=your-production-database-url-here

# Payments (LIVE KEYS)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-live-paystack-public-key
PAYSTACK_SECRET_KEY=your-live-paystack-secret-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

### Step 2: Domain Configuration
1. Add custom domain in Vercel: graphics2prints.com
2. Update DNS records as instructed by Vercel
3. Ensure SSL certificate is active

### Step 3: Database Migration
```bash
npx prisma generate
npx prisma db push
```

### Step 4: Deployment Verification
1. Check all environment variables are set
2. Verify build succeeds
3. Test authentication flow
4. Test payment processing
5. Verify database connections

## Common Issues

### Next.js 15 Compatibility
- All dynamic routes use Promise<{ param: string }> types
- NextAuth configuration centralized in /lib/auth.ts
- useSearchParams() wrapped in Suspense boundaries

### Environment Variables
- Ensure all production values are set correctly
- Use LIVE Paystack keys for production
- Update NEXTAUTH_URL to match your domain

### Database
- Production database must be accessible
- Connection string format: postgresql://user:password@host:port/database
- Ensure prisma schema is generated

## Support
Contact development team if issues persist during deployment.
