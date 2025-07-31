# Cloudinary Setup Guide

## 1. Create a Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After verification, you'll be redirected to your dashboard

## 2. Get Your Cloudinary Credentials
From your Cloudinary dashboard, copy these values:
- **Cloud Name**: Found in the dashboard header
- **API Key**: Found in the "API Keys" section
- **API Secret**: Found in the "API Keys" section

## 3. Create an Upload Preset
1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `graphics2prints_products` (or any name you prefer)
   - **Signing Mode**: Select **Unsigned** (for frontend uploads)
   - **Folder**: `graphics2prints/products` (optional, helps organize uploads)
   - **Format**: Auto
   - **Quality**: Auto
   - **Transformation**: You can add automatic optimizations here
5. Click **Save**

## 4. Update Your Environment Variables
Add these to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name-here"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="graphics2prints_products"
CLOUDINARY_API_KEY="your-api-key-here"
CLOUDINARY_API_SECRET="your-api-secret-here"
```

Replace the placeholder values with your actual Cloudinary credentials.

## 5. Features Included in the Admin Interface

### Image Upload Widget
- Drag & drop image upload
- Automatic image optimization
- Automatic cloud storage
- Real-time preview
- Support for multiple formats (JPEG, PNG, WebP)
- Built-in cropping tools

### Image Management
- Automatic URL generation
- CDN delivery
- Responsive image delivery
- SEO-friendly alt text handling

## 6. Security Best Practices

### Upload Preset Security
For production, consider:
1. Setting up **signed uploads** for better security
2. Adding **upload restrictions** (file size, format, etc.)
3. Implementing **transformation restrictions**

### Folder Organization
The current setup uploads to: `graphics2prints/products/`
You can customize this in the widget configuration.

## 7. Troubleshooting

### Common Issues:
1. **Widget not loading**: Check that your cloud name is correct
2. **Upload failing**: Verify your upload preset is set to "unsigned"
3. **Images not displaying**: Ensure the URLs are accessible and valid

### Testing:
1. Try uploading a test image through the admin interface
2. Check that the image appears in your Cloudinary media library
3. Verify the URL is saved correctly in your database

## 8. Optional Enhancements

### Advanced Features You Can Add:
1. **Image transformations**: Automatic resizing, format conversion
2. **AI-powered features**: Auto-tagging, background removal
3. **Video support**: If you plan to add product videos
4. **Bulk upload**: For importing existing product images

Would you like me to implement any of these advanced features?
