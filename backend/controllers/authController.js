const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { validateRegistration, validateLogin } = require('../utils/validation');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const validation = validateRegistration({ name, email, password });
      if (!validation.valid) {
        return errorResponse(res, validation.message, 400);
      }

      const result = await authService.register({ name, email, password });
      if (!result.success) {
        return errorResponse(res, result.message, 409);
      }

      req.session.userId = result.user.id;

      return successResponse(res, result.user, 'Account created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const validation = validateLogin({ email, password });
      if (!validation.valid) {
        return errorResponse(res, validation.message, 400);
      }

      const result = await authService.login({ email, password });
      if (!result.success) {
        return errorResponse(res, result.message, 401);
      }

      req.session.userId = result.user.id;

      return successResponse(res, result.user, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return errorResponse(res, 'Failed to log out', 500);
        }
        res.clearCookie('ev.sid');
        return successResponse(res, null, 'Logged out successfully');
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      if (!req.session || !req.session.userId) {
        return successResponse(res, { authenticated: false, user: null });
      }

      const user = await authService.getUserById(req.session.userId);
      if (!user) {
        return successResponse(res, { authenticated: false, user: null });
      }

      return successResponse(res, { authenticated: true, user });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.session.userId;
      const { name, email, avatar_url } = req.body;

      if (!name || !name.trim()) {
        return errorResponse(res, 'Name is required.', 400);
      }
      if (!email || !email.trim()) {
        return errorResponse(res, 'Email is required.', 400);
      }

      const result = await authService.updateProfile(userId, { name, email, avatar_url });
      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.user, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async getSettings(req, res, next) {
    try {
      const userId = req.session.userId;
      const settings = await authService.getSettings(userId);
      return successResponse(res, settings);
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const userId = req.session.userId;
      const { monthlyBudget, currency, budgetAlerts } = req.body;

      const settings = await authService.updateSettings(userId, { monthlyBudget, currency, budgetAlerts });
      return successResponse(res, settings, 'Settings saved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
