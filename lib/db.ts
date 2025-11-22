import { Pool } from "pg";
import { Link } from "./types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Initialize database table
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        target_url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        last_clicked TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    client.release();
  }
}

// Create a new link
export async function createLink(
  code: string,
  targetUrl: string
): Promise<Link> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO links (code, target_url, clicks, last_clicked, created_at) 
       VALUES ($1, $2, 0, NULL, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [code, targetUrl]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Get all links
export async function getAllLinks(): Promise<Link[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM links ORDER BY created_at DESC"
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Get link by code
export async function getLinkByCode(code: string): Promise<Link | null> {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM links WHERE code = $1", [
      code,
    ]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

// Increment click count and update last_clicked
export async function incrementClicks(code: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE links 
       SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP 
       WHERE code = $1`,
      [code]
    );
  } finally {
    client.release();
  }
}

// Delete link by code
export async function deleteLink(code: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query("DELETE FROM links WHERE code = $1", [
      code,
    ]);
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    client.release();
  }
}

// Check if code exists
export async function codeExists(code: string): Promise<boolean> {
  const link = await getLinkByCode(code);
  return link !== null;
}
