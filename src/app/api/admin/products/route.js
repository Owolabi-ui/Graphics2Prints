// src/app/api/admin/products/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Create a new product
export async function POST(request) {
  let prismaClient;
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Received product data:', data);

    // Validate required fields
    if (!data.name || (!data.price && data.availability_type !== 'custom_price')) {
      return NextResponse.json({ error: 'Name is required, and price is required unless using custom pricing' }, { status: 400 });
    }

    // Create new Prisma client instance for better connection handling
    prismaClient = new PrismaClient();

    // Prepare data matching the schema
    const productData = {
      name: data.name,
      description: data.description || '',
      amount: data.availability_type === 'custom_price' ? 0 : parseFloat(data.price), // Set amount to 0 for custom pricing
      minimum_order: parseInt(data.minimum_order) || 1,
      category: data.category || 'General', // Schema uses 'category' string not 'category_id'
      delivery_time: data.delivery_time || '3-5 business days',
      finishing_options: data.finishing_options || 'Standard',
      image_url: data.image_url || '',
      image_alt_text: data.image_alt_text || data.name || 'Product image',
      material: data.material || 'Standard',
      specifications: data.specifications || 'Standard specifications',
      availability_type: data.availability_type || 'in_stock',
      is_available: data.is_available !== undefined ? data.is_available : true,
      custom_price_note: data.custom_price_note || null,
      pre_order_note: data.pre_order_note || null,
    };

    console.log('Processed product data:', productData);

    // Create the product with timeout handling
    const product = await Promise.race([
      prismaClient.product.create({
        data: productData,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout - please try again')), 10000)
      )
    ]);

    console.log('Product created successfully:', product.id);
    return NextResponse.json(product);
    
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Provide more specific error messages
    if (error.message.includes('timeout')) {
      return NextResponse.json({ 
        error: 'Database connection timeout. Please check your internet connection and try again.' 
      }, { status: 503 });
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A product with this name already exists.' 
      }, { status: 409 });
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: 'Invalid category selected.' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: error.message || 'Failed to create product. Please try again.' 
    }, { status: 500 });
  } finally {
    // Always disconnect the client
    if (prismaClient) {
      await prismaClient.$disconnect();
    }
  }
}

// Get all products (for admin panel)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
