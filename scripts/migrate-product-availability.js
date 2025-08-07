// Script to safely apply product availability migration
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Starting safe migration for product availability features...');
    
    // Migration commands to execute separately
    const migrationCommands = [
      'ALTER TABLE "Product" ADD COLUMN "availability_type" TEXT DEFAULT \'in_stock\'',
      'ALTER TABLE "Product" ADD COLUMN "is_available" BOOLEAN DEFAULT true',
      'ALTER TABLE "Product" ADD COLUMN "custom_price_note" TEXT',
      'ALTER TABLE "Product" ADD COLUMN "pre_order_note" TEXT',
      `UPDATE "Product" SET 
        "availability_type" = 'in_stock',
        "is_available" = true
      WHERE "availability_type" IS NULL OR "is_available" IS NULL`
    ];
    
    // Execute each command separately
    for (const [index, command] of migrationCommands.entries()) {
      try {
        console.log(`🔄 Executing step ${index + 1}/${migrationCommands.length}...`);
        await prisma.$executeRawUnsafe(command);
        console.log(`✅ Step ${index + 1} completed`);
      } catch (error) {
        // If column already exists, that's okay
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Step ${index + 1} skipped - column already exists`);
          continue;
        }
        throw error;
      }
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Checking updated products...');
    
    // Verify the migration worked
    const productCount = await prisma.product.count();
    const productsWithNewFields = await prisma.product.count({
      where: {
        availability_type: { not: null },
        is_available: { not: null }
      }
    });
    
    console.log(`📈 Total products: ${productCount}`);
    console.log(`✅ Products with new fields: ${productsWithNewFields}`);
    
    if (productCount === productsWithNewFields) {
      console.log('🎉 All products successfully updated with new availability features!');
    } else {
      console.log('⚠️  Some products may need manual updates');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
if (require.main === module) {
  applyMigration()
    .then(() => {
      console.log('🏁 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { applyMigration };
