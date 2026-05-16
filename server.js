import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

// ─── MySQL Connection (Aiven Cloud) ───
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
});

// ─── Initialize DB ───
async function initDB() {
  try {
    const schema = readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf-8');
    const statements = schema.split(';').filter(s => s.trim());
    const conn = await pool.getConnection();
    for (const stmt of statements) {
      try { await conn.query(stmt); } catch (e) { /* ignore duplicate inserts */ }
    }
    conn.release();
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  }
}

// ─── USERS ───
app.get('/api/users', async (req, res) => {
  const [rows] = await pool.query('SELECT id, email, name, role, phone, street, address FROM users ORDER BY id');
  res.json(rows);
});
app.post('/api/users', async (req, res) => {
  const { email, name, role, phone, street, address } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO users (email, name, role, phone, street, address) VALUES (?, ?, ?, ?, ?, ?)', [email, name, role || 'customer', phone || '', street || '', address || '']);
    res.json({ id: result.insertId, email, name, role: role || 'customer', phone: phone || '', street: street || '', address: address || '' });
  } catch (e) { res.status(400).json({ error: 'Email already exists' }); }
});
app.put('/api/users/:id', async (req, res) => {
  const { name, phone, street, address } = req.body;
  await pool.query('UPDATE users SET name=?, phone=?, street=?, address=? WHERE id=?', [name, phone, street, address, req.params.id]);
  res.json({ success: true });
});
app.delete('/api/users/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id=?', [req.params.id]);
  res.json({ success: true });
});
app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  const [rows] = await pool.query('SELECT id, email, name, role, phone, street, address FROM users WHERE email=?', [email]);
  if (rows.length > 0) res.json(rows[0]);
  else res.status(401).json({ error: 'Invalid credentials' });
});

// ─── PRODUCTS ───
app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY id');
  res.json(rows.map(r => ({ ...r, price: parseFloat(r.price), rating: parseFloat(r.rating) })));
});
app.post('/api/products', async (req, res) => {
  const { name, price, image, description, category, stock, rating, reviews } = req.body;
  const [result] = await pool.query('INSERT INTO products (name, price, image, description, category, stock, rating, reviews) VALUES (?,?,?,?,?,?,?,?)',
    [name, price, image || '/images/bibingka.jpg', description || '', category || '', stock || 0, rating || 4.5, reviews || 0]);
  res.json({ id: result.insertId, ...req.body });
});
app.put('/api/products/:id', async (req, res) => {
  const fields = req.body;
  const sets = Object.keys(fields).map(k => `${k}=?`).join(', ');
  await pool.query(`UPDATE products SET ${sets} WHERE id=?`, [...Object.values(fields), req.params.id]);
  res.json({ success: true });
});
app.delete('/api/products/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
  res.json({ success: true });
});
app.put('/api/products/:id/stock', async (req, res) => {
  const { amount } = req.body;
  await pool.query('UPDATE products SET stock = GREATEST(0, stock + ?) WHERE id=?', [amount, req.params.id]);
  const [rows] = await pool.query('SELECT stock FROM products WHERE id=?', [req.params.id]);
  res.json({ stock: rows[0]?.stock || 0 });
});

// ─── ORDERS ───
app.get('/api/orders', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY id DESC');
  res.json(rows.map(r => ({
    id: r.id, customer: r.customer_email, customerName: r.customer_name,
    customerPhone: r.customer_phone, customerStreet: r.customer_street, customerAddress: r.customer_address,
    items: r.items, itemCount: r.item_count, total: parseFloat(r.total),
    status: r.status, type: r.type, date: r.order_date, time: r.order_time,
  })));
});
app.post('/api/orders', async (req, res) => {
  const o = req.body;
  const [result] = await pool.query(
    'INSERT INTO orders (customer_email, customer_name, customer_phone, customer_street, customer_address, items, item_count, total, status, type, order_date, order_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    [o.customer, o.customerName, o.customerPhone || '', o.customerStreet || '', o.customerAddress || '', o.items, o.itemCount, o.total, o.status || 'PENDING', o.type || 'Walk-in', o.date, o.time]
  );
  // Decrease stock
  if (o.cartItems) {
    for (const ci of o.cartItems) {
      await pool.query('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id=?', [ci.quantity, ci.id]);
    }
  }
  res.json({ id: result.insertId, ...o });
});
app.put('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ success: true });
});
app.delete('/api/orders/:id', async (req, res) => {
  await pool.query('DELETE FROM orders WHERE id=?', [req.params.id]);
  res.json({ success: true });
});

// ─── RESERVATIONS ───
app.get('/api/reservations', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM reservations ORDER BY id DESC');
  res.json(rows.map(r => ({ id: r.id, name: r.name, email: r.email, date: r.res_date, time: r.res_time, guests: r.guests, notes: r.notes, status: r.status, type: r.type, items: r.items })));
});
app.post('/api/reservations', async (req, res) => {
  const r = req.body;
  const [result] = await pool.query('INSERT INTO reservations (name, email, res_date, res_time, guests, notes, type, items) VALUES (?,?,?,?,?,?,?,?)',
    [r.name, r.email, r.date, r.time, r.guests, r.notes || '', r.type || 'Pick-up', r.items || '']);
  res.json({ id: result.insertId, ...r, status: 'pending' });
});
app.put('/api/reservations/:id/status', async (req, res) => {
  await pool.query('UPDATE reservations SET status=? WHERE id=?', [req.body.status, req.params.id]);
  res.json({ success: true });
});

// ─── FEEDBACK ───
app.get('/api/feedbacks', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM feedbacks ORDER BY id DESC');
  res.json(rows.map(r => ({ id: r.id, name: r.name, email: r.email, subject: r.subject, message: r.message, date: r.created_at?.toLocaleDateString?.('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || '', read: !!r.is_read, reply: r.reply || '', replyDate: r.reply_date || '' })));
});
app.post('/api/feedbacks', async (req, res) => {
  const f = req.body;
  const [result] = await pool.query('INSERT INTO feedbacks (name, email, subject, message) VALUES (?,?,?,?)', [f.name, f.email, f.subject, f.message]);
  res.json({ id: result.insertId, ...f, read: false, reply: '', replyDate: '', date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) });
});
app.put('/api/feedbacks/:id/read', async (req, res) => {
  await pool.query('UPDATE feedbacks SET is_read=TRUE WHERE id=?', [req.params.id]);
  res.json({ success: true });
});
app.put('/api/feedbacks/:id/reply', async (req, res) => {
  const { reply } = req.body;
  const replyDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  await pool.query('UPDATE feedbacks SET reply=?, reply_date=?, is_read=TRUE WHERE id=?', [reply, replyDate, req.params.id]);
  res.json({ success: true, replyDate });
});

// ─── SETTINGS ───
app.get('/api/settings', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM settings WHERE id=1');
  if (rows.length > 0) {
    const s = rows[0];
    res.json({ storeName: s.store_name, contactEmail: s.contact_email, phone: s.phone, address: s.address, hours: s.hours, facebook: s.facebook });
  } else res.json({});
});
app.put('/api/settings', async (req, res) => {
  const s = req.body;
  await pool.query('UPDATE settings SET store_name=?, contact_email=?, phone=?, address=?, hours=?, facebook=? WHERE id=1',
    [s.storeName, s.contactEmail, s.phone, s.address, s.hours, s.facebook]);
  res.json({ success: true });
});

// ─── Health check ───
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: e.message });
  }
});

// ─── Serve Frontend ───
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── Start ───
const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Clara's Best server running on port ${PORT}`);
    console.log(`📦 Connected to Aiven MySQL Cloud`);
  });
});
