import { NextRequest, NextResponse } from 'next/server';
import { createLink, getAllLinks, codeExists, initializeDatabase } from '@/lib/db';
import { validateLinkInput } from '@/lib/validators';

// Initialize database on first API call
let dbInitialized = false;

async function ensureDbInitialized() {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
}

// POST /api/links - Create a new short link
export async function POST(request: NextRequest) {
    try {
        await ensureDbInitialized();

        const body = await request.json();
        const { url, customCode } = body;

        // Validate input
        const validation = validateLinkInput(url, customCode);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            );
        }

        // Check if code already exists
        const exists = await codeExists(customCode);
        if (exists) {
            return NextResponse.json(
                { success: false, error: 'This custom code is already in use' },
                { status: 409 }
            );
        }

        // Create the link
        const link = await createLink(customCode, url);

        return NextResponse.json(
            { success: true, link },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/links - Get all links
export async function GET() {
    try {
        await ensureDbInitialized();

        const links = await getAllLinks();
        return NextResponse.json({ success: true, links }, { status: 200 });
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
