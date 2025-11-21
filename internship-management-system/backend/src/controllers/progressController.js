const Progress = require('../models/Progress');
const Task = require('../models/Task');

const createProgress = async (req, res) => {
  try {
    const {
      task: taskId,
      title,
      description,
      progressPercentage,
      hoursWorked,
      status,
      achievements,
      challenges,
      nextSteps,
      blockers
    } = req.body;

    // Verify task exists and user is assigned to it
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only submit progress for your own tasks' });
    }

    const progress = new Progress({
      task: taskId,
      user: req.user._id,
      title,
      description,
      progressPercentage,
      hoursWorked,
      status: status || 'working',
      achievements: achievements || [],
      challenges: challenges || [],
      nextSteps: nextSteps || [],
      blockers: blockers || []
    });

    await progress.save();
    await progress.populate([
      { path: 'task', select: 'title description dueDate' },
      { path: 'user', select: 'firstName lastName email' }
    ]);

    // Update task's actual hours
    task.actualHours = (task.actualHours || 0) + hoursWorked;
    
    // Update task status based on progress
    if (progressPercentage === 100) {
      task.status = 'completed';
      task.completedAt = new Date();
    } else if (progressPercentage > 0 && task.status === 'pending') {
      task.status = 'in-progress';
    }

    await task.save();

    res.status(201).json({
      message: 'Progress submitted successfully',
      progress
    });
  } catch (error) {
    console.error('Create progress error:', error);
    res.status(500).json({
      message: 'Server error creating progress',
      error: error.message
    });
  }
};

const getAllProgress = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      taskId,
      userId,
      status,
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (taskId) query.task = taskId;
    if (userId) query.user = userId;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // If user is intern, only show their progress
    if (req.user.role === 'intern') {
      query.user = req.user._id;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Progress.countDocuments(query);

    // Get progress records
    const progressRecords = await Progress.find(query)
      .populate('task', 'title description dueDate priority')
      .populate('user', 'firstName lastName email')
      .populate('feedback.givenBy', 'firstName lastName email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      progress: progressRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({
      message: 'Server error fetching progress',
      error: error.message
    });
  }
};

const getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id)
      .populate('task', 'title description dueDate priority')
      .populate('user', 'firstName lastName email')
      .populate('feedback.givenBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email');

    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Check permissions - interns can only see their own progress
    if (req.user.role === 'intern' && progress.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ progress });
  } catch (error) {
    console.error('Get progress by ID error:', error);
    res.status(500).json({
      message: 'Server error fetching progress',
      error: error.message
    });
  }
};

const updateProgress = async (req, res) => {
  try {
    const progressId = req.params.id;
    const updates = req.body;

    const existingProgress = await Progress.findById(progressId);
    if (!existingProgress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Check permissions - interns can only update their own progress
    if (req.user.role === 'intern') {
      if (existingProgress.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Interns cannot update approved progress
      if (existingProgress.approvedBy) {
        return res.status(403).json({ message: 'Cannot update approved progress' });
      }
    }

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'task', select: 'title description dueDate priority' },
      { path: 'user', select: 'firstName lastName email' },
      { path: 'feedback.givenBy', select: 'firstName lastName email' }
    ]);

    res.json({
      message: 'Progress updated successfully',
      progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      message: 'Server error updating progress',
      error: error.message
    });
  }
};

const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Check permissions
    if (req.user.role === 'intern') {
      if (progress.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Interns cannot delete approved progress
      if (progress.approvedBy) {
        return res.status(403).json({ message: 'Cannot delete approved progress' });
      }
    }

    await Progress.findByIdAndDelete(req.params.id);

    res.json({ message: 'Progress record deleted successfully' });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({
      message: 'Server error deleting progress',
      error: error.message
    });
  }
};

const addFeedbackToProgress = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const progressId = req.params.id;

    const progress = await Progress.findById(progressId);
    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Only admin can add feedback
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can provide feedback' });
    }

    progress.feedback = {
      rating,
      comment,
      givenBy: req.user._id,
      givenAt: new Date()
    };

    await progress.save();
    await progress.populate([
      { path: 'task', select: 'title description dueDate priority' },
      { path: 'user', select: 'firstName lastName email' },
      { path: 'feedback.givenBy', select: 'firstName lastName email' }
    ]);

    res.json({
      message: 'Feedback added successfully',
      progress
    });
  } catch (error) {
    console.error('Add feedback to progress error:', error);
    res.status(500).json({
      message: 'Server error adding feedback',
      error: error.message
    });
  }
};

const approveProgress = async (req, res) => {
  try {
    const progressId = req.params.id;

    const progress = await Progress.findById(progressId);
    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Only admin can approve
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can approve progress' });
    }

    progress.approvedBy = req.user._id;
    progress.approvedAt = new Date();

    await progress.save();
    await progress.populate([
      { path: 'task', select: 'title description dueDate priority' },
      { path: 'user', select: 'firstName lastName email' },
      { path: 'approvedBy', select: 'firstName lastName email' }
    ]);

    res.json({
      message: 'Progress approved successfully',
      progress
    });
  } catch (error) {
    console.error('Approve progress error:', error);
    res.status(500).json({
      message: 'Server error approving progress',
      error: error.message
    });
  }
};

const getProgressByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (req.user.role === 'intern' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const skip = (page - 1) * limit;
    const total = await Progress.countDocuments({ task: taskId });

    const progressRecords = await Progress.find({ task: taskId })
      .populate('user', 'firstName lastName email')
      .populate('feedback.givenBy', 'firstName lastName email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      progress: progressRecords,
      task,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get progress by task error:', error);
    res.status(500).json({
      message: 'Server error fetching progress by task',
      error: error.message
    });
  }
};

module.exports = {
  createProgress,
  getAllProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
  addFeedbackToProgress,
  approveProgress,
  getProgressByTask
};