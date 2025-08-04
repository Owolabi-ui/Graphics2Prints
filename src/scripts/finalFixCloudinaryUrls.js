// src/scripts/finalFixCloudinaryUrls.js
// Final version of the fix script to handle the remaining problematic URLs

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');
const url = require('url');

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
 * (using empty string instead of null because the schema doesn't allow null)
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
 * Check if URL is reachable directly with better error handling
 */
async function isUrlReachable(imageUrl) {
  return new Promise((resolve) => {
    try {
      // Parse the URL to handle potential malformed URLs better
      const parsedUrl = url.parse(imageUrl);
      
      if (!parsedUrl.protocol) {
        console.log(`Invalid URL (no protocol): ${imageUrl}`);
        resolve(false);
        return;
      }
      
      // Determine if we should use http or https based on URL
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const options = {
        method: 'HEAD', // Just get headers, not the whole body
        timeout: 10000  // 10 second timeout
      };
      
      const req = protocol.request(imageUrl, options, (res) => {
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
      
      req.on('timeout', () => {
        console.log('URL check timed out');
        req.destroy();
        resolve(false);
      });

      req.end();
    } catch (error) {
      console.error(`Exception while checking URL ${imageUrl}:`, error.message);
      resolve(false);
    }
  });
}

/**
 * Final fix method with better error handling
 */
async function finalFixCloudinaryUrls() {
  try {
    console.log('Starting final fix for problematic Cloudinary URLs...');
    
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
    let processedCount = 0;
    
    // Process each product
    for (const product of products) {
      processedCount++;
      console.log(`\n[${processedCount}/${products.length}] Processing product ${product.id}`);
      
      // Skip if no image_url
      if (!product.image_url) {
        console.log(`Product ${product.id} has no image URL. Skipping.`);
        continue;
      }
      
      console.log(`Checking URL: ${product.image_url}`);
      
      try {
        // Check if the URL is reachable
        const isReachable = await isUrlReachable(product.image_url);
        
        if (!isReachable) {
          console.log(`❌ URL is not reachable for product ${product.id}. Resetting URL.`);
          const success = await resetProductImageUrl(product.id);
          if (success) {
            fixedCount++;
            console.log(`✅ Successfully reset image URL for product ${product.id}`);
          } else {
            errorCount++;
            console.log(`❌ Failed to reset image URL for product ${product.id}`);
          }
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

/**
 * Special fix for the remaining problematic URLs that weren't fixed in previous runs
 */
async function fixRemainingProblematicUrls() {
  try {
    console.log('Starting fix for remaining problematic Cloudinary URLs...');
    
    // Get all products with Cloudinary URLs
    const products = await prisma.product.findMany({
      where: {
        image_url: {
          contains: 'cloudinary.com'
        }
      }
    });
    
    console.log(`Found ${products.length} products with Cloudinary URLs.`);
    
    let resetCount = 0;
    
    // For each product, directly check if it should have an image
    for (const product of products) {
      if (!product.image_url) continue;
      
      // Format of filename in Cloudinary URL
      const urlParts = product.image_url.split('/');
      const filename = urlParts[urlParts.length - 1];
      
      // Check if the corresponding file exists in the public/images folder
      const localImagePath = path.join(process.cwd(), 'public', 'images', filename);
      const filenameWithoutExt = path.basename(filename, path.extname(filename));
      
      // Check variations of the filename that might exist locally
      const possibleExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      let fileExists = false;
      
      for (const ext of possibleExtensions) {
        const potentialPath = path.join(process.cwd(), 'public', 'images', filenameWithoutExt + ext);
        if (fs.existsSync(potentialPath)) {
          fileExists = true;
          break;
        }
      }
      
      // If no local file exists, reset the URL
      if (!fileExists) {
        console.log(`No local image found for product ${product.id} (${filenameWithoutExt}). Resetting URL.`);
        await resetProductImageUrl(product.id);
        resetCount++;
      }
    }
    
    console.log(`Reset ${resetCount} product URLs that didn't have corresponding local images.`);
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix based on command line argument
const fixType = process.argv[2];

if (fixType === 'remaining') {
  fixRemainingProblematicUrls();
} else {
  // Use the standard method by default
  finalFixCloudinaryUrls();
}
