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
    const { name, description, amount, image_url, image_alt_text, minimum_order, category, delivery_time, finishing_options, material, specifications, availability_type, is_available, custom_price_note, pre_order_note } = body

    // For custom_price items, amount is not required
    const isCustomPrice = availability_type === 'custom_price'
    
    if (!name || (!isCustomPrice && !amount) || !minimum_order || !category || !delivery_time || !finishing_options || !material || !specifications || !image_alt_text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Log the request for debugging mobile issues
    console.log('Creating product with availability_type:', availability_type, 'amount:', amount)

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || '',
        amount: isCustomPrice ? 0 : (amount || 0),
        image_url: image_url || '',
        image_alt_text,
        minimum_order,
        category,
        delivery_time,
        finishing_options,
        material,
        specifications,
        availability_type: availability_type || 'in_stock',
        is_available: is_available !== undefined ? is_available : true,
        custom_price_note: custom_price_note || null,
        pre_order_note: pre_order_note || null
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
    const { id, name, description, amount, image_url, image_alt_text, minimum_order, category, delivery_time, finishing_options, material, specifications, availability_type, is_available, custom_price_note, pre_order_note } = body

    // For custom_price items, amount is not required
    const isCustomPrice = availability_type === 'custom_price'
    
    if (!id || !name || (!isCustomPrice && !amount) || !minimum_order || !category || !delivery_time || !finishing_options || !material || !specifications || !image_alt_text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Log the request for debugging mobile issues
    console.log('Updating product with availability_type:', availability_type, 'amount:', amount)

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || '',
        amount: isCustomPrice ? 0 : (amount || 0),
        image_url: image_url || '',
        image_alt_text,
        minimum_order,
        category,
        delivery_time,
        finishing_options,
        material,
        specifications,
        availability_type: availability_type || 'in_stock',
        is_available: is_available !== undefined ? is_available : true,
        custom_price_note: custom_price_note || null,
        pre_order_note: pre_order_note || null
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
