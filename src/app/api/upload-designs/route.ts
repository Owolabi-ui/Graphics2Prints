import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import pool from "@/lib/db";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;
    const customerId = formData.get("customerId") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary with specific folder and transformation
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "customer-designs",
      public_id: `design_${orderId}_${customerId}_${Date.now()}`,
      resource_type: "auto",
      transformation: [
        { quality: "auto:best" },
        { format: "auto" }
      ],
      tags: ["customer-design", `order-${orderId}`, `customer-${customerId}`]
    });

    // Save upload metadata to database
    const client = await pool.connect();
    try {
      // First, ensure the design_uploads table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS design_uploads (
          id SERIAL PRIMARY KEY,
          order_reference VARCHAR(255),
          customer_id INTEGER,
          file_name VARCHAR(255) NOT NULL,
          cloudinary_url TEXT NOT NULL,
          cloudinary_public_id VARCHAR(255) UNIQUE NOT NULL,
          file_type VARCHAR(100) NOT NULL,
          file_size INTEGER NOT NULL,
          upload_status VARCHAR(50) DEFAULT 'pending',
          admin_notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      const result = await client.query(
        `INSERT INTO design_uploads 
         (order_reference, customer_id, file_name, cloudinary_url, cloudinary_public_id, file_type, file_size, upload_status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING id, created_at`,
        [
          orderId || null,
          customerId ? parseInt(customerId) : null,
          file.name,
          uploadResponse.secure_url,
          uploadResponse.public_id,
          file.type,
          file.size,
          "pending"
        ]
      );

      const designUpload = result.rows[0];

      return NextResponse.json({
        success: true,
        data: {
          id: designUpload.id,
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
          uploadedAt: designUpload.created_at
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error uploading design:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to upload design",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    let query = `
      SELECT 
        du.*,
        c.name as customer_name,
        c.email as customer_email
      FROM design_uploads du
      LEFT JOIN customers c ON du.customer_id = c.customer_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (orderId) {
      query += ` AND du.order_reference = $${paramIndex}`;
      params.push(orderId);
      paramIndex++;
    }

    if (customerId) {
      query += ` AND du.customer_id = $${paramIndex}`;
      params.push(parseInt(customerId));
      paramIndex++;
    }

    if (status) {
      query += ` AND du.upload_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY du.created_at DESC`;

    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      
      const uploads = result.rows.map(row => ({
        id: row.id,
        order_reference: row.order_reference,
        customer_id: row.customer_id,
        file_name: row.file_name,
        cloudinary_url: row.cloudinary_url,
        cloudinary_public_id: row.cloudinary_public_id,
        file_type: row.file_type,
        file_size: row.file_size,
        upload_status: row.upload_status,
        admin_notes: row.admin_notes,
        created_at: row.created_at,
        updated_at: row.updated_at,
        customer: row.customer_name ? {
          name: row.customer_name,
          email: row.customer_email
        } : null
      }));

      return NextResponse.json({
        success: true,
        data: uploads
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching design uploads:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch design uploads",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
