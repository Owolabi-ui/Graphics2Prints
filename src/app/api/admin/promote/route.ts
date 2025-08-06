import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function POST(req: NextRequest) {
  try {
    const { email, secret } = await req.json();
    
    // Simple security check - you can remove this after setup
    if (secret !== 'graphics2prints-admin-setup-2025') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Check if user exists
      const userResult = await client.query(
        "SELECT * FROM customers WHERE email = $1",
        [email]
      );

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'User not found. Please login with Google first.' }, { status: 404 });
      }

      // Update user to admin
      await client.query(
        "UPDATE customers SET role = 'admin', is_admin = true WHERE email = $1",
        [email]
      );

      return NextResponse.json({ 
        message: 'User promoted to admin successfully!',
        email: email
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error promoting user:', error);
    return NextResponse.json({ error: 'Failed to promote user' }, { status: 500 });
  }
}
