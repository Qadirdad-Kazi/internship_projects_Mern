const Task = require('../models/Task');
const User = require('../models/User');

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      priority,
      category,
      tags,
      dueDate,
      estimatedHours,
      requirements,
      deliverables
    } = req.body;

    // Verify assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority: priority || 'medium',
      category,
      tags: tags || [],
      dueDate,
      estimatedHours,
      requirements: requirements || [],
      deliverables: deliverables || []
    });

    await task.save();
    await task.populate([
      { path: 'assignedTo', select: 'firstName lastName email' },
      { path: 'assignedBy', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      message: 'Server error creating task',
      error: error.message
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      assignedTo,
      assignedBy,
      category,
      search,
      overdue
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (assignedBy) query.assignedBy = assignedBy;
    if (category) query.category = new RegExp(category, 'i');
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'completed' };
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }

    // If user is intern, only show their tasks
    if (req.user.role === 'intern') {
      query.assignedTo = req.user._id;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Task.countDocuments(query);

    // Get tasks
    const tasks = await Task.find(query)
      .populate('assignedTo', 'firstName lastName email')
      .populate('assignedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      message: 'Server error fetching tasks',
      error: error.message
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('assignedBy', 'firstName lastName email')
      .populate('feedback.givenBy', 'firstName lastName email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions - interns can only see their own tasks
    if (req.user.role === 'intern' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({
      message: 'Server error fetching task',
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    let updates = req.body;

    // Find the task first
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (req.user.role === 'intern') {
      // Interns can only update status and actualHours of their own tasks
      if (existingTask.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const allowedUpdates = ['status', 'actualHours'];
      const filteredUpdates = {};
      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });
      updates = filteredUpdates;
    }

    // Set completion date if status is completed
    if (updates.status === 'completed' && existingTask.status !== 'completed') {
      updates.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'assignedTo', select: 'firstName lastName email' },
      { path: 'assignedBy', select: 'firstName lastName email' }
    ]);

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      message: 'Server error updating task',
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only admin or the person who assigned the task can delete it
    if (req.user.role !== 'admin' && task.assignedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      message: 'Server error deleting task',
      error: error.message
    });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only admin can add feedback
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can provide feedback' });
    }

    task.feedback = {
      rating,
      comment,
      givenBy: req.user._id,
      givenAt: new Date()
    };

    await task.save();
    await task.populate([
      { path: 'assignedTo', select: 'firstName lastName email' },
      { path: 'assignedBy', select: 'firstName lastName email' },
      { path: 'feedback.givenBy', select: 'firstName lastName email' }
    ]);

    res.json({
      message: 'Feedback added successfully',
      task
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      message: 'Server error adding feedback',
      error: error.message
    });
  }
};

const getTaskStatistics = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Build base query
    const baseQuery = {};
    if (userId) {
      baseQuery.assignedTo = userId;
    } else if (req.user.role === 'intern') {
      baseQuery.assignedTo = req.user._id;
    }

    const stats = await Task.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$status', 'completed'] }
                  ]
                },
                1,
                0
              ]
            }
          },
          avgEstimatedHours: { $avg: '$estimatedHours' },
          avgActualHours: { $avg: '$actualHours' }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      avgEstimatedHours: 0,
      avgActualHours: 0
    };

    // Calculate completion rate
    result.completionRate = result.totalTasks > 0 
      ? ((result.completedTasks / result.totalTasks) * 100).toFixed(2)
      : 0;

    res.json({ statistics: result });
  } catch (error) {
    console.error('Get task statistics error:', error);
    res.status(500).json({
      message: 'Server error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addFeedback,
  getTaskStatistics
};