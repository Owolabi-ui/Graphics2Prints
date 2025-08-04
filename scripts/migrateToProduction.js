const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// This script helps migrate data from local PostgreSQL to Vercel Postgres

async function exportData() {
  console.log('🔄 Starting data export from local database...');
  
  // Connect to local database with explicit URL
  const localPrisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres:Beyonce123@@localhost:5432/herde_ent?schema=public"
      }
    }
  });

  try {
    // Test connection first
    await localPrisma.$connect();
    console.log('✅ Connected to local database');

    // Export all data
    const products = await localPrisma.product.findMany();
    console.log(`📦 Found ${products.length} products`);

    // Get other tables if they exist
    let categories = [];
    let users = [];
    let accounts = [];
    let sessions = [];
    let orders = [];

    try {
      categories = await localPrisma.category.findMany();
      console.log(`📂 Found ${categories.length} categories`);
    } catch (e) {
      console.log('ℹ️  No categories table found');
    }

    try {
      users = await localPrisma.user.findMany();
      console.log(`👥 Found ${users.length} users`);
    } catch (e) {
      console.log('ℹ️  No users table found');
    }

    try {
      accounts = await localPrisma.account.findMany();
      console.log(`🔐 Found ${accounts.length} accounts`);
    } catch (e) {
      console.log('ℹ️  No accounts table found');
    }

    try {
      sessions = await localPrisma.session.findMany();
      console.log(`🎫 Found ${sessions.length} sessions`);
    } catch (e) {
      console.log('ℹ️  No sessions table found');
    }

    try {
      orders = await localPrisma.order.findMany({
        include: {
          orderItems: true
        }
      });
      console.log(`🛒 Found ${orders.length} orders`);
    } catch (e) {
      console.log('ℹ️  No orders table found');
    }

    const exportData = {
      products,
      categories,
      users,
      accounts,
      sessions,
      orders,
      timestamp: new Date().toISOString(),
      totalRecords: {
        products: products.length,
        categories: categories.length,
        users: users.length,
        accounts: accounts.length,
        sessions: sessions.length,
        orders: orders.length
      }
    };

    // Save to file
    fs.writeFileSync('data-export.json', JSON.stringify(exportData, null, 2));
    
    console.log('✅ Data export completed!');
    console.log(`📊 Exported ${products.length} products, ${users.length} users, ${orders.length} orders`);
    console.log('📁 Data saved to: data-export.json');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await localPrisma.$disconnect();
  }
}

async function importData() {
  console.log('🔄 Starting data import to Vercel Postgres...');
  
  // This will use the POSTGRES_PRISMA_URL from your .env
  const prodPrisma = new PrismaClient();

  try {
    // Read exported data
    const data = JSON.parse(fs.readFileSync('data-export.json', 'utf8'));
    
    console.log('📥 Importing data...');
    
    // Import in correct order (respecting foreign key constraints)
    
    // 1. Categories first
    if (data.categories.length > 0) {
      console.log(`📂 Importing ${data.categories.length} categories...`);
      await prodPrisma.category.createMany({
        data: data.categories,
        skipDuplicates: true
      });
    }

    // 2. Products
    if (data.products.length > 0) {
      console.log(`📦 Importing ${data.products.length} products...`);
      await prodPrisma.product.createMany({
        data: data.products,
        skipDuplicates: true
      });
    }

    // 3. Users
    if (data.users.length > 0) {
      console.log(`👥 Importing ${data.users.length} users...`);
      await prodPrisma.user.createMany({
        data: data.users,
        skipDuplicates: true
      });
    }

    // 4. Accounts
    if (data.accounts.length > 0) {
      console.log(`🔐 Importing ${data.accounts.length} accounts...`);
      await prodPrisma.account.createMany({
        data: data.accounts,
        skipDuplicates: true
      });
    }

    // 5. Sessions
    if (data.sessions.length > 0) {
      console.log(`🎫 Importing ${data.sessions.length} sessions...`);
      await prodPrisma.session.createMany({
        data: data.sessions,
        skipDuplicates: true
      });
    }

    // 6. Orders and Order Items
    if (data.orders.length > 0) {
      console.log(`🛒 Importing ${data.orders.length} orders...`);
      for (const order of data.orders) {
        const { orderItems, ...orderData } = order;
        
        const createdOrder = await prodPrisma.order.upsert({
          where: { id: order.id },
          update: orderData,
          create: orderData
        });

        if (orderItems && orderItems.length > 0) {
          await prodPrisma.orderItem.createMany({
            data: orderItems,
            skipDuplicates: true
          });
        }
      }
    }

    console.log('✅ Data import completed successfully!');
    console.log('🎉 Your Graphics2Prints data is now on Vercel Postgres!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    console.log('💡 Make sure your Vercel Postgres DATABASE_URL is correct in .env');
  } finally {
    await prodPrisma.$disconnect();
  }
}

// Command line usage
const command = process.argv[2];

if (command === 'export') {
  exportData();
} else if (command === 'import') {
  importData();
} else {
  console.log('📋 Usage:');
  console.log('  node scripts/migrateToProduction.js export  - Export data from local DB');
  console.log('  node scripts/migrateToProduction.js import  - Import data to Vercel Postgres');
  console.log('');
  console.log('🔄 Typical workflow:');
  console.log('  1. Run export first while connected to local DB');
  console.log('  2. Update .env with Vercel Postgres URL');
  console.log('  3. Run import to transfer data to production');
}
