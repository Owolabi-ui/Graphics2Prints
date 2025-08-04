// src/scripts/simpleFixCloudinaryUrls.js
// Simplified script to fix incorrect Cloudinary URLs in the database
// This version just checks if the URL is directly accessible

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');

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
 * Reset product image URL to empty string
 */
async function resetProductImageUrl(productId) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { image_url: "" }
    });
    console.log(`Reset image URL for product ${productId} to empty string`);
    return true;
  } catch (error) {
    console.error(`Error resetting product ${productId}:`, error);
    return false;
  }
}

/**
 * Check if URL is reachable directly
 */
async function isUrlReachable(url) {
  return new Promise((resolve) => {
    // Determine if we should use http or https based on URL
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      // 200-299 status means the file exists
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`URL is reachable with status code ${res.statusCode}`);
        resolve(true);
      } else {
        console.log(`URL is not reachable with status code ${res.statusCode}`);
        resolve(false);
      }
      
      // Consume response data to free up memory
      res.resume();
    });

    req.on('error', (err) => {
      console.log(`Error checking URL: ${err.message}`);
      resolve(false);
    });
    
    // Set a timeout of 10 seconds
    req.setTimeout(10000, () => {
      console.log('URL check timed out');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

/**
 * Simple fix method that checks image URLs directly
 */
async function simpleFixCloudinaryUrls() {
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
      
      console.log(`\nChecking URL for product ${product.id}: ${product.image_url}`);
      
      try {
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
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        errorCount++;
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

// Run the fix
simpleFixCloudinaryUrls();
