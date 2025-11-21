const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internship_management');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@internship.com' });
    if (existingAdmin) {
      console.log('ℹ️ Default admin user already exists');
      process.exit(0);
    }

    // Create default admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@internship.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      department: 'Administration',
      phone: '+1234567890',
      bio: 'System Administrator for Internship Management System',
      skills: ['Management', 'Leadership', 'System Administration'],
      status: 'active'
    });

    await adminUser.save();
    console.log('✅ Default admin user created successfully');
    console.log('📧 Email: admin@internship.com');
    console.log('🔑 Password: admin123');

    // Create a sample intern user
    const internUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'intern@internship.com',
      password: 'intern123',
      role: 'intern',
      department: 'Software Development',
      phone: '+1234567891',
      bio: 'Software Development Intern passionate about learning new technologies',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    });

    await internUser.save();
    console.log('✅ Sample intern user created successfully');
    console.log('📧 Email: intern@internship.com');
    console.log('🔑 Password: intern123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating default users:', error);
    process.exit(1);
  }
};

createDefaultAdmin();