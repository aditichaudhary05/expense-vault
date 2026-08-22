import api from './api';

export const analyticsService = {
  /**
   * Fetch spending summary metrics (total, budget, count, daily avg, highest category)
   */
  getSummary: async (month, budget) => {
    return api.get('/analytics/summary', { params: { month, budget } });
  },

  /**
   * Fetch category breakdown totals and percentages
   */
  getCategoryBreakdown: async (month) => {
    return api.get('/analytics/categories', { params: { month } });
  },

  /**
   * Fetch monthly spending aggregate data for Bar Chart
   */
  getMonthlyAnalytics: async (year) => {
    return api.get('/analytics/monthly', { params: { year } });
  },

  /**
   * Fetch time-series trend data for Area Chart (1W, 1M, 3M, 6M, 1Y)
   */
  getSpendingTrend: async (period) => {
    return api.get('/analytics/trend', { params: { period } });
  }
};

export default analyticsService;
