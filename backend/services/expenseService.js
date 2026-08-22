const db = require('../db');

class ExpenseService {
  async getAllExpenses(userId, filters = {}) {
    let query = `
      SELECT id, title, amount::float, category, description, payment_method, 
             TO_CHAR(expense_date, 'YYYY-MM-DD') as expense_date, 
             created_at, updated_at
      FROM expenses
      WHERE user_id = $1
    `;
    const params = [userId];
    let paramIndex = 2;

    if (filters.search) {
      query += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex} OR LOWER(category) LIKE $${paramIndex})`;
      params.push(`%${filters.search.toLowerCase()}%`);
      paramIndex++;
    }

    if (filters.category && filters.category !== 'All') {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.month) {
      query += ` AND TO_CHAR(expense_date, 'YYYY-MM') = $${paramIndex}`;
      params.push(filters.month);
      paramIndex++;
    }

    if (filters.startDate) {
      query += ` AND expense_date >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND expense_date <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    if (filters.minAmount !== undefined && filters.minAmount !== '') {
      query += ` AND amount >= $${paramIndex}`;
      params.push(parseFloat(filters.minAmount));
      paramIndex++;
    }

    if (filters.maxAmount !== undefined && filters.maxAmount !== '') {
      query += ` AND amount <= $${paramIndex}`;
      params.push(parseFloat(filters.maxAmount));
      paramIndex++;
    }

    const allowedSortFields = {
      date: 'expense_date',
      amount: 'amount',
      title: 'title',
      created: 'created_at'
    };

    const sortField = allowedSortFields[filters.sortBy] || 'expense_date';
    const sortOrder = (filters.order && filters.order.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}, id DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(filters.limit, 10));
    }

    const { rows } = await db.query(query, params);
    return rows;
  }

  async getExpenseById(userId, id) {
    const query = `
      SELECT id, title, amount::float, category, description, payment_method, 
             TO_CHAR(expense_date, 'YYYY-MM-DD') as expense_date, 
             created_at, updated_at
      FROM expenses
      WHERE id = $1 AND user_id = $2
    `;
    const { rows } = await db.query(query, [id, userId]);
    return rows[0] || null;
  }

  async createExpense(userId, data) {
    const { title, amount, category, description, payment_method, expense_date } = data;

    const query = `
      INSERT INTO expenses (user_id, title, amount, category, description, payment_method, expense_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, amount::float, category, description, payment_method, 
                TO_CHAR(expense_date, 'YYYY-MM-DD') as expense_date, created_at, updated_at
    `;
    const values = [
      userId,
      title,
      parseFloat(amount),
      category,
      description || null,
      payment_method || 'Cash',
      expense_date
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async updateExpense(userId, id, data) {
    const { title, amount, category, description, payment_method, expense_date } = data;

    const query = `
      UPDATE expenses
      SET title = $1, amount = $2, category = $3, description = $4, payment_method = $5, 
          expense_date = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING id, title, amount::float, category, description, payment_method, 
                TO_CHAR(expense_date, 'YYYY-MM-DD') as expense_date, created_at, updated_at
    `;
    const values = [
      title,
      parseFloat(amount),
      category,
      description || null,
      payment_method || 'Cash',
      expense_date,
      id,
      userId
    ];

    const { rows } = await db.query(query, values);
    return rows[0] || null;
  }

  async deleteExpense(userId, id) {
    const query = `DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id`;
    const { rows } = await db.query(query, [id, userId]);
    return rows.length > 0;
  }
}

module.exports = new ExpenseService();
