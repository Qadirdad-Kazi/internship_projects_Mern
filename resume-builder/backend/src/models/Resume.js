const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  template: {
    type: String,
    enum: ['modern', 'classic', 'minimal', 'creative'],
    default: 'modern'
  },
  personalInfo: {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    website: String,
    linkedin: String,
    github: String,
    portfolio: String,
    profilePicture: String,
    professionalSummary: {
      type: String,
      maxlength: [500, 'Professional summary cannot exceed 500 characters']
    }
  },
  experience: [{
    jobTitle: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    location: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isCurrentJob: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      maxlength: [1000, 'Job description cannot exceed 1000 characters']
    },
    achievements: [String],
    technologies: [String]
  }],
  education: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    location: String,
    startDate: Date,
    endDate: Date,
    gpa: {
      type: Number,
      min: 0,
      max: 4
    },
    honors: [String],
    relevantCoursework: [String],
    isCurrentlyEnrolled: {
      type: Boolean,
      default: false
    }
  }],
  skills: {
    technical: [{
      name: {
        type: String,
        required: true
      },
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
      },
      category: {
        type: String,
        enum: ['programming', 'database', 'framework', 'tool', 'other'],
        default: 'other'
      }
    }],
    soft: [String],
    languages: [{
      language: {
        type: String,
        required: true
      },
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native'],
        default: 'conversational'
      }
    }]
  },
  projects: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Project description cannot exceed 500 characters']
    },
    technologies: [String],
    startDate: Date,
    endDate: Date,
    url: String,
    github: String,
    achievements: [String],
    isOngoing: {
      type: Boolean,
      default: false
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuer: {
      type: String,
      required: true,
      trim: true
    },
    dateIssued: Date,
    expirationDate: Date,
    credentialId: String,
    url: String,
    isLifetime: {
      type: Boolean,
      default: false
    }
  }],
  achievements: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    date: Date,
    category: {
      type: String,
      enum: ['academic', 'professional', 'volunteer', 'personal', 'other'],
      default: 'other'
    }
  }],
  volunteerWork: [{
    organization: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    startDate: Date,
    endDate: Date,
    description: String,
    isOngoing: {
      type: Boolean,
      default: false
    }
  }],
  references: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: String,
    company: String,
    email: String,
    phone: String,
    relationship: {
      type: String,
      enum: ['supervisor', 'colleague', 'client', 'professor', 'mentor', 'other'],
      default: 'other'
    }
  }],
  customSections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  settings: {
    visibility: {
      type: String,
      enum: ['private', 'public', 'unlisted'],
      default: 'private'
    },
    allowPDFDownload: {
      type: Boolean,
      default: true
    },
    theme: {
      primaryColor: {
        type: String,
        default: '#2563eb'
      },
      secondaryColor: {
        type: String,
        default: '#64748b'
      },
      fontFamily: {
        type: String,
        enum: ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Calibri'],
        default: 'Arial'
      },
      fontSize: {
        type: Number,
        min: 10,
        max: 16,
        default: 12
      }
    },
    sections: {
      showProfilePicture: {
        type: Boolean,
        default: true
      },
      showProfessionalSummary: {
        type: Boolean,
        default: true
      },
      showExperience: {
        type: Boolean,
        default: true
      },
      showEducation: {
        type: Boolean,
        default: true
      },
      showSkills: {
        type: Boolean,
        default: true
      },
      showProjects: {
        type: Boolean,
        default: true
      },
      showCertifications: {
        type: Boolean,
        default: true
      },
      showAchievements: {
        type: Boolean,
        default: false
      },
      showVolunteerWork: {
        type: Boolean,
        default: false
      },
      showReferences: {
        type: Boolean,
        default: false
      }
    }
  },
  metadata: {
    version: {
      type: Number,
      default: 1
    },
    totalViews: {
      type: Number,
      default: 0
    },
    totalDownloads: {
      type: Number,
      default: 0
    },
    lastExported: Date,
    shareableLink: String,
    tags: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
resumeSchema.index({ userId: 1 });
resumeSchema.index({ title: 1 });
resumeSchema.index({ createdAt: -1 });
resumeSchema.index({ 'settings.visibility': 1 });
resumeSchema.index({ 'metadata.shareableLink': 1 });

// Virtual for resume completeness percentage
resumeSchema.virtual('completenessPercentage').get(function() {
  let completedSections = 0;
  const totalSections = 6; // personalInfo, experience, education, skills, projects, certifications
  
  if (this.personalInfo && this.personalInfo.fullName && this.personalInfo.email) {
    completedSections++;
  }
  if (this.experience && this.experience.length > 0) {
    completedSections++;
  }
  if (this.education && this.education.length > 0) {
    completedSections++;
  }
  if (this.skills && (this.skills.technical.length > 0 || this.skills.soft.length > 0)) {
    completedSections++;
  }
  if (this.projects && this.projects.length > 0) {
    completedSections++;
  }
  if (this.certifications && this.certifications.length > 0) {
    completedSections++;
  }
  
  return Math.round((completedSections / totalSections) * 100);
});

// Method to increment view count
resumeSchema.methods.incrementViews = function() {
  this.metadata.totalViews += 1;
  return this.save();
};

// Method to increment download count
resumeSchema.methods.incrementDownloads = function() {
  this.metadata.totalDownloads += 1;
  this.metadata.lastExported = new Date();
  return this.save();
};

// Method to generate shareable link
resumeSchema.methods.generateShareableLink = function() {
  const { v4: uuidv4 } = require('uuid');
  this.metadata.shareableLink = uuidv4();
  return this.save();
};

// Pre-save middleware to update version
resumeSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.metadata.version += 1;
  }
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);