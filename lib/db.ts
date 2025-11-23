import { Pool } from "pg";
import { Link } from "./types";

const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Helper function to execute queries
async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Initialize database table
export async function initializeDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      target_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      last_clicked TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Create a new link
export async function createLink(
  code: string,
  targetUrl: string
): Promise<Link> {
  const result = await query(
    `INSERT INTO links (code, target_url, clicks, last_clicked, created_at) 
     VALUES ($1, $2, 0, NULL, CURRENT_TIMESTAMP) 
     RETURNING *`,
    [code, targetUrl]
  );
  return result.rows[0];
}

// Get all links
export async function getAllLinks(): Promise<Link[]> {
  const result = await query("SELECT * FROM links ORDER BY created_at DESC");
  return result.rows;
}

// Get link by code
export async function getLinkByCode(code: string): Promise<Link | null> {
  const result = await query("SELECT * FROM links WHERE code = $1", [code]);
  return result.rows[0] || null;
}

// Increment click count and update last_clicked
export async function incrementClicks(code: string): Promise<void> {
  console.log(`[DB] Incrementing clicks for code: ${code}`);
  await query(
    `UPDATE links 
     SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP 
     WHERE code = $1`,
    [code]
  );
}

// Delete link by code
export async function deleteLink(code: string): Promise<boolean> {
  const result = await query("DELETE FROM links WHERE code = $1", [code]);
  return result.rowCount !== null && result.rowCount > 0;
}

// Check if code exists
export async function codeExists(code: string): Promise<boolean> {
  const link = await getLinkByCode(code);
  return link !== null;
}

// Check database connection
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  error?: string;
}> {
  try {
    await query("SELECT 1");
    return { connected: true };
  } catch (error) {
    console.error("Database connection check failed:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
