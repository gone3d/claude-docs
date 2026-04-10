import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    client.release();
    console.log('Database connected successfully');
    return true;
  } catch (err) {
    console.error('Database connection failed:', (err as Error).message);
    return false;
  }
}
