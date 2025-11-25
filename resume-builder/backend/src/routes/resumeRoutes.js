const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { authMiddleware, optionalAuth, validateOwnership, rateLimitByUser, rateLimitByUserFast } = require('../middleware/auth');
const { validateRequest, validateQuery, validateResumeUpdate, schemas } = require('../middleware/validation');

/**
 * @route   POST /api/v1/resumes
 * @desc    Create a new resume
 * @access  Private
 */
router.post('/',
  authMiddleware,
  rateLimitByUserFast(3, 60 * 1000), // 3 creates per minute
  validateRequest(schemas.createResume),
  resumeController.createResume
);

/**
 * @route   GET /api/v1/resumes
 * @desc    Get all resumes for authenticated user
 * @access  Private
 */
router.get('/',
  authMiddleware,
  validateQuery(schemas.resumeQuery),
  resumeController.getResumes
);

/**
 * @route   GET /api/v1/resumes/:id
 * @desc    Get a specific resume by ID
 * @access  Private
 */
router.get('/:id',
  authMiddleware,
  validateOwnership('resume'),
  resumeController.getResumeById
);

/**
 * @route   PUT /api/v1/resumes/:id
 * @desc    Update a specific resume
 * @access  Private
 */
router.put('/:id',
  authMiddleware,
  validateOwnership('resume'),
  rateLimitByUserFast(6, 60 * 1000), // 6 updates per minute
  validateResumeUpdate,
  resumeController.updateResume
);

/**
 * @route   DELETE /api/v1/resumes/:id
 * @desc    Delete a specific resume (soft delete)
 * @access  Private
 */
router.delete('/:id',
  authMiddleware,
  validateOwnership('resume'),
  resumeController.deleteResume
);

/**
 * @route   POST /api/v1/resumes/:id/duplicate
 * @desc    Create a copy of an existing resume
 * @access  Private
 */
router.post('/:id/duplicate',
  authMiddleware,
  validateOwnership('resume'),
  rateLimitByUser(20, 60 * 60 * 1000), // 20 duplications per hour
  resumeController.duplicateResume
);

/**
 * @route   POST /api/v1/resumes/:id/share
 * @desc    Generate a shareable link for a resume
 * @access  Private
 */
router.post('/:id/share',
  authMiddleware,
  validateOwnership('resume'),
  resumeController.generateShareableLink
);

/**
 * @route   GET /api/v1/resumes/public/:shareId
 * @desc    Get a public resume by share ID
 * @access  Public (Optional Auth for analytics)
 */
router.get('/public/:shareId',
  optionalAuth,
  resumeController.getPublicResume
);

module.exports = router;