const expenseService = require('../services/expenseService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class ExpenseController {
  async getExpenses(req, res, next) {
    try {
      const userId = req.session.userId;
      const filters = {
        search: req.query.search,
        category: req.query.category,
        month: req.query.month,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        minAmount: req.query.minAmount,
        maxAmount: req.query.maxAmount,
        sortBy: req.query.sortBy,
        order: req.query.order,
        limit: req.query.limit
      };

      const expenses = await expenseService.getAllExpenses(userId, filters);
      return successResponse(res, expenses, 'Expenses retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getExpenseById(req, res, next) {
    try {
      const userId = req.session.userId;
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(userId, id);

      if (!expense) {
        return errorResponse(res, 'Expense not found', 404);
      }

      return successResponse(res, expense, 'Expense details retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createExpense(req, res, next) {
    try {
      const userId = req.session.userId;
      const { title, amount, category, expense_date } = req.body;

      if (!title || !amount || !category || !expense_date) {
        return errorResponse(res, 'Title, amount, category, and expense_date are required fields', 400);
      }

      const newExpense = await expenseService.createExpense(userId, req.body);
      return successResponse(res, newExpense, 'Expense created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async updateExpense(req, res, next) {
    try {
      const userId = req.session.userId;
      const { id } = req.params;
      const { title, amount, category, expense_date } = req.body;

      if (!title || !amount || !category || !expense_date) {
        return errorResponse(res, 'Title, amount, category, and expense_date are required fields', 400);
      }

      const updatedExpense = await expenseService.updateExpense(userId, id, req.body);

      if (!updatedExpense) {
        return errorResponse(res, 'Expense not found', 404);
      }

      return successResponse(res, updatedExpense, 'Expense updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteExpense(req, res, next) {
    try {
      const userId = req.session.userId;
      const { id } = req.params;
      const deleted = await expenseService.deleteExpense(userId, id);

      if (!deleted) {
        return errorResponse(res, 'Expense not found', 404);
      }

      return successResponse(res, { id }, 'Expense deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ExpenseController();
