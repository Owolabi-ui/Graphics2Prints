import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = session.user.customer_id;

  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM orders WHERE customer_id = $1",
      [customerId]
    );
    // Parse total_amount as float for each order
    const orders = result.rows.map(order => ({
      ...order,
      total_amount: parseFloat(order.total_amount)
    }));
    return NextResponse.json(orders);
  } finally {
    client.release();
  }
}
