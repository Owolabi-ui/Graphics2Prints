#!/usr/bin/env node

// cloudinary-migrate.js
// A simplified CLI tool for Cloudinary migration

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check for required packages
function checkRequiredPackages() {
  try {
    // Check if .env.local or .env exists
    const envLocalExists = fs.existsSync(path.join(process.cwd(), '.env.local'));
    const envExists = fs.existsSync(path.join(process.cwd(), '.env'));
    
    if (!envLocalExists && !envExists) {
      console.error('\n❌ Error: Neither .env.local nor .env file found!');
      console.log('Please create an environment file with your Cloudinary credentials:');
      console.log(`
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
      `);
      process.exit(1);
    }
    
    console.log(`✅ Using environment variables from ${envLocalExists ? '.env.local' : '.env'} file`);

    // Check for required packages
    try {
      require.resolve('cloudinary');
      require.resolve('dotenv');
    } catch (err) {
      console.error('\n❌ Required packages not found!');
      console.log('Installing cloudinary and dotenv...');
      
      try {
        execSync('npm install cloudinary dotenv', { stdio: 'inherit' });
        console.log('✅ Packages installed successfully!');
      } catch (installErr) {
        console.error('Failed to install packages. Please run:');
        console.log('npm install cloudinary dotenv');
        process.exit(1);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking requirements:', error);
    process.exit(1);
  }
}

function showMenu() {
  console.log('\n🌩️  Cloudinary Migration Tool 🌩️');
  console.log('----------------------------------------');
  console.log('1. Full Migration (Upload + Update Database)');
  console.log('2. Upload Images Only');
  console.log('3. Update Database Only');
  console.log('4. Exit');
  console.log('----------------------------------------');
  
  rl.question('\nSelect an option (1-4): ', (answer) => {
    switch (answer.trim()) {
      case '1':
        runMigration();
        break;
      case '2':
        runUploadOnly();
        break;
      case '3':
        runDatabaseUpdateOnly();
        break;
      case '4':
        console.log('Goodbye! 👋');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        showMenu();
        break;
    }
  });
}

function runMigration() {
  console.log('\n🚀 Starting full migration process...');
  console.log('This will upload all images to Cloudinary and update your database.');
  
  rl.question('Are you sure you want to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        console.log('\nRunning migration script...');
        execSync('npm run cloudinary:migrate', { stdio: 'inherit' });
        console.log('\n✅ Migration completed successfully!');
      } catch (error) {
        console.error('\n❌ Migration failed:', error);
      }
    }
    
    askToContinue();
  });
}

function runUploadOnly() {
  console.log('\n📤 Starting upload-only process...');
  console.log('This will upload all images to Cloudinary without updating your database.');
  
  rl.question('Are you sure you want to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        console.log('\nUploading images to Cloudinary...');
        execSync('npm run cloudinary:upload', { stdio: 'inherit' });
        console.log('\n✅ Upload completed successfully!');
      } catch (error) {
        console.error('\n❌ Upload failed:', error);
      }
    }
    
    askToContinue();
  });
}

function runDatabaseUpdateOnly() {
  console.log('\n🔄 Starting database-update-only process...');
  console.log('This will update your database with Cloudinary URLs (assuming images are already uploaded).');
  
  rl.question('Are you sure you want to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        console.log('\nUpdating database with Cloudinary URLs...');
        execSync('npm run cloudinary:update-db', { stdio: 'inherit' });
        console.log('\n✅ Database update completed successfully!');
      } catch (error) {
        console.error('\n❌ Database update failed:', error);
      }
    }
    
    askToContinue();
  });
}

function askToContinue() {
  rl.question('\nDo you want to perform another operation? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      showMenu();
    } else {
      console.log('Goodbye! 👋');
      rl.close();
    }
  });
}

// Main execution
console.log('👋 Welcome to the Cloudinary Migration Tool!');
console.log('This tool will help you migrate your local images to Cloudinary.\n');

// Check requirements
if (checkRequiredPackages()) {
  showMenu();
}
