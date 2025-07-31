import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the user is an admin or a regular user
  const client = await pool.connect();
  try {
    let result;
    if (session.user.role === "admin") {
      // Admin: get all orders
      result = await client.query("SELECT * FROM orders");
    } else {
      // Regular user: get only their orders
      const customerId = session.user.customer_id;
      result = await client.query(
        "SELECT * FROM orders WHERE customer_id = $1",
        [customerId]
      );
    }
    const orders = result.rows.map(order => ({
      ...order,
      total_amount: parseFloat(order.total_amount)
    }));
    return NextResponse.json(orders);
  } finally {
    client.release();
  }
}
