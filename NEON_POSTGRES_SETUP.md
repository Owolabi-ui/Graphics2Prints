# Neon PostgreSQL Setup Guide (Better than Vercel Postgres)

## Why Neon?
- **512MB storage** (vs Vercel's 256MB)
- **Unlimited compute** (vs Vercel's 60 hours/month)
- **Database branching** for testing
- **Official Vercel partner** - seamless integration

## Step 1: Create Neon Account

1. **Visit:** https://neon.tech
2. **Sign up** with your GitHub account (same as Vercel)
3. **Create a new project:** `graphics2prints-production`

## Step 2: Get Database URL

After creating the project, Neon will show:
```
Database URL: postgresql://username:password@hostname/database?sslmode=require
```

Copy this URL - it will look like:
```
postgresql://username:password@ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Step 3: Update Your .env

Replace your DATABASE_URL with the Neon URL:
```properties
DATABASE_URL="postgresql://username:password@ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

## Step 4: Integrate with Vercel

### Option A: Vercel Integration (Automatic)
1. In Neon dashboard → Integrations → Vercel
2. Connect your Vercel account
3. Select your Graphics2Prints project
4. Neon automatically adds environment variables to Vercel

### Option B: Manual Setup
1. In Vercel dashboard → Your project → Settings → Environment Variables
2. Add: `DATABASE_URL` with your Neon connection string

## Step 5: Data Migration

1. **Export current data:**
   ```bash
   node scripts/migrateToProduction.js export
   ```

2. **Update .env with Neon URL**

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Import your data:**
   ```bash
   node scripts/migrateToProduction.js import
   ```

## Step 6: Deploy to Vercel

```bash
vercel --prod
```

## Neon Advantages for Graphics2Prints

✅ **Double the storage** - 512MB vs 256MB  
✅ **No compute limits** - unlimited usage  
✅ **Database branching** - test features safely  
✅ **Better scaling** - automatic sleep/wake  
✅ **Same PostgreSQL** - no code changes needed  

## Free Tier Limits
- **Storage:** 512 MB (plenty for your 90 products + growth)
- **Compute:** Unlimited
- **Databases:** 1 project
- **Branches:** 10 (for testing)

Your Graphics2Prints store will easily fit and perform excellently on Neon's free tier!
