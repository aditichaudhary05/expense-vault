const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env'), override: true });

const { pool, initDb } = require('./db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.SESSION_SECRET) {
  console.error('FATAL: SESSION_SECRET environment variable is not set.');
  process.exit(1);
}

app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(session({
  store: new PgSession({
    pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  name: 'ev.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'ExpenseVault API is running', database: 'connected' });
  } catch (err) {
    res.json({ success: true, message: 'ExpenseVault API is running', database: 'disconnected' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`ExpenseVault API running on port ${PORT}`);
  await initDb();
});
