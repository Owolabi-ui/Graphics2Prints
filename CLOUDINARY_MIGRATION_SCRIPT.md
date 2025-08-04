# Cloudinary Migration Script

This script helps you automate the process of migrating your local images to Cloudinary and updating your database.

## Prerequisites

Before running this script, make sure you have:

1. Set up your Cloudinary account
2. Added your Cloudinary credentials to `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Installed the required packages:
   ```bash
   npm install cloudinary dotenv
   ```

## How to Use

The script provides three different modes:

### 1. Full Migration (Upload + Database Update)

This will upload all your images to Cloudinary and update your database with the new URLs:

```bash
npx ts-node src/scripts/migrateImagesToCloudinary.ts
```

### 2. Upload Only

This will only upload images to Cloudinary without updating the database:

```bash
npx ts-node src/scripts/migrateImagesToCloudinary.ts upload-only
```

### 3. Database Update Only

This will only update your database with Cloudinary URLs (assuming images are already uploaded):

```bash
npx ts-node src/scripts/migrateImagesToCloudinary.ts update-db-only
```

## Customization

You can modify the script to match your specific database schema:

1. If your products table has a different name than "products", update the references in the script.
2. If your image URL field has a different name than "image_url", update it in the script.

## Troubleshooting

If you encounter any issues:

1. Check your Cloudinary credentials in `.env.local`
2. Make sure your local image paths are correct
3. Verify that the Cloudinary folder name (`graphics2prints_products`) matches what you've set up

If specific images fail to upload, the script will log errors but continue with other images.
