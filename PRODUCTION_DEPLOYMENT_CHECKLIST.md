# Production Deployment Checklist for Graphics2Prints

## 🔒 Security & Authentication

### Google OAuth Setup
- [ ] Updated Google Cloud Console with production domains
- [ ] Added `https://www.graphics2prints.com` to Authorized JavaScript origins
- [ ] Added `https://graphics2prints.com` to Authorized JavaScript origins (fallback)
- [ ] Added `https://www.graphics2prints.com/api/auth/callback/google` to Authorized redirect URIs
- [ ] Added `https://graphics2prints.com/api/auth/callback/google` to Authorized redirect URIs (fallback)

### Environment Variables
- [ ] Generated new, secure JWT_SECRET (minimum 32 characters)
- [ ] Updated NEXTAUTH_URL to `https://www.graphics2prints.com`
- [ ] Verified all environment variables are set correctly

## 💳 Payment Integration

### Paystack Configuration
- [ ] **CRITICAL**: Replace test keys with live keys from Paystack dashboard
  - [ ] Replace `pk_test_*` with `pk_live_*` for NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  - [ ] Replace `sk_test_*` with `sk_live_*` for PAYSTACK_SECRET_KEY
- [ ] Updated callback URL to `https://www.graphics2prints.com/payment/callback`
- [ ] Updated webhook URL to `https://www.graphics2prints.com/api/webhook`
- [ ] Configured webhook in Paystack dashboard to point to production URL

## 🗄️ Database

### Production Database Setup
- [ ] Set up production PostgreSQL database
- [ ] Updated DATABASE_URL with production credentials
- [ ] Run database migrations on production
- [ ] Verified database connection works
- [ ] **SECURITY**: Ensure database is not publicly accessible
- [ ] Set up database backups

## ☁️ Cloudinary

### Image Storage
- [ ] Verified Cloudinary credentials work in production
- [ ] Tested image uploads from admin panel
- [ ] Confirmed image optimization is working
- [ ] Verified placeholder images are accessible

## 🌐 Domain & SSL

### Domain Configuration
- [ ] Domain `www.graphics2prints.com` is properly configured
- [ ] SSL certificate is installed and working
- [ ] HTTP redirects to HTTPS
- [ ] Both `www.graphics2prints.com` and `graphics2prints.com` work
- [ ] Set up proper DNS records

## 🚀 Deployment

### Before Going Live
- [ ] Test all authentication flows (Google login)
- [ ] Test payment processing (use Paystack test mode first)
- [ ] Test admin panel functionality
- [ ] Test image uploads
- [ ] Verify all pages load correctly
- [ ] Check mobile responsiveness
- [ ] Test contact forms and email functionality

### Performance & Monitoring
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Test site performance and loading speeds

## 🔧 Additional Security

### Production Security
- [ ] Enable CORS properly for production domain
- [ ] Review and update any hardcoded localhost URLs
- [ ] Set up rate limiting for API endpoints
- [ ] Review admin panel access controls
- [ ] Set up proper logging for production

## ⚠️ CRITICAL REMINDERS

1. **Never use test Paystack keys in production** - This will prevent real payments
2. **Always use HTTPS in production** - HTTP will cause authentication issues
3. **Backup your database** before going live
4. **Test everything thoroughly** in a staging environment first

## 📞 Support Contacts

- **Domain/Hosting**: [Your hosting provider]
- **Paystack Support**: https://paystack.com/support
- **Google Cloud Support**: https://cloud.google.com/support
- **Cloudinary Support**: https://support.cloudinary.com
