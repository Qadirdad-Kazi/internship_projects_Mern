const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { authMiddleware, validateOwnership, rateLimitByUser } = require('../middleware/auth');

/**
 * @route   GET /api/v1/pdf/generate/:id
 * @desc    Generate and download PDF for a resume
 * @access  Private
 */
router.get('/generate/:id',
  authMiddleware,
  validateOwnership('resume'),
  rateLimitByUser(10, 60 * 60 * 1000), // 10 PDF generations per hour
  pdfController.generatePDF
);

/**
 * @route   GET /api/v1/pdf/preview/:id
 * @desc    Preview PDF for a resume (inline view)
 * @access  Private
 */
router.get('/preview/:id',
  authMiddleware,
  validateOwnership('resume'),
  rateLimitByUser(20, 60 * 60 * 1000), // 20 PDF previews per hour
  pdfController.previewPDF
);

module.exports = router;