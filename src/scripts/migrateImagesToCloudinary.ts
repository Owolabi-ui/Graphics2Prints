// src/scripts/migrateImagesToCloudinary.ts
// Script to automate the migration of local images to Cloudinary URLs in the database

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env.local or .env
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log('Using environment variables from .env.local');
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Using environment variables from .env');
} else {
  console.error('No .env or .env.local file found!');
  process.exit(1);
}

// Initialize Prisma client
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Path to local images
const LOCAL_IMAGES_PATH = path.join(process.cwd(), 'public', 'images');
// Cloudinary folder
const CLOUDINARY_FOLDER = 'graphics2prints_products';

/**
 * Upload a single image to Cloudinary
 */
async function uploadImageToCloudinary(imagePath: string, publicId: string): Promise<string> {
  try {
    console.log(`Uploading ${imagePath} to Cloudinary as ${publicId}...`);
    
    const result = await cloudinary.v2.uploader.upload(imagePath, {
      public_id: publicId,
      folder: CLOUDINARY_FOLDER,
      overwrite: true,
      resource_type: 'image'
    });
    
    console.log(`Successfully uploaded ${imagePath} to Cloudinary!`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${imagePath} to Cloudinary:`, error);
    throw error;
  }
}

/**
 * Update product in database with new Cloudinary URL
 */
async function updateProductImageUrl(productId: number, imageUrl: string): Promise<void> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { image_url: imageUrl }
    });
    console.log(`Updated product ${productId} with new image URL: ${imageUrl}`);
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrateImagesToCloudinary() {
  try {
    console.log('Starting image migration to Cloudinary...');
    
    // Get all products from database
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products in database.`);
    
    // Process each product
    for (const product of products) {
      // Skip if no image_url or if already a Cloudinary URL
      if (!product.image_url || product.image_url.includes('cloudinary.com')) {
        console.log(`Skipping product ${product.id}: ${product.image_url ? 'Already on Cloudinary' : 'No image URL'}`);
        continue;
      }
      
      // Extract filename from the current image_url
      let filename = path.basename(product.image_url);
      
      // Clean up filename - replace spaces, special chars, etc.
      const publicId = filename.replace(/\.[^/.]+$/, ''); // Remove extension
      
      // Get the local file path
      let localImagePath = '';
      
      // Handle different URL formats
      if (product.image_url.startsWith('/images/')) {
        localImagePath = path.join(process.cwd(), 'public', product.image_url);
      } else if (product.image_url.startsWith('/public/images/')) {
        localImagePath = path.join(process.cwd(), product.image_url.substring(7)); // Remove /public/
      } else if (product.image_url.startsWith('images/')) {
        localImagePath = path.join(process.cwd(), 'public', product.image_url);
      } else {
        // For any other format, try to find the file by filename in the images directory
        localImagePath = path.join(LOCAL_IMAGES_PATH, filename);
      }
      
      // Check if file exists
      if (!fs.existsSync(localImagePath)) {
        console.warn(`Warning: Local image not found: ${localImagePath} for product ${product.id}`);
        continue;
      }
      
      // Upload to Cloudinary
      try {
        const cloudinaryUrl = await uploadImageToCloudinary(localImagePath, publicId);
        
        // Update database
        await updateProductImageUrl(product.id, cloudinaryUrl);
      } catch (error) {
        console.error(`Failed to process product ${product.id}:`, error);
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Migration script for only uploading to Cloudinary without database updates
 * Useful if you want to upload all images first, then update the database separately
 */
async function uploadAllImagesToCloudinary() {
  try {
    console.log('Starting upload of all images to Cloudinary...');
    
    // Get all image files from the public/images directory
    const files = fs.readdirSync(LOCAL_IMAGES_PATH);
    console.log(`Found ${files.length} files in ${LOCAL_IMAGES_PATH}`);
    
    for (const file of files) {
      // Skip directories and non-image files
      const filePath = path.join(LOCAL_IMAGES_PATH, file);
      if (fs.statSync(filePath).isDirectory()) continue;
      
      // Skip if not an image file
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) continue;
      
      // Get public ID without extension
      const publicId = path.basename(file, ext);
      
      try {
        // Upload to Cloudinary
        await uploadImageToCloudinary(filePath, publicId);
        console.log(`Uploaded ${file} to Cloudinary`);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }
    
    console.log('All images uploaded to Cloudinary!');
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

/**
 * Update database with Cloudinary URLs without uploading
 * Useful if you've already uploaded all images manually
 */
async function updateDatabaseWithCloudinaryUrls() {
  try {
    console.log('Starting database update with Cloudinary URLs...');
    
    // Get all products from database
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products in database.`);
    
    // Process each product
    for (const product of products) {
      // Skip if no image_url or if already a Cloudinary URL
      if (!product.image_url || product.image_url.includes('cloudinary.com')) {
        console.log(`Skipping product ${product.id}: ${product.image_url ? 'Already on Cloudinary' : 'No image URL'}`);
        continue;
      }
      
      // Extract filename from the current image_url
      const filename = path.basename(product.image_url);
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, ''); // Remove extension
      
      // Construct Cloudinary URL
      const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${CLOUDINARY_FOLDER}/${nameWithoutExt}`;
      
      // Update database
      try {
        await updateProductImageUrl(product.id, cloudinaryUrl);
      } catch (error) {
        console.error(`Failed to update product ${product.id}:`, error);
      }
    }
    
    console.log('Database update completed!');
  } catch (error) {
    console.error('Database update failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script based on command line argument
const scriptType = process.argv[2];

if (scriptType === 'upload-only') {
  uploadAllImagesToCloudinary();
} else if (scriptType === 'update-db-only') {
  updateDatabaseWithCloudinaryUrls();
} else {
  // Full migration by default
  migrateImagesToCloudinary();
}
