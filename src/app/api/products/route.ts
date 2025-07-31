import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
})

export async function GET() {
  try {
    const products = await prisma.product.findMany()
    console.log('Products found:', products)
    
    if (!products.length) {
      console.log('No products found in database')
    }
    
    return NextResponse.json({ 
      success: true, 
      data: products,
      count: products.length 
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error fetching products',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, amount, image_url, image_alt_text, minimum_order, category, delivery_time, finishing_options, material, specifications } = body

    if (!name || !amount || !minimum_order || !category || !delivery_time || !finishing_options || !material || !specifications || !image_alt_text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || '',
        amount,
        image_url: image_url || '',
        image_alt_text,
        minimum_order,
        category,
        delivery_time,
        finishing_options,
        material,
        specifications
      }
    })

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ success: false, error: 'Error creating product', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, description, amount, image_url, image_alt_text, minimum_order, category, delivery_time, finishing_options, material, specifications } = body

    if (!id || !name || !amount || !minimum_order || !category || !delivery_time || !finishing_options || !material || !specifications || !image_alt_text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || '',
        amount,
        image_url: image_url || '',
        image_alt_text,
        minimum_order,
        category,
        delivery_time,
        finishing_options,
        material,
        specifications
      }
    })

    return NextResponse.json({ success: true, data: updatedProduct })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ success: false, error: 'Error updating product', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ success: false, error: 'Error deleting product', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
