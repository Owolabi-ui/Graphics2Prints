import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

function generateOrderNumber() {
  const timestamp = Date.now().toString();
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  return timestamp + randomDigits;
}

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
console.log("Metadata received from Paystack:", metadata);
const email = paystackData.data.customer.email;
const amount = paystackData.data.amount / 100; // Convert from kobo to NGN

// Extract cart items from custom_fields
let items: { name: string; quantity: number }[] = [];
if (metadata.custom_fields && Array.isArray(metadata.custom_fields)) {
  const cartItemsField = metadata.custom_fields.find((field: any) => field.variable_name === 'cart_items');
  if (cartItemsField && cartItemsField.value) {
    try {
      const parsedItems = JSON.parse(cartItemsField.value);
      function parseItem(item: any): any {
        if (typeof item === 'string') {
          try {
            return parseItem(JSON.parse(item));
          } catch {
            return item;
          }
        }
        return item;
      }
      let normalizedItems = parsedItems.map(parseItem);
      items = normalizedItems.map((item: any) => ({
        name: item.name,
        quantity: item.quantity
      }));
    } catch (error) {
      console.error("Error parsing cart_items JSON:", error);
    }
  }
}

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
    console.log("Customer ID found:", customer_id);

    // 4. Check if order already exists
    const existing = await client.query(
      "SELECT * FROM orders WHERE payment_reference = $1",
      [reference]
    );
    if (existing.rows.length > 0) {
      console.log("Existing order found with order_number:", existing.rows[0].order_number);
      return NextResponse.json({ status: "success", orderNumber: existing.rows[0].order_number });
    }

    // 5. Generate unique order_number
    const order_number = generateOrderNumber();

    // 6. Insert order with order_number
   const orderResult = await client.query(
  `INSERT INTO orders (customer_id, total_amount, status, payment_reference, items, created_at, order_number)
   VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
   RETURNING order_number`,
  [customer_id, amount, "paid", reference, JSON.stringify(items), order_number]
);
    const insertedOrderNumber = orderResult.rows[0].order_number;
    console.log("New order inserted with order_number:", insertedOrderNumber);

    return NextResponse.json({ status: "success", orderNumber: insertedOrderNumber });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ status: "error", error: "Order creation failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
