import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, totalAmount, items } = body

    // Format data according to Paystack docs
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: Math.round(totalAmount * 100), // Convert to kobo
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        currency: 'NGN',
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        metadata: {
          order_details: items.map((item: any) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.amount / item.minimum_order
          })),
          custom_fields: [
            {
              display_name: "Order Items",
              variable_name: "order_items",
              value: items.length.toString()
            }
          ]
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Payment initialization failed')
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment initialization failed' },
      { status: 500 }
    )
  }
}