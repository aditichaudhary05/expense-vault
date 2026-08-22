const db = require('../db');

class AnalyticsService {
  async getSummary(userId, targetMonth, monthlyBudget = 30000) {
    const currentDate = new Date();
    const currentMonthStr = targetMonth || `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    const [year, m] = currentMonthStr.split('-').map(Number);
    const prevDate = new Date(year, m - 2, 1);
    const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthQuery = `
      SELECT COALESCE(SUM(amount), 0)::float as total_spent, COUNT(*)::int as count
      FROM expenses
      WHERE user_id = $1 AND TO_CHAR(expense_date, 'YYYY-MM') = $2
    `;
    const { rows: currentRows } = await db.query(currentMonthQuery, [userId, currentMonthStr]);
    const currentTotal = currentRows[0].total_spent;
    const currentCount = currentRows[0].count;

    const { rows: prevRows } = await db.query(currentMonthQuery, [userId, prevMonthStr]);
    const prevTotal = prevRows[0].total_spent;

    let percentChange = 0;
    if (prevTotal > 0) {
      percentChange = parseFloat((((currentTotal - prevTotal) / prevTotal) * 100).toFixed(1));
    } else if (currentTotal > 0) {
      percentChange = 100;
    }

    const daysInMonth = new Date(year, m, 0).getDate();
    const currentDay = (targetMonth && targetMonth !== `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`)
      ? daysInMonth
      : currentDate.getDate();

    const dailyAverage = currentDay > 0 ? Math.round(currentTotal / currentDay) : 0;

    const remainingBudget = Math.max(0, monthlyBudget - currentTotal);
    const budgetUsedPercentage = monthlyBudget > 0 ? parseFloat(((currentTotal / monthlyBudget) * 100).toFixed(1)) : 0;

    const highestCategoryQuery = `
      SELECT category, SUM(amount)::float as total
      FROM expenses
      WHERE user_id = $1 AND TO_CHAR(expense_date, 'YYYY-MM') = $2
      GROUP BY category
      ORDER BY total DESC
      LIMIT 1
    `;
    const { rows: highestCatRows } = await db.query(highestCategoryQuery, [userId, currentMonthStr]);
    const highestCategory = highestCatRows[0] || { category: 'None', total: 0 };
    const highestCatPercentage = currentTotal > 0 ? parseFloat(((highestCategory.total / currentTotal) * 100).toFixed(1)) : 0;

    const largestExpenseQuery = `
      SELECT id, title, amount::float, category, TO_CHAR(expense_date, 'YYYY-MM-DD') as expense_date
      FROM expenses
      WHERE user_id = $1
      ORDER BY amount DESC
      LIMIT 1
    `;
    const { rows: largestRows } = await db.query(largestExpenseQuery, [userId]);
    const largestExpense = largestRows[0] || null;

    return {
      month: currentMonthStr,
      totalSpent: currentTotal,
      prevMonthSpent: prevTotal,
      percentChange,
      transactionCount: currentCount,
      monthlyBudget,
      remainingBudget,
      budgetUsedPercentage,
      dailyAverage,
      highestCategory: {
        category: highestCategory.category,
        total: highestCategory.total,
        percentage: highestCatPercentage
      },
      largestExpense
    };
  }

  async getCategoryBreakdown(userId, targetMonth) {
    let query = `
      SELECT category, SUM(amount)::float as total, COUNT(*)::int as count
      FROM expenses
      WHERE user_id = $1
    `;
    const params = [userId];

    if (targetMonth) {
      query += ` AND TO_CHAR(expense_date, 'YYYY-MM') = $2`;
      params.push(targetMonth);
    }

    query += ` GROUP BY category ORDER BY total DESC`;

    const { rows } = await db.query(query, params);

    const grandTotal = rows.reduce((acc, curr) => acc + curr.total, 0);

    return rows.map((item) => ({
      category: item.category,
      total: item.total,
      count: item.count,
      percentage: grandTotal > 0 ? parseFloat(((item.total / grandTotal) * 100).toFixed(1)) : 0
    }));
  }

  async getMonthlyAnalytics(userId, year = new Date().getFullYear()) {
    const query = `
      SELECT 
        TO_CHAR(expense_date, 'Mon') as month_name,
        TO_CHAR(expense_date, 'MM') as month_num,
        SUM(amount)::float as total,
        COUNT(*)::int as count
      FROM expenses
      WHERE user_id = $1 AND EXTRACT(YEAR FROM expense_date) = $2
      GROUP BY TO_CHAR(expense_date, 'Mon'), TO_CHAR(expense_date, 'MM')
      ORDER BY month_num ASC
    `;

    const { rows } = await db.query(query, [userId, year]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const resultMap = new Map(rows.map(r => [r.month_name, r]));

    return months.map(m => {
      const found = resultMap.get(m);
      return {
        month: m,
        totalSpent: found ? found.total : 0,
        transactions: found ? found.count : 0
      };
    });
  }

  async getSpendingTrend(userId, period = '1M') {
    let intervalDays = 30;
    if (period === '1W') intervalDays = 7;
    else if (period === '1M') intervalDays = 30;
    else if (period === '3M') intervalDays = 90;
    else if (period === '6M') intervalDays = 180;
    else if (period === '1Y') intervalDays = 365;

    const query = `
      SELECT 
        TO_CHAR(expense_date, 'YYYY-MM-DD') as date,
        TO_CHAR(expense_date, 'Mon DD') as formatted_date,
        SUM(amount)::float as amount
      FROM expenses
      WHERE user_id = $1 AND expense_date >= CURRENT_DATE - ($2 || ' days')::interval
      GROUP BY expense_date
      ORDER BY expense_date ASC
    `;

    const { rows } = await db.query(query, [userId, intervalDays]);
    return rows;
  }
}

module.exports = new AnalyticsService();
