const Resume = require('../models/Resume');
const User = require('../models/User');
const mongoose = require('mongoose');

const createResume = async (req, res) => {
  try {
    const { title, template } = req.body;
    const userId = req.user._id;
    
    // Check if user can create more resumes
    if (!req.user.canCreateResume()) {
      return res.status(403).json({
        status: 'error',
        message: 'Resume limit reached for your subscription plan',
        limit: req.user.subscription.features.maxResumes,
        current: req.user.resumes.length
      });
    }
    
    // Create resume with default personal info from user
    const resume = new Resume({
      userId,
      title,
      template: template || req.user.preferences.defaultTemplate,
      personalInfo: {
        fullName: req.user.name,
        email: req.user.email,
        phone: req.user.profile?.phone || '',
        address: req.user.profile?.address || {}
      }
    });
    
    await resume.save();
    
    // Update user's resumes array
    await User.findByIdAndUpdate(userId, {
      $push: { resumes: resume._id }
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Resume created successfully',
      data: {
        resume
      }
    });
    
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getResumes = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 10,
      sort = '-updatedAt',
      template,
      search
    } = req.query;
    
    // Build query
    const query = { userId, isActive: true };
    
    if (template) {
      query.template = template;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'metadata.tags': { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const [resumes, total] = await Promise.all([
      Resume.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Resume.countDocuments(query)
    ]);
    
    // Add completeness percentage to each resume
    const resumesWithCompletion = resumes.map(resume => ({
      ...resume,
      completenessPercentage: calculateCompleteness(resume)
    }));
    
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      data: {
        resumes: resumesWithCompletion,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch resumes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid resume ID'
      });
    }
    
    const resume = await Resume.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }
    
    // Increment view count if this is a view request
    if (req.query.incrementView === 'true') {
      await resume.incrementViews();
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        resume
      }
    });
    
  } catch (error) {
    console.error('Get resume by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid resume ID'
      });
    }
    
    // Remove fields that shouldn't be updated directly
    delete updates.userId;
    delete updates._id;
    delete updates.createdAt;
    delete updates.metadata;
    
    // For drafts, bypass validation to allow incomplete data
    const isDraft = updates.isDraft === true || updates.isDraft === 'true'
    const validationOptions = isDraft ? { new: true, runValidators: false } : { new: true, runValidators: true }
    
    console.log('Updating resume - isDraft:', isDraft, 'runValidators:', validationOptions.runValidators)
    console.log('Updates being applied:', JSON.stringify(updates, null, 2))
    
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId, isActive: true },
      { $set: updates },
      validationOptions
    );
    
    console.log('Updated resume result:', JSON.stringify(resume, null, 2))
    
    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Resume updated successfully',
      data: {
        resume
      }
    });
    
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid resume ID'
      });
    }
    
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId, isActive: true },
      { $set: { isActive: false } },
      { new: true }
    );
    
    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }
    
    // Remove from user's resumes array
    await User.findByIdAndUpdate(userId, {
      $pull: { resumes: id }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Resume deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const duplicateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid resume ID'
      });
    }
    
    // Check if user can create more resumes
    if (!req.user.canCreateResume()) {
      return res.status(403).json({
        status: 'error',
        message: 'Resume limit reached for your subscription plan',
        limit: req.user.subscription.features.maxResumes,
        current: req.user.resumes.length
      });
    }
    
    const originalResume = await Resume.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    if (!originalResume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }
    
    // Create duplicate
    const duplicateData = originalResume.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.title = `${duplicateData.title} (Copy)`;
    duplicateData.metadata = {
      version: 1,
      totalViews: 0,
      totalDownloads: 0
    };
    
    const newResume = new Resume(duplicateData);
    await newResume.save();
    
    // Update user's resumes array
    await User.findByIdAndUpdate(userId, {
      $push: { resumes: newResume._id }
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Resume duplicated successfully',
      data: {
        resume: newResume
      }
    });
    
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to duplicate resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const generateShareableLink = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid resume ID'
      });
    }
    
    const resume = await Resume.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }
    
    await resume.generateShareableLink();
    
    const shareableUrl = `${req.protocol}://${req.get('host')}/api/v1/resumes/public/${resume.metadata.shareableLink}`;
    
    res.status(200).json({
      status: 'success',
      message: 'Shareable link generated successfully',
      data: {
        shareableLink: resume.metadata.shareableLink,
        shareableUrl
      }
    });
    
  } catch (error) {
    console.error('Generate shareable link error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate shareable link',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getPublicResume = async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const resume = await Resume.findOne({
      'metadata.shareableLink': shareId,
      'settings.visibility': { $in: ['public', 'unlisted'] },
      isActive: true
    }).populate('userId', 'name profile.firstName profile.lastName');
    
    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found or not publicly accessible'
      });
    }
    
    // Increment view count
    await resume.incrementViews();
    
    res.status(200).json({
      status: 'success',
      data: {
        resume
      }
    });
    
  } catch (error) {
    console.error('Get public resume error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch public resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to calculate resume completeness
const calculateCompleteness = (resume) => {
  let completedSections = 0;
  const totalSections = 6;
  
  if (resume.personalInfo && resume.personalInfo.fullName && resume.personalInfo.email) {
    completedSections++;
  }
  if (resume.experience && resume.experience.length > 0) {
    completedSections++;
  }
  if (resume.education && resume.education.length > 0) {
    completedSections++;
  }
  if (resume.skills && (resume.skills.technical.length > 0 || resume.skills.soft.length > 0)) {
    completedSections++;
  }
  if (resume.projects && resume.projects.length > 0) {
    completedSections++;
  }
  if (resume.certifications && resume.certifications.length > 0) {
    completedSections++;
  }
  
  return Math.round((completedSections / totalSections) * 100);
};

module.exports = {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  generateShareableLink,
  getPublicResume
};