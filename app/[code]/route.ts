import { NextRequest, NextResponse } from 'next/server';
import { getLinkByCode, incrementClicks, initializeDatabase } from '@/lib/db';

// Initialize database on first API call
let dbInitialized = false;

async function ensureDbInitialized() {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        await ensureDbInitialized();

        const { code } = params;

        // Prevent redirecting API routes
        if (code === 'api' || code === 'healthz' || code === 'code' || code === '_next') {
            return NextResponse.json(
                { error: 'Not found' },
                { status: 404 }
            );
        }

        const link = await getLinkByCode(code);

        if (!link) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        // Increment clicks and update last_clicked
        await incrementClicks(code);

        // Perform 302 redirect
        return NextResponse.redirect(link.target_url, { status: 302 });
    } catch (error) {
        console.error('Error redirecting:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
