import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, incrementClicks, initializeDatabase } from "@/lib/db";

// Initialize database on first API call
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// Force dynamic rendering to ensure clicks are always counted
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await ensureDbInitialized();

    const { code } = await params;
    console.log(`[Redirect] Processing request for code: ${code}`);

    // Prevent redirecting API routes
    if (
      code === "api" ||
      code === "healthz" ||
      code === "code" ||
      code === "_next"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const link = await getLinkByCode(code);

    if (!link) {
      console.log(`[Redirect] Link not found for code: ${code}`);
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Increment clicks and update last_clicked
    console.log(`[Redirect] Incrementing clicks for code: ${code}`);
    await incrementClicks(code);

    // Perform 302 redirect
    return NextResponse.redirect(link.target_url, { status: 302 });
  } catch (error) {
    console.error("Error redirecting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
