import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ order_id: string }> }
) {
  const params = await context.params;
  const order_id = params.order_id;

  const session = await getServerSession(authOptions);

  console.log("Session user:", session?.user);

  if (!session || !session.user) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = session.user.customer_id;

  console.log("Querying order_number:", order_id, "for customer_id:", customerId);

  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM orders WHERE order_number = $1 AND customer_id = $2",
      [order_id, customerId]
    );
    console.log("Query result rows:", result.rows);
    if (result.rows.length === 0) {
      console.log("Order not found for given order_number and customer_id");
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const order = result.rows[0];
    // Parse items if stored as JSON string
    let items = order.items;
    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
        console.log("Parsed items:", items);
      } catch {
        items = [];
      }
    }
    // Return only the fields your frontend expects
    return NextResponse.json({
      order_number: order.order_number,
      status: order.status,
      created_at: order.created_at,
      items,
      total_amount: parseFloat(order.total_amount),
      ready_in_days: order.ready_in_days,
    });
  } finally {
    client.release();
  }
}
