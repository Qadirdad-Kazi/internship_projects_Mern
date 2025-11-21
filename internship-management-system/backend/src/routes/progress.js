const express = require('express');
const {
  createProgress,
  getAllProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
  addFeedbackToProgress,
  approveProgress,
  getProgressByTask
} = require('../controllers/progressController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateProgress } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/progress
// @desc    Submit progress report
// @access  Private (Intern only - for their own tasks)
router.post('/', auth, validateProgress, createProgress);

// @route   GET /api/progress
// @desc    Get all progress records with filtering and pagination
// @access  Private
router.get('/', auth, getAllProgress);

// @route   GET /api/progress/task/:taskId
// @desc    Get all progress records for a specific task
// @access  Private
router.get('/task/:taskId', auth, getProgressByTask);

// @route   GET /api/progress/:id
// @desc    Get progress record by ID
// @access  Private
router.get('/:id', auth, getProgressById);

// @route   PUT /api/progress/:id
// @desc    Update progress record
// @access  Private
router.put('/:id', auth, updateProgress);

// @route   DELETE /api/progress/:id
// @desc    Delete progress record
// @access  Private
router.delete('/:id', auth, deleteProgress);

// @route   POST /api/progress/:id/feedback
// @desc    Add feedback to progress record
// @access  Private (Admin only)
router.post('/:id/feedback', auth, adminAuth, addFeedbackToProgress);

// @route   PUT /api/progress/:id/approve
// @desc    Approve progress record
// @access  Private (Admin only)
router.put('/:id/approve', auth, adminAuth, approveProgress);

module.exports = router;