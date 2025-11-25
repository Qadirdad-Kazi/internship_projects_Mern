const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Query validation failed',
        errors
      });
    }
    
    next();
  };
};

const validateResumeUpdate = (req, res, next) => {
  // Use lenient validation for drafts, strict for published resumes
  const isDraft = req.body.isDraft === true || req.body.isDraft === 'true'
  const schema = isDraft ? schemas.updateResumeDraft : schemas.updateResume
  
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Common validation schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    profile: Joi.object({
      firstName: Joi.string().trim().max(50),
      lastName: Joi.string().trim().max(50),
      phone: Joi.string().trim().pattern(/^[\+]?[1-9][\d]{0,15}$/),
      address: Joi.object({
        street: Joi.string().trim(),
        city: Joi.string().trim(),
        state: Joi.string().trim(),
        zipCode: Joi.string().trim(),
        country: Joi.string().trim()
      }),
      dateOfBirth: Joi.date().iso()
    }),
    preferences: Joi.object({
      defaultTemplate: Joi.string().valid('modern-professional', 'executive-classic', 'minimal-clean', 'creative-portfolio', 'tech-innovator', 'corporate-elite', 'simple-effective', 'design-studio', 'modern', 'classic', 'minimal', 'creative'),
      language: Joi.string().trim(),
      timezone: Joi.string().trim()
    })
  }),

  updatePreferences: Joi.object({
    defaultTemplate: Joi.string().valid('modern-professional', 'executive-classic', 'minimal-clean', 'creative-portfolio', 'tech-innovator', 'corporate-elite', 'simple-effective', 'design-studio', 'modern', 'classic', 'minimal', 'creative'),
    language: Joi.string().trim(),
    timezone: Joi.string().trim()
  }),
  
  // Resume schemas
  createResume: Joi.object({
    title: Joi.string().trim().min(1).max(100).required(),
    template: Joi.string().valid('modern-professional', 'executive-classic', 'minimal-clean', 'creative-portfolio', 'tech-innovator', 'corporate-elite', 'simple-effective', 'design-studio', 'modern', 'classic', 'minimal', 'creative').default('modern-professional')
  }),
  
  updateResumeDraft: Joi.object({
    title: Joi.string().trim().allow(''),
    template: Joi.string().valid('modern-professional', 'executive-classic', 'minimal-clean', 'creative-portfolio', 'tech-innovator', 'corporate-elite', 'simple-effective', 'design-studio', 'modern', 'classic', 'minimal', 'creative'),
    isDraft: Joi.boolean(),
    personalInfo: Joi.object({
      fullName: Joi.string().trim().allow(''),
      email: Joi.string().email().allow('', null),
      phone: Joi.string().trim().allow(''),
      address: Joi.object({
        street: Joi.string().trim().allow(''),
        city: Joi.string().trim().allow(''),
        state: Joi.string().trim().allow(''),
        zipCode: Joi.string().trim().allow(''),
        country: Joi.string().trim().allow('')
      }),
      website: Joi.string().uri().allow('', null),
      linkedin: Joi.string().uri().allow('', null),
      github: Joi.string().uri().allow('', null),  
      portfolio: Joi.string().uri().allow('', null),
      professionalSummary: Joi.string().allow('')
    }),
    experience: Joi.array().items(
      Joi.object({
        jobTitle: Joi.string().trim().allow(''),
        company: Joi.string().trim().allow(''),
        location: Joi.string().trim().allow(''),
        startDate: Joi.date().iso().allow('', null),
        endDate: Joi.date().iso().allow('', null),
        isCurrentJob: Joi.boolean(),
        description: Joi.string().allow(''),
        achievements: Joi.array().items(Joi.string().trim()),
        technologies: Joi.array().items(Joi.string().trim())
      })
    ),
    education: Joi.array().items(Joi.object().unknown()),
    skills: Joi.object().unknown(),
    projects: Joi.array().items(Joi.object().unknown()),
    certifications: Joi.array().items(Joi.object().unknown()),
    settings: Joi.object().unknown()
  }).unknown(),

  updateResume: Joi.object({
    title: Joi.string().trim().min(1).max(100),
    template: Joi.string().valid('modern-professional', 'executive-classic', 'minimal-clean', 'creative-portfolio', 'tech-innovator', 'corporate-elite', 'simple-effective', 'design-studio', 'modern', 'classic', 'minimal', 'creative'),
    personalInfo: Joi.object({
      fullName: Joi.string().trim().allow(''),
      email: Joi.string().email().allow(''),
      phone: Joi.string().trim(),
      address: Joi.object({
        street: Joi.string().trim(),
        city: Joi.string().trim(),
        state: Joi.string().trim(),
        zipCode: Joi.string().trim(),
        country: Joi.string().trim()
      }),
      website: Joi.string().uri().allow(''),
      linkedin: Joi.string().uri().allow(''),
      github: Joi.string().uri().allow(''),
      portfolio: Joi.string().uri().allow(''),
      professionalSummary: Joi.string().max(500)
    }),
    experience: Joi.array().items(
      Joi.object({
        jobTitle: Joi.string().trim().allow(''),
        company: Joi.string().trim().allow(''),
        location: Joi.string().trim(),
        startDate: Joi.date().iso().allow('', null),
        endDate: Joi.date().iso().allow('', null),
        isCurrentJob: Joi.boolean(),
        description: Joi.string().max(1000),
        achievements: Joi.array().items(Joi.string().trim()),
        technologies: Joi.array().items(Joi.string().trim())
      })
    ),
    education: Joi.array().items(
      Joi.object({
        degree: Joi.string().trim().allow(''),
        institution: Joi.string().trim().allow(''),
        location: Joi.string().trim(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')),
        gpa: Joi.number().min(0).max(4),
        honors: Joi.array().items(Joi.string().trim()),
        relevantCoursework: Joi.array().items(Joi.string().trim()),
        isCurrentlyEnrolled: Joi.boolean()
      })
    ),
    skills: Joi.object({
      technical: Joi.array().items(
        Joi.object({
          name: Joi.string().trim().required(),
          level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
          category: Joi.string().valid('programming', 'database', 'framework', 'tool', 'other')
        })
      ),
      soft: Joi.array().items(Joi.string().trim()),
      languages: Joi.array().items(
        Joi.object({
          language: Joi.string().trim().required(),
          proficiency: Joi.string().valid('basic', 'conversational', 'fluent', 'native')
        })
      )
    }),
    projects: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().allow(''),
        description: Joi.string().max(500),
        technologies: Joi.alternatives().try(
          Joi.array().items(Joi.string().trim()),
          Joi.string().trim()
        ),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')),
        url: Joi.string().uri(),
        github: Joi.string().uri(),
        achievements: Joi.array().items(Joi.string().trim()),
        isOngoing: Joi.boolean()
      })
    ),
    certifications: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().required(),
        issuer: Joi.string().trim().required(),
        dateIssued: Joi.date().iso(),
        expirationDate: Joi.date().iso().greater(Joi.ref('dateIssued')),
        credentialId: Joi.string().trim(),
        url: Joi.string().uri(),
        isLifetime: Joi.boolean()
      })
    ),
    settings: Joi.object({
      visibility: Joi.string().valid('private', 'public', 'unlisted'),
      theme: Joi.object({
        primaryColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
        secondaryColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
        fontFamily: Joi.string().valid('Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Calibri'),
        fontSize: Joi.number().min(10).max(16)
      }),
      sections: Joi.object().pattern(
        Joi.string(),
        Joi.boolean()
      )
    })
  }),
  
  // Query schemas
  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'title', '-title'),
    search: Joi.string().trim().max(100)
  }),
  
  resumeQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'title', '-title').default('-updatedAt'),
    template: Joi.string().valid('modern-professional', 'executive-classic', 'minimal-clean', 'creative-portfolio', 'tech-innovator', 'corporate-elite', 'simple-effective', 'design-studio', 'modern', 'classic', 'minimal', 'creative'),
    search: Joi.string().trim().max(100)
  })
};

module.exports = {
  validateRequest,
  validateQuery,
  validateResumeUpdate,
  schemas
};