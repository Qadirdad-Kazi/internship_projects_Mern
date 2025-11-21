const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      department,
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (department) query.department = new RegExp(department, 'i');
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);

    // Get users
    const users = await User.find(query)
      .populate('supervisor', 'firstName lastName email')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      message: 'Server error fetching users',
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('supervisor', 'firstName lastName email')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      message: 'Server error fetching user',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName',
      'lastName',
      'department',
      'phone',
      'skills',
      'bio',
      'status',
      'endDate',
      'supervisor'
    ];

    // Only admin can update role and status
    if (req.user.role === 'admin') {
      allowedUpdates.push('role', 'status');
    }

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      message: 'Server error updating user',
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Server error deleting user',
      error: error.message
    });
  }
};

const getInterns = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      department,
      supervisor
    } = req.query;

    const query = { role: 'intern' };
    
    if (status) query.status = status;
    if (department) query.department = new RegExp(department, 'i');
    if (supervisor) query.supervisor = supervisor;

    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);

    const interns = await User.find(query)
      .populate('supervisor', 'firstName lastName email')
      .select('-password')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      interns,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalInterns: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get interns error:', error);
    res.status(500).json({
      message: 'Server error fetching interns',
      error: error.message
    });
  }
};

const assignSupervisor = async (req, res) => {
  try {
    const { internId, supervisorId } = req.body;

    // Verify supervisor exists and is admin
    const supervisor = await User.findById(supervisorId);
    if (!supervisor || supervisor.role !== 'admin') {
      return res.status(400).json({ message: 'Invalid supervisor ID' });
    }

    // Update intern
    const intern = await User.findByIdAndUpdate(
      internId,
      { supervisor: supervisorId },
      { new: true }
    ).populate('supervisor', 'firstName lastName email');

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    res.json({
      message: 'Supervisor assigned successfully',
      intern
    });
  } catch (error) {
    console.error('Assign supervisor error:', error);
    res.status(500).json({
      message: 'Server error assigning supervisor',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getInterns,
  assignSupervisor
};