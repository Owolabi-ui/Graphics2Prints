import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone_number } = await req.json();

    // Check if user already exists
    const client = await pool.connect();
    try {
      const existing = await client.query(
        "SELECT * FROM customers WHERE email = $1",
        [email]
      );
      if (existing.rows.length > 0) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Insert new customer
      await client.query(
        `INSERT INTO customers (name, email, phone_number, password_hash, created_at, updated_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [name, email, phone_number || null, password_hash]
      );

      return NextResponse.json({ message: "User created" }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
