# Vercel Postgres Setup Guide

## Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your Graphics2Prints project

2. **Add Storage:**
   - Click the "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose "Hobby" (Free tier)
   - Name it: `graphics2prints-db`

3. **Get Environment Variables:**
   Vercel will provide these variables (copy them):
   ```
   POSTGRES_URL="..."
   POSTGRES_PRISMA_URL="..."
   POSTGRES_URL_NON_POOLING="..."
   POSTGRES_USER="..."
   POSTGRES_HOST="..."
   POSTGRES_PASSWORD="..."
   POSTGRES_DATABASE="..."
   ```

## Step 2: Update Your .env File

Replace your current DATABASE_URL with:
```properties
# Use Vercel's Prisma-optimized connection string
DATABASE_URL="${POSTGRES_PRISMA_URL}"
```

## Step 3: Data Migration

### Option A: Export/Import Data (Recommended)
```bash
# 1. Export your current data
pg_dump -h localhost -U postgres -d herde_ent --data-only --inserts > backup.sql

# 2. After setting up Vercel DB, import:
psql "${POSTGRES_URL_NON_POOLING}" < backup.sql
```

### Option B: Use the migration script we created
- Run `node scripts/migrateToProduction.js` (we'll create this)

## Step 4: Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Run database migrations on production
vercel env pull .env.production
npx prisma migrate deploy
npx prisma generate
```

## Step 5: Verify Setup

1. Check that your products are visible on the live site
2. Test admin panel functionality
3. Verify Cloudinary images are loading
4. Test payment flow with Paystack

## Database Size Estimates

Your current database:
- ~90 products ≈ 2-3MB
- Users, orders, sessions ≈ 5-10MB growth over time
- **Total estimated usage: 15-20MB** (well within 256MB limit)

## Scaling Options

When you outgrow free tier:
- **Pro Plan**: $20/month for 1GB storage
- **Enterprise**: Custom pricing for larger scale
