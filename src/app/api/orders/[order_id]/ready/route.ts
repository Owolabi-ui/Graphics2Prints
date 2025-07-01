import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { order_id: string } }
) {
  const { order_id } = params;
  const { ready_in_days } = await req.json();

  if (!ready_in_days || isNaN(ready_in_days)) {
    return NextResponse.json({ error: "Invalid value" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query(
      "UPDATE orders SET ready_in_days = $1 WHERE order_id = $2",
      [ready_in_days, order_id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  } finally {
    client.release();
  }
}