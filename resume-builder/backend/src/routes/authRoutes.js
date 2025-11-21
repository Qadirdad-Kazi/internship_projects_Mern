const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register',
  validateRequest(schemas.register),
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  validateRequest(schemas.login),
  authController.login
);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile',
  authMiddleware,
  authController.getProfile
);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  authMiddleware,
  validateRequest(schemas.updateProfile),
  authController.updateProfile
);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password',
  authMiddleware,
  authController.changePassword
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh-token',
  authMiddleware,
  authController.refreshToken
);

/**
 * @route   DELETE /api/v1/auth/delete-account
 * @desc    Delete user account and all associated data
 * @access  Private
 */
router.delete('/delete-account',
  authMiddleware,
  authController.deleteAccount
);

module.exports = router;