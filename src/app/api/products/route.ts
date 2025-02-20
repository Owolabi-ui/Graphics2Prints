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