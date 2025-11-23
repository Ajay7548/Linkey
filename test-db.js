const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Not Found');
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT NOW()');
      console.log('Connection successful!', res.rows[0]);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Connection failed:', err);
  } else {
    await pool.end();
  }
}

testConnection();
