import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '10mb' }));

let pool;
let fallbackState = null;

function getSslOptions() {
  const caFromBase64 = process.env.AIVEN_CA_CERT_BASE64
    ? Buffer.from(process.env.AIVEN_CA_CERT_BASE64, 'base64').toString('utf8')
    : undefined;
  const caFromText = process.env.AIVEN_CA_CERT?.replace(/\\n/g, '\n');
  const caFromPath = process.env.AIVEN_CA_CERT_PATH && fs.existsSync(process.env.AIVEN_CA_CERT_PATH)
    ? fs.readFileSync(process.env.AIVEN_CA_CERT_PATH, 'utf8')
    : undefined;
  const ca = caFromBase64 || caFromText || caFromPath;
  if (ca) return { ca, rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' };
  if (process.env.DB_SSL === 'false') return undefined;
  return { rejectUnauthorized: false };
}

function getDbConfig() {
  const uri = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (uri) return { uri, ssl: getSslOptions(), waitForConnections: true, connectionLimit: 10 };
  if (!process.env.AIVEN_DB_HOST && !process.env.DB_HOST) return null;
  return {
    host: process.env.AIVEN_DB_HOST || process.env.DB_HOST,
    port: Number(process.env.AIVEN_DB_PORT || process.env.DB_PORT || 3306),
    user: process.env.AIVEN_DB_USER || process.env.DB_USER,
    password: process.env.AIVEN_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.AIVEN_DB_NAME || process.env.DB_NAME || 'defaultdb',
    ssl: getSslOptions(),
    waitForConnections: true,
    connectionLimit: 10,
  };
}

async function getPool() {
  if (pool) return pool;
  const config = getDbConfig();
  if (!config) return null;
  pool = mysql.createPool(config);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id TINYINT PRIMARY KEY,
      data LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  return pool;
}

async function readState() {
  const db = await getPool();
  if (!db) return fallbackState;
  const [rows] = await db.query('SELECT data FROM app_state WHERE id = 1 LIMIT 1');
  if (!rows.length) return null;
  return JSON.parse(rows[0].data);
}

async function writeState(state) {
  fallbackState = state;
  const db = await getPool();
  if (!db) return;
  await db.query(
    'INSERT INTO app_state (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
    [JSON.stringify(state)],
  );
}

app.get('/api/health', async (_req, res) => {
  try {
    const db = await getPool();
    if (db) await db.query('SELECT 1');
    res.json({ ok: true, database: db ? 'mysql' : 'memory-fallback' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/bootstrap', async (_req, res) => {
  try {
    const state = await readState();
    res.json({ ok: true, state });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.put('/api/snapshot', async (req, res) => {
  try {
    if (!req.body?.state || typeof req.body.state !== 'object') {
      return res.status(400).json({ ok: false, error: 'Missing state payload' });
    }
    await writeState(req.body.state);
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
} else {
  app.get('/', (_req, res) => res.send('Build the frontend first with npm run build.'));
}

app.listen(PORT, () => {
  console.log(`Clara's Best system running on port ${PORT}`);
});
