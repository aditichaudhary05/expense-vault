const bcrypt = require('bcrypt');
const db = require('../db');

const SALT_ROUNDS = 10;

class AuthService {
  async register({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing user
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, avatar_url, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    return { success: true, user: result.rows[0] };
  }

  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    const result = await db.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return { success: false, message: 'Invalid email or password.' };
    }

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url || null }
    };
  }

  async getUserById(id) {
    const result = await db.query(
      'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async updateProfile(userId, { name, email, avatar_url }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is taken by another user
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [normalizedEmail, userId]
    );
    if (existing.rows.length > 0) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const result = await db.query(
      `UPDATE users SET name = $1, email = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING id, name, email, avatar_url`,
      [name.trim(), normalizedEmail, avatar_url || null, userId]
    );

    return { success: true, user: result.rows[0] };
  }

  async getSettings(userId) {
    const result = await db.query(
      `SELECT monthly_budget, currency, budget_alerts FROM user_settings WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // Return defaults
      return { monthlyBudget: 30000, currency: 'INR (₹)', budgetAlerts: true };
    }

    const row = result.rows[0];
    return {
      monthlyBudget: parseFloat(row.monthly_budget),
      currency: row.currency,
      budgetAlerts: row.budget_alerts
    };
  }

  async updateSettings(userId, { monthlyBudget, currency, budgetAlerts }) {
    const result = await db.query(
      `INSERT INTO user_settings (user_id, monthly_budget, currency, budget_alerts)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         monthly_budget = EXCLUDED.monthly_budget,
         currency = EXCLUDED.currency,
         budget_alerts = EXCLUDED.budget_alerts
       RETURNING monthly_budget, currency, budget_alerts`,
      [userId, monthlyBudget || 30000, currency || 'INR (₹)', budgetAlerts !== false]
    );

    const row = result.rows[0];
    return {
      monthlyBudget: parseFloat(row.monthly_budget),
      currency: row.currency,
      budgetAlerts: row.budget_alerts
    };
  }
}

module.exports = new AuthService();
