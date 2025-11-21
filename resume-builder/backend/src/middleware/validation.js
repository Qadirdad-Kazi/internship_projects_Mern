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
      defaultTemplate: Joi.string().valid('modern', 'classic', 'minimal', 'creative'),
      language: Joi.string().trim(),
      timezone: Joi.string().trim()
    })
  }),
  
  // Resume schemas
  createResume: Joi.object({
    title: Joi.string().trim().min(1).max(100).required(),
    template: Joi.string().valid('modern', 'classic', 'minimal', 'creative').default('modern')
  }),
  
  updateResume: Joi.object({
    title: Joi.string().trim().min(1).max(100),
    template: Joi.string().valid('modern', 'classic', 'minimal', 'creative'),
    personalInfo: Joi.object({
      fullName: Joi.string().trim().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().trim(),
      address: Joi.object({
        street: Joi.string().trim(),
        city: Joi.string().trim(),
        state: Joi.string().trim(),
        zipCode: Joi.string().trim(),
        country: Joi.string().trim()
      }),
      website: Joi.string().uri(),
      linkedin: Joi.string().uri(),
      github: Joi.string().uri(),
      portfolio: Joi.string().uri(),
      professionalSummary: Joi.string().max(500)
    }),
    experience: Joi.array().items(
      Joi.object({
        jobTitle: Joi.string().trim().required(),
        company: Joi.string().trim().required(),
        location: Joi.string().trim(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')),
        isCurrentJob: Joi.boolean(),
        description: Joi.string().max(1000),
        achievements: Joi.array().items(Joi.string().trim()),
        technologies: Joi.array().items(Joi.string().trim())
      })
    ),
    education: Joi.array().items(
      Joi.object({
        degree: Joi.string().trim().required(),
        institution: Joi.string().trim().required(),
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
        name: Joi.string().trim().required(),
        description: Joi.string().max(500),
        technologies: Joi.array().items(Joi.string().trim()),
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
    template: Joi.string().valid('modern', 'classic', 'minimal', 'creative'),
    search: Joi.string().trim().max(100)
  })
};

module.exports = {
  validateRequest,
  validateQuery,
  schemas
};