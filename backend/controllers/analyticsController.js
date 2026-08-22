const analyticsService = require('../services/analyticsService');
const { successResponse } = require('../utils/responseHandler');

class AnalyticsController {
  async getSummary(req, res, next) {
    try {
      const userId = req.session.userId;
      const month = req.query.month;
      let budget = req.query.budget ? parseFloat(req.query.budget) : null;

      // If no budget param, fetch from user_settings
      if (budget === null) {
        const authService = require('../services/authService');
        const userSettings = await authService.getSettings(userId);
        budget = userSettings.monthlyBudget;
      }

      const summary = await analyticsService.getSummary(userId, month, budget);
      return successResponse(res, summary, 'Summary metrics calculated successfully');
    } catch (err) {
      next(err);
    }
  }

  async getCategoryBreakdown(req, res, next) {
    try {
      const userId = req.session.userId;
      const month = req.query.month;
      const categories = await analyticsService.getCategoryBreakdown(userId, month);
      return successResponse(res, categories, 'Category breakdown calculated successfully');
    } catch (err) {
      next(err);
    }
  }

  async getMonthlyAnalytics(req, res, next) {
    try {
      const userId = req.session.userId;
      const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
      const monthlyData = await analyticsService.getMonthlyAnalytics(userId, year);
      return successResponse(res, monthlyData, 'Monthly analytics calculated successfully');
    } catch (err) {
      next(err);
    }
  }

  async getSpendingTrend(req, res, next) {
    try {
      const userId = req.session.userId;
      const period = req.query.period || '1M';
      const trend = await analyticsService.getSpendingTrend(userId, period);
      return successResponse(res, trend, 'Spending trend retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();
