const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getInterns,
  assignSupervisor
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin only)
router.get('/', auth, adminAuth, getAllUsers);

// @route   GET /api/users/interns
// @desc    Get all interns with filtering and pagination
// @access  Private (Admin only)
router.get('/interns', auth, adminAuth, getInterns);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or own profile)
router.put('/:id', auth, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, deleteUser);

// @route   PUT /api/users/assign-supervisor
// @desc    Assign supervisor to intern
// @access  Private (Admin only)
router.put('/assign-supervisor', auth, adminAuth, assignSupervisor);

module.exports = router;