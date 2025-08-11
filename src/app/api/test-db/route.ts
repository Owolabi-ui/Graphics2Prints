import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
    
    const client = await pool.connect();
    try {
      // Simple test query
      const result = await client.query('SELECT NOW() as current_time');
      
      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        data: {
          current_time: result.rows[0].current_time,
          database_url_set: !!process.env.DATABASE_URL
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Database connection failed",
        details: error instanceof Error ? error.message : String(error),
        database_url_set: !!process.env.DATABASE_URL
      },
      { status: 500 }
    );
  }
}
