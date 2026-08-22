import api from './api';

export const expenseService = {
  /**
   * Fetch expenses with optional search, filters, and sorting
   */
  getExpenses: async (params = {}) => {
    return api.get('/expenses', { params });
  },

  /**
   * Fetch single expense details
   */
  getExpenseById: async (id) => {
    return api.get(`/expenses/${id}`);
  },

  /**
   * Create a new expense
   */
  createExpense: async (expenseData) => {
    return api.post('/expenses', expenseData);
  },

  /**
   * Update an existing expense
   */
  updateExpense: async (id, expenseData) => {
    return api.put(`/expenses/${id}`, expenseData);
  },

  /**
   * Delete an expense
   */
  deleteExpense: async (id) => {
    return api.delete(`/expenses/${id}`);
  }
};

export default expenseService;
