const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/summary', (req, res, next) => analyticsController.getSummary(req, res, next));
router.get('/categories', (req, res, next) => analyticsController.getCategoryBreakdown(req, res, next));
router.get('/monthly', (req, res, next) => analyticsController.getMonthlyAnalytics(req, res, next));
router.get('/trend', (req, res, next) => analyticsController.getSpendingTrend(req, res, next));

module.exports = router;
