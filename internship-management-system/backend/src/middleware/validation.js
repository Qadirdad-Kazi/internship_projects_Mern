const Joi = require('joi');

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    department: Joi.string().max(100),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/),
    role: Joi.string().valid('admin', 'intern'),
    skills: Joi.array().items(Joi.string().max(50)),
    bio: Joi.string().max(500),
    endDate: Joi.date().greater('now')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

const validateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().max(2000).required(),
    assignedTo: Joi.string().required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    category: Joi.string().max(100),
    tags: Joi.array().items(Joi.string().max(50)),
    dueDate: Joi.date().greater('now').required(),
    estimatedHours: Joi.number().min(0.5).max(200),
    requirements: Joi.array().items(Joi.string().max(500)),
    deliverables: Joi.array().items(Joi.string().max(500))
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

const validateProgress = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().required(),
    title: Joi.string().max(200).required(),
    description: Joi.string().max(2000).required(),
    progressPercentage: Joi.number().min(0).max(100).required(),
    hoursWorked: Joi.number().min(0).required(),
    status: Joi.string().valid('working', 'blocked', 'completed', 'needs-review'),
    achievements: Joi.array().items(Joi.string().max(300)),
    challenges: Joi.array().items(Joi.string().max(300)),
    nextSteps: Joi.array().items(Joi.string().max(300)),
    blockers: Joi.array().items(Joi.object({
      issue: Joi.string().max(500).required(),
      severity: Joi.string().valid('low', 'medium', 'high', 'critical')
    }))
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateTask,
  validateProgress
};