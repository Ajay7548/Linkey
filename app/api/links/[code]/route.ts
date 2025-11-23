import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, deleteLink, initializeDatabase } from "@/lib/db";

// Initialize database on first API call
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// GET /api/links/:code - Get stats for a specific link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await ensureDbInitialized();

    const { code } = await params;
    const link = await getLinkByCode(code);

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, link }, { status: 200 });
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/links/:code - Delete a link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await ensureDbInitialized();

    const { code } = await params;
    const deleted = await deleteLink(code);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
