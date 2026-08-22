const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.get('/me', (req, res, next) => authController.me(req, res, next));

router.put('/profile', requireAuth, (req, res, next) => authController.updateProfile(req, res, next));
router.get('/settings', requireAuth, (req, res, next) => authController.getSettings(req, res, next));
router.put('/settings', requireAuth, (req, res, next) => authController.updateSettings(req, res, next));

module.exports = router;
