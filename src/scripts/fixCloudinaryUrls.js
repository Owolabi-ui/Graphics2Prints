// src/scripts/fixCloudinaryUrls.js
// Script to fix incorrect Cloudinary URLs in the database

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const https = require('https');

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
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary folder
const CLOUDINARY_FOLDER = 'graphics2prints_products';

/**
 * Check if an image exists on Cloudinary by public ID
 */
async function checkImageExistsOnCloudinary(publicId) {
  try {
    const result = await cloudinary.api.resource(`${CLOUDINARY_FOLDER}/${publicId}`, { type: 'upload' });
    return !!result;
  } catch (error) {
    // If error code is "not found", the image doesn't exist
    if (error.error && error.error.http_code === 404) {
      return false;
    }
    // For other errors, we log and assume it doesn't exist
    console.error(`Error checking if ${publicId} exists:`, error);
    return false;
  }
}

/**
 * Extract public ID from Cloudinary URL
 */
function extractPublicIdFromUrl(url) {
  try {
    // Expected format: https://res.cloudinary.com/CLOUD_NAME/image/upload/FOLDER/PUBLIC_ID
    const parts = url.split('/');
    // Get the last part (which should be the filename or public ID)
    const filename = parts[parts.length - 1];
    // If the URL has query parameters or extensions, remove them
    return filename.split('.')[0];
  } catch (error) {
    console.error('Error extracting public ID from URL:', url, error);
    return null;
  }
}

/**
 * Reset product image URL to null
 */
async function resetProductImageUrl(productId) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { image_url: null }
    });
    console.log(`Reset image URL for product ${productId} to null`);
    return true;
  } catch (error) {
    console.error(`Error resetting product ${productId}:`, error);
    return false;
  }
}

/**
 * Fix incorrect Cloudinary URLs in the database
 */
async function fixCloudinaryUrls() {
  try {
    console.log('Starting to fix incorrect Cloudinary URLs...');
    
    // Get all products from database with Cloudinary URLs
    const products = await prisma.product.findMany({
      where: {
        image_url: {
          contains: 'cloudinary.com'
        }
      }
    });
    
    console.log(`Found ${products.length} products with Cloudinary URLs.`);
    
    let fixedCount = 0;
    let errorCount = 0;
    let validCount = 0;
    
    // Process each product
    for (const product of products) {
      // Skip if no image_url
      if (!product.image_url) continue;
      
      // Extract public ID from the Cloudinary URL
      const publicId = extractPublicIdFromUrl(product.image_url);
      
      if (!publicId) {
        console.error(`Could not extract public ID from URL: ${product.image_url} for product ${product.id}`);
        errorCount++;
        continue;
      }
      
      console.log(`Checking if image exists for product ${product.id} with public ID: ${publicId}`);
      
      // Check if the image exists on Cloudinary
      const imageExists = await checkImageExistsOnCloudinary(publicId);
      
      if (!imageExists) {
        console.log(`❌ Image does not exist on Cloudinary for product ${product.id}. Resetting URL.`);
        const success = await resetProductImageUrl(product.id);
        if (success) fixedCount++;
        else errorCount++;
      } else {
        console.log(`✅ Image exists on Cloudinary for product ${product.id}. Keeping URL.`);
        validCount++;
      }
    }
    
    console.log('\nFix completed!');
    console.log(`Summary:
    - Total products with Cloudinary URLs: ${products.length}
    - Valid URLs (image exists): ${validCount}
    - Fixed URLs (reset to null): ${fixedCount}
    - Errors (failed to process): ${errorCount}
    `);
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Check if URL is reachable directly
 */
async function isUrlReachable(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      // 200 status means the file exists
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on('error', () => {
      resolve(false);
    });

    req.end();
  });
}

/**
 * Alternative fix method that checks image URLs directly
 * This is useful if the Cloudinary API access is restricted
 */
async function fixCloudinaryUrlsByDirectCheck() {
  try {
    console.log('Starting to fix incorrect Cloudinary URLs by direct URL checks...');
    
    // Get all products from database with Cloudinary URLs
    const products = await prisma.product.findMany({
      where: {
        image_url: {
          contains: 'cloudinary.com'
        }
      }
    });
    
    console.log(`Found ${products.length} products with Cloudinary URLs.`);
    
    let fixedCount = 0;
    let errorCount = 0;
    let validCount = 0;
    
    // Process each product
    for (const product of products) {
      // Skip if no image_url
      if (!product.image_url) continue;
      
      console.log(`Checking if URL is reachable for product ${product.id}: ${product.image_url}`);
      
      // Check if the URL is reachable
      const isReachable = await isUrlReachable(product.image_url);
      
      if (!isReachable) {
        console.log(`❌ URL is not reachable for product ${product.id}. Resetting URL.`);
        const success = await resetProductImageUrl(product.id);
        if (success) fixedCount++;
        else errorCount++;
      } else {
        console.log(`✅ URL is reachable for product ${product.id}. Keeping URL.`);
        validCount++;
      }
    }
    
    console.log('\nFix completed!');
    console.log(`Summary:
    - Total products with Cloudinary URLs: ${products.length}
    - Valid URLs (reachable): ${validCount}
    - Fixed URLs (reset to null): ${fixedCount}
    - Errors (failed to process): ${errorCount}
    `);
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the appropriate fix method based on command line argument
const fixMethod = process.argv[2];

if (fixMethod === 'direct-check') {
  fixCloudinaryUrlsByDirectCheck();
} else {
  // Use the API method by default
  fixCloudinaryUrls();
}
