import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { order_id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = session.user.customer_id;
  const { order_id } = params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM orders WHERE order_id = $1 AND customer_id = $2",
      [order_id, customerId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    // If items is a JSON string, parse it before returning
    const order = result.rows[0];
    if (typeof order.items === "string") {
      try {
        order.items = JSON.parse(order.items);
      } catch {
        order.items = [];
      }
    }
    return NextResponse.json(order);
  } finally {
    client.release();
  }
}