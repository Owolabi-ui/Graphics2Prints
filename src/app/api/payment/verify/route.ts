import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    if (!reference) {
    return NextResponse.json({ status: "error", error: "No reference provided" }, { status: 400 });
  }

  // 1. Verify payment with Paystack
  const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const paystackData = await paystackRes.json();

  if (!paystackData.status || paystackData.data.status !== "success") {
    return NextResponse.json({ status: "error", error: "Payment not successful" }, { status: 400 });
  }

  // 2. Extract order details from metadata
  const metadata = paystackData.data.metadata;
  const email = paystackData.data.customer.email;
  const amount = paystackData.data.amount / 100; // Convert from kobo to NGN
  const items = metadata?.order_details || [];

  const client = await pool.connect();
  try {
    // 3. Get customer_id from customers table
    const customerRes = await client.query(
      "SELECT customer_id FROM customers WHERE email = $1",
      [email]
    );
    if (customerRes.rows.length === 0) {
      return NextResponse.json({ status: "error", error: "Customer not found" }, { status: 404 });
    }
    const customer_id = customerRes.rows[0].customer_id;

    // 4. Check if order already exists
    const existing = await client.query(
      "SELECT * FROM orders WHERE payment_reference = $1",
      [reference]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ status: "success", orderId: existing.rows[0].order_id });
    }

    // 5. Insert order
   const orderResult = await client.query(
  `INSERT INTO orders (customer_id, total_amount, status, payment_reference, items, created_at)
   VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
   RETURNING order_id`,
  [customer_id, amount, "paid", reference, JSON.stringify(items)]
);
    const orderId = orderResult.rows[0].order_id;

    return NextResponse.json({ status: "success", orderId });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ status: "error", error: "Order creation failed" }, { status: 500 });
  } finally {
    client.release();
  }
}