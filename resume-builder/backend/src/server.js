const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
app.set('trust proxy', 1); // Trust Vercel proxy for correct IP detection

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Do not rate limit CORS preflight requests
  skip: (req) => req.method === 'OPTIONS'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Explicitly handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));
app.use('/temp', express.static('temp'));

// Root endpoint for Vercel
app.get('/', (req, res) => {
  res.json({
    message: 'Resume Builder API',
    version: '1.0.0',
    documentation: '/health',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      resumes: '/api/v1/resumes',
      pdf: '/api/v1/pdf'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Resume Builder API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/resumes`, resumeRoutes);
app.use(`/api/${apiVersion}/pdf`, pdfRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 'error',
      message: `${field} already exists`
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      dbName: process.env.DB_NAME
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5002;

const startServer = async () => {
  await connectDB();
  
  // For Vercel deployment, just return the app
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    console.log('🚀 Resume Builder Server configured for Vercel');
    return app;
  }
  
  // Start server normally for local development
  app.listen(PORT, () => {
    console.log(`\n🚀 Resume Builder Server running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📊 Database: ${process.env.DB_NAME}`);
  });
};

// Initialize database connection
connectDB().catch(console.error);

// Export the Express app for Vercel serverless functions
module.exports = app;

// Start the server for local development only
if (require.main === module) {
  startServer().catch(console.error);
}