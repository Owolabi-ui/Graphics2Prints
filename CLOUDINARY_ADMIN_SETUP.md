# How to Set Up Cloudinary for Admin Image Uploads

To enable automatic image uploads from your admin panel to Cloudinary, follow these steps:

## 1. Create a Cloudinary Upload Preset

For security reasons, we use an unsigned upload preset for client-side uploads. This allows users to upload directly to Cloudinary without exposing your API secret.

1. Log in to your Cloudinary dashboard
2. Navigate to Settings > Upload
3. Scroll down to "Upload presets"
4. Click "Add upload preset"
5. Configure the preset:
   - **Name**: `graphics2prints_admin_uploads` (or any name you prefer)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `graphics2prints_products` (or your preferred folder)
   - **Public ID Configuration**:
     - Select "Use the filename of the uploaded file as the public ID"
     - Enable "Append a unique suffix" (recommended for avoiding conflicts)
   - **Display Name Configuration**:
     - Select "Use the filename of the uploaded file as the asset's display name"
   - **Overwrite**: Enable "Overwrite files with the same Public ID"
   - **File Type Restrictions**: Set to only allow image files (jpg, jpeg, png, webp, gif)
   - **File Size Limit**: Set a reasonable limit (e.g., 10MB)
   - Save the preset

## 2. Update Your Environment Variables

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=graphics2prints_admin_uploads
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 3. Use the ImageUploader Component

The `ImageUploader` component is ready to use in your admin forms. It will:

1. Allow admins to upload images by clicking or dragging files
2. Automatically upload the image to Cloudinary
3. Return the Cloudinary URL to use in your product database

## 4. Testing the Admin Panel

1. Log in as an admin
2. Navigate to `/admin/products`
3. Try adding a new product with an image
4. Verify that the image uploads to Cloudinary and the URL is stored in your database

## 5. Security Considerations

- The client-side upload uses an unsigned preset, which means anyone who knows your cloud name and preset name could upload images
- To mitigate this risk:
  - Set folder restrictions in the upload preset
  - Set file type restrictions in the upload preset
  - Consider implementing rate limiting
  - For additional security, you can switch to server-side uploads

## 6. Additional Customization

You can customize the image upload behavior by:

- Changing the upload folder structure
- Adding image transformations
- Setting file size limits
- Implementing image moderation
