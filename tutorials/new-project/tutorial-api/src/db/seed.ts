import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const seedsDir = path.join(__dirname, 'seeds');
  const files = fs.readdirSync(seedsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} seed file(s)`);

  for (const file of files) {
    const filePath = path.join(seedsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    try {
      await pool.query(sql);
      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`✗ ${file}:`, (err as Error).message);
      await pool.end();
      process.exit(1);
    }
  }

  console.log('Seeding complete');
  await pool.end();
}

seed();
