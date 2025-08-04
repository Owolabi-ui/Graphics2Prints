# Cloudinary Environment Setup Guide

This guide will help you properly set up your environment variables for Cloudinary integration.

## Required Environment Variables

Make sure your `.env` file contains the following Cloudinary-related variables:

```
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=graphics2prints_products
```

## Where to Find These Values

1. **Cloud Name**: 
   - Log in to your Cloudinary dashboard
   - Look in the top-right corner under "Account Details"
   - Copy the "Cloud name" value

2. **API Key & Secret**:
   - In your Cloudinary dashboard, go to Settings > Access Keys
   - Copy the "API Key" and "API Secret" values

3. **Upload Preset**:
   - In your Cloudinary dashboard, go to Settings > Upload
   - Click "Add upload preset"
   - Name it "graphics2prints_products"
   - Set Signing Mode to "Unsigned"
   - Set Folder to "graphics2prints_products"
   - Save the preset

## Important Notes

- The `NEXT_PUBLIC_` prefix allows these variables to be used in browser-side code
- Keep your API secret secure and never expose it in client-side code
- Your migration script needs all these variables to function properly
- Our CloudinaryImage component only needs the `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` variable

## Testing Your Configuration

After setting up your environment variables, you can test if they're being loaded correctly by running:

```bash
npm run cloudinary
```

The script should now be able to find your environment variables and proceed with migration options.
