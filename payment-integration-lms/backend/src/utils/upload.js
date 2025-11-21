import multer from 'multer';
import path from 'path';
import { AppError } from '../middleware/error.js';

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'video/mp4': true,
    'video/mpeg': true,
    'video/quicktime': true,
    'application/pdf': true,
    'application/zip': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Please upload images, videos, PDFs, or ZIP files only.', 400), false);
  }
};

// Upload configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE * 1024 * 1024 // Convert MB to bytes
  },
  fileFilter: fileFilter
});

// Cloudinary simulation functions (in production, you'd use actual Cloudinary)
export const uploadToCloudinary = async (filePath, folder = 'general') => {
  // This would be your actual Cloudinary upload logic
  // For now, we'll simulate it
  return {
    url: `https://example.cloudinary.com/${folder}/${path.basename(filePath)}`,
    public_id: `${folder}/${Date.now()}`
  };
};

export const deleteFromCloudinary = async (publicId) => {
  // This would be your actual Cloudinary delete logic
  // For now, we'll simulate it
  return { result: 'ok' };
};

// File validation helpers
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  return allowedTypes.includes(file.mimetype);
};

export const validateVideoFile = (file) => {
  const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
  return allowedTypes.includes(file.mimetype);
};

// Get file size in MB
export const getFileSizeInMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};