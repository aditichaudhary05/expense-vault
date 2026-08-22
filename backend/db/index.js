const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE || 'expensevault',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

async function initDb() {
  // When using DATABASE_URL, the database already exists (managed by host)
  if (!process.env.DATABASE_URL) {
    const adminConfig = {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
      database: 'postgres',
    };
    const adminPool = new Pool(adminConfig);

    try {
      const res = await adminPool.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [process.env.PGDATABASE || 'expensevault']
      );

      if (res.rowCount === 0) {
        console.log(`Database "${process.env.PGDATABASE || 'expensevault'}" does not exist. Creating now...`);
        await adminPool.query(`CREATE DATABASE "${process.env.PGDATABASE || 'expensevault'}"`);
        console.log(`Database "${process.env.PGDATABASE || 'expensevault'}" created successfully.`);
      }
    } catch (err) {
      console.warn('Could not verify/create database via admin pool:', err.message);
    } finally {
      await adminPool.end().catch(() => {});
    }
  }

  // 1. Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Expenses table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      payment_method VARCHAR(50) DEFAULT 'Cash',
      expense_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);`);

  // 3. User settings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      monthly_budget DECIMAL(12,2) DEFAULT 30000,
      currency VARCHAR(20) DEFAULT 'INR (₹)',
      budget_alerts BOOLEAN DEFAULT true
    );
  `);

  // 4. Sessions table (for connect-pg-simple)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");`);

  console.log('Database tables initialized successfully.');
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initDb,
};
