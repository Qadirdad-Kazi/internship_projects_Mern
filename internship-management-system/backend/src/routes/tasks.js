const express = require('express');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addFeedback,
  getTaskStatistics
} = require('../controllers/taskController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/tasks/statistics
// @desc    Get task statistics
// @access  Private
router.get('/statistics', auth, getTaskStatistics);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Admin only)
router.post('/', auth, adminAuth, validateTask, createTask);

// @route   GET /api/tasks
// @desc    Get all tasks with filtering and pagination
// @access  Private
router.get('/', auth, getAllTasks);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Admin only or task creator)
router.delete('/:id', auth, deleteTask);

// @route   POST /api/tasks/:id/feedback
// @desc    Add feedback to task
// @access  Private (Admin only)
router.post('/:id/feedback', auth, adminAuth, addFeedback);

module.exports = router;