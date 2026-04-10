import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './db/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.listen(PORT, async () => {
  console.log(`Tutorial API running on http://localhost:${PORT}`);
  await testConnection();
});
