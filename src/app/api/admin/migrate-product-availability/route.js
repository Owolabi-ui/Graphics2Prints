// API endpoint to safely apply product availability migration in production
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

let prisma;

export async function POST(request) {
  try {
    // Only allow this in development or with proper authorization
    const { authorization } = await request.json();
    
    if (authorization !== 'migrate-product-availability-2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    prisma = new PrismaClient();

    console.log('🔄 Starting production migration for product availability features...');

    // Check if columns already exist
    const checkResult = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Product' 
      AND column_name IN ('availability_type', 'is_available', 'custom_price_note', 'pre_order_note')
    `;

    console.log('Existing columns:', checkResult);

    if (checkResult.length === 4) {
      return NextResponse.json({ 
        success: true, 
        message: 'Migration already applied - all columns exist',
        existingColumns: checkResult.length
      });
    }

    // Migration commands to execute separately
    const migrationCommands = [
      'ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "availability_type" TEXT DEFAULT \'in_stock\'',
      'ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "is_available" BOOLEAN DEFAULT true',
      'ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "custom_price_note" TEXT',
      'ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "pre_order_note" TEXT'
    ];

    const results = [];
    
    // Execute each command separately
    for (const [index, command] of migrationCommands.entries()) {
      try {
        console.log(`🔄 Executing step ${index + 1}/${migrationCommands.length}...`);
        await prisma.$executeRawUnsafe(command);
        results.push({ step: index + 1, status: 'success', command });
        console.log(`✅ Step ${index + 1} completed`);
      } catch (error) {
        // If column already exists, that's okay
        if (error.message.includes('already exists')) {
          results.push({ step: index + 1, status: 'skipped', reason: 'Column already exists' });
          console.log(`⚠️ Step ${index + 1} skipped - column already exists`);
          continue;
        }
        results.push({ step: index + 1, status: 'error', error: error.message });
        throw error;
      }
    }

    // Update existing products to have default values
    console.log('🔄 Updating existing products with default values...');
    const updateResult = await prisma.$executeRaw`
      UPDATE "Product" SET 
        "availability_type" = COALESCE("availability_type", 'in_stock'),
        "is_available" = COALESCE("is_available", true)
      WHERE "availability_type" IS NULL OR "is_available" IS NULL
    `;

    console.log('✅ Migration completed successfully!');

    // Verify the migration worked
    const productCount = await prisma.product.count();
    
    console.log(`📈 Total products: ${productCount}`);

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully!',
      results,
      totalProducts: productCount,
      updatedRows: updateResult
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Product availability migration endpoint',
    method: 'POST',
    authorization: 'Required'
  });
}
