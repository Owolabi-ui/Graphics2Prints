// src/scripts/migrateImagesToCloudinary.js
// JavaScript version of the migration script that works with CommonJS

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

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

/**
 * Check internet connection and Cloudinary API availability
 */
async function checkConnectivity() {
  return new Promise((resolve) => {
    const https = require('https');
    const req = https.get('https://api.cloudinary.com/v1_1/ping', (res) => {
      console.log(`✅ Cloudinary API is reachable (Status: ${res.statusCode})`);
      resolve(true);
    });

    req.on('error', (err) => {
      console.error('❌ Connectivity check failed:', err.message);
      console.log('\nPossible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify that api.cloudinary.com is not blocked by your firewall');
      console.log('3. Try to ping api.cloudinary.com from your command line');
      console.log('4. Check if you need to configure a proxy');
      console.log('5. Cloudinary might be experiencing issues - check status.cloudinary.com');
      resolve(false);
    });

    req.end();
  });
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Path to local images
const LOCAL_IMAGES_PATH = path.join(process.cwd(), 'public', 'images');
// Cloudinary folder
const CLOUDINARY_FOLDER = 'graphics2prints_products';

/**
 * Upload a single image to Cloudinary with retries
 */
async function uploadImageToCloudinary(imagePath, publicId) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 3000; // 3 seconds
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Uploading ${imagePath} to Cloudinary as ${publicId}... (Attempt ${attempt}/${MAX_RETRIES})`);
      
      const result = await cloudinary.uploader.upload(imagePath, {
        public_id: publicId,
        folder: CLOUDINARY_FOLDER,
        overwrite: true,
        resource_type: 'image',
        timeout: 60000 // 60 seconds timeout
      });
      
      console.log(`Successfully uploaded ${imagePath} to Cloudinary!`);
      return result.secure_url;
    } catch (error) {
      console.error(`Error uploading ${imagePath} to Cloudinary (Attempt ${attempt}/${MAX_RETRIES}):`, error);
      
      // Check if it's a network error
      if (error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        if (attempt < MAX_RETRIES) {
          console.log(`Network issue detected. Retrying in ${RETRY_DELAY/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
      }
      
      throw error;
    }
  }
}

/**
 * Update product in database with new Cloudinary URL
 */
async function updateProductImageUrl(productId, imageUrl) {
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
    
    // Check connectivity first
    console.log('Checking connectivity to Cloudinary API...');
    const isConnected = await checkConnectivity();
    if (!isConnected) {
      console.log('\nWould you like to continue anyway? (y/n)');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('> ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log('Migration aborted due to connectivity issues.');
        return;
      }
      
      console.log('Continuing despite connectivity issues...');
    }
    
    // Get all products from database
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products in database.`);
    
    // Process each product
    for (const product of products) {
      // Skip if no image_url or empty string or if already a Cloudinary URL
      if (!product.image_url || product.image_url === "" || product.image_url.includes('cloudinary.com')) {
        console.log(`Skipping product ${product.id}: ${product.image_url ? (product.image_url.includes('cloudinary.com') ? 'Already on Cloudinary' : 'Empty URL') : 'No image URL'}`);
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
    
    // Check connectivity first
    console.log('Checking connectivity to Cloudinary API...');
    const isConnected = await checkConnectivity();
    if (!isConnected) {
      console.log('\nWould you like to continue anyway? (y/n)');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('> ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log('Upload aborted due to connectivity issues.');
        return;
      }
      
      console.log('Continuing despite connectivity issues...');
    }
    
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
      // Skip if no image_url or empty string or if already a Cloudinary URL
      if (!product.image_url || product.image_url === "" || product.image_url.includes('cloudinary.com')) {
        console.log(`Skipping product ${product.id}: ${product.image_url ? (product.image_url.includes('cloudinary.com') ? 'Already on Cloudinary' : 'Empty URL') : 'No image URL'}`);
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
