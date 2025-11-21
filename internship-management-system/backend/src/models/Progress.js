const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Progress must be linked to a task']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Progress must be linked to a user']
  },
  title: {
    type: String,
    required: [true, 'Progress title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Progress description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  progressPercentage: {
    type: Number,
    required: [true, 'Progress percentage is required'],
    min: [0, 'Progress cannot be less than 0%'],
    max: [100, 'Progress cannot exceed 100%']
  },
  hoursWorked: {
    type: Number,
    required: [true, 'Hours worked is required'],
    min: [0, 'Hours worked cannot be negative']
  },
  status: {
    type: String,
    enum: ['working', 'blocked', 'completed', 'needs-review'],
    default: 'working'
  },
  blockers: [{
    issue: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Blocker issue cannot be more than 500 characters']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    resolution: {
      type: String,
      maxlength: [1000, 'Resolution cannot be more than 1000 characters']
    }
  }],
  achievements: [{
    type: String,
    trim: true,
    maxlength: [300, 'Achievement cannot be more than 300 characters']
  }],
  challenges: [{
    type: String,
    trim: true,
    maxlength: [300, 'Challenge cannot be more than 300 characters']
  }],
  nextSteps: [{
    type: String,
    trim: true,
    maxlength: [300, 'Next step cannot be more than 300 characters']
  }],
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  screenshots: [{
    fileName: String,
    imageUrl: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [1000, 'Feedback comment cannot be more than 1000 characters']
    },
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    givenAt: Date
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

// Index for better query performance
progressSchema.index({ task: 1, user: 1 });
progressSchema.index({ submittedAt: -1 });
progressSchema.index({ status: 1 });

// Virtual for days since submission
progressSchema.virtual('daysSinceSubmission').get(function() {
  const today = new Date();
  const diffTime = today - this.submittedAt;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for active blockers
progressSchema.virtual('activeBlockers').get(function() {
  return this.blockers.filter(blocker => !blocker.resolvedAt);
});

// Ensure virtual fields are serialized
progressSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Progress', progressSchema);