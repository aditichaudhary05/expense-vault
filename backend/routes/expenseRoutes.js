const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', (req, res, next) => expenseController.getExpenses(req, res, next));
router.get('/:id', (req, res, next) => expenseController.getExpenseById(req, res, next));
router.post('/', (req, res, next) => expenseController.createExpense(req, res, next));
router.put('/:id', (req, res, next) => expenseController.updateExpense(req, res, next));
router.delete('/:id', (req, res, next) => expenseController.deleteExpense(req, res, next));

module.exports = router;
