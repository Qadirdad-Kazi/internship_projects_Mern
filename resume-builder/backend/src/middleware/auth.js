const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }
    
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Invalid token format.'
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Token is no longer valid.'
        });
      }
      
      if (!user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'Account has been deactivated.'
        });
      }
      
      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please login again.'
        });
      }
      
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication.'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }
    
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!token) {
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (jwtError) {
      // Ignore JWT errors for optional auth
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

const checkSubscription = (requiredPlan = 'free') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.'
      });
    }
    
    const planHierarchy = {
      'free': 0,
      'premium': 1,
      'enterprise': 2
    };
    
    const userPlanLevel = planHierarchy[req.user.subscription.plan];
    const requiredPlanLevel = planHierarchy[requiredPlan];
    
    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        status: 'error',
        message: `This feature requires ${requiredPlan} subscription.`,
        upgrade: {
          currentPlan: req.user.subscription.plan,
          requiredPlan: requiredPlan
        }
      });
    }
    
    next();
  };
};

// Rate limiter for frequent operations like resume saves
const rateLimitByUserFast = (maxRequests = 10, windowMs = 60 * 1000) => {
  const userRequests = new Map();
  
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }
    
    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }
    
    let requests = userRequests.get(userId);
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    if (requests.length >= maxRequests) {
      return res.status(429).json({
        status: 'error',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 5000 // Fixed 5 second retry for fast operations
      });
    }
    
    requests.push(now);
    userRequests.set(userId, requests);
    
    next();
  };
};

const rateLimitByUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();
  
  // Clean up old entries every 5 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    const cutoff = now - windowMs;
    
    for (const [userId, requests] of userRequests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > cutoff);
      if (validRequests.length === 0) {
        userRequests.delete(userId);
      } else {
        userRequests.set(userId, validRequests);
      }
    }
  }, 5 * 60 * 1000);
  
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }
    
    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }
    
    let requests = userRequests.get(userId);
    // Filter out expired requests
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    if (requests.length >= maxRequests) {
      // Calculate retry after based on oldest request in current window
      const oldestRequest = Math.min(...requests);
      const retryAfterMs = oldestRequest + windowMs - now;
      
      return res.status(429).json({
        status: 'error',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.max(1000, retryAfterMs) // Minimum 1 second
      });
    }
    
    // Add current request
    requests.push(now);
    userRequests.set(userId, requests);
    
    next();
  };
};

const validateOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      let resource;
      
      switch (resourceType) {
        case 'resume':
          const Resume = require('../models/Resume');
          resource = await Resume.findById(resourceId);
          break;
        default:
          return res.status(400).json({
            status: 'error',
            message: 'Invalid resource type.'
          });
      }
      
      if (!resource) {
        return res.status(404).json({
          status: 'error',
          message: `${resourceType} not found.`
        });
      }
      
      if (resource.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: `Access denied. You don't own this ${resourceType}.`
        });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership validation error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error validating resource ownership.'
      });
    }
  };
};

module.exports = {
  authMiddleware,
  optionalAuth,
  checkSubscription,
  rateLimitByUser,
  rateLimitByUserFast,
  validateOwnership
};