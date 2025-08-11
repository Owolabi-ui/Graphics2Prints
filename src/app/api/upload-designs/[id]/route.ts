import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const uploadId = params.id;
    const body = await request.json();
    const { upload_status, admin_notes } = body;

    if (!upload_status) {
      return NextResponse.json(
        { success: false, error: "Upload status is required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE design_uploads 
         SET upload_status = $1, admin_notes = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [upload_status, admin_notes || null, parseInt(uploadId)]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "Upload not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating design upload:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update design upload",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const uploadId = params.id;

    const client = await pool.connect();
    try {
      // Get the upload details first to get Cloudinary public_id
      const getResult = await client.query(
        `SELECT cloudinary_public_id FROM design_uploads WHERE id = $1`,
        [parseInt(uploadId)]
      );

      if (getResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "Upload not found" },
          { status: 404 }
        );
      }

      // Optional: Delete from Cloudinary as well
      // const cloudinary = require('cloudinary').v2;
      // await cloudinary.uploader.destroy(getResult.rows[0].cloudinary_public_id);

      // Delete from database
      await client.query(
        `DELETE FROM design_uploads WHERE id = $1`,
        [parseInt(uploadId)]
      );

      return NextResponse.json({
        success: true,
        message: "Design upload deleted successfully"
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting design upload:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete design upload",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
