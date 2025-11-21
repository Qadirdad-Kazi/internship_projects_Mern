const mongoose = require('mongoose');
const User = require('./src/models/User');
const Resume = require('./src/models/Resume');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up Resume Builder database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Create database indexes for better performance
    await createIndexes();
    
    // Create sample data (optional)
    await createSampleData();
    
    console.log('✅ Database setup completed successfully!');
    console.log('\n📋 Setup Summary:');
    console.log('- Database indexes created');
    console.log('- Sample user and resume created');
    console.log('- Ready for development');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  console.log('🔍 Creating database indexes...');
  
  // User indexes
  await User.createIndexes();
  
  // Resume indexes
  await Resume.createIndexes();
  
  console.log('✅ Database indexes created');
};

const createSampleData = async () => {
  console.log('👤 Creating sample data...');
  
  // Check if sample user already exists
  const existingUser = await User.findOne({ email: 'demo@resumebuilder.com' });
  
  if (existingUser) {
    console.log('ℹ️  Sample data already exists');
    return;
  }
  
  // Create sample user
  const sampleUser = new User({
    name: 'Demo User',
    email: 'demo@resumebuilder.com',
    password: 'password123',
    profile: {
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567890',
      address: {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      }
    },
    preferences: {
      defaultTemplate: 'modern',
      language: 'en',
      timezone: 'America/Los_Angeles'
    },
    emailVerified: true
  });
  
  await sampleUser.save();
  console.log('✅ Sample user created: demo@resumebuilder.com (password: password123)');
  
  // Create sample resume
  const sampleResume = new Resume({
    userId: sampleUser._id,
    title: 'Software Developer Resume',
    template: 'modern',
    personalInfo: {
      fullName: 'Demo User',
      email: 'demo@resumebuilder.com',
      phone: '+1234567890',
      address: {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      },
      website: 'https://demo-portfolio.com',
      linkedin: 'https://linkedin.com/in/demouser',
      github: 'https://github.com/demouser',
      professionalSummary: 'Experienced software developer with 5+ years of experience in full-stack development. Passionate about creating efficient, scalable solutions and staying up-to-date with the latest technologies.'
    },
    experience: [{
      jobTitle: 'Senior Software Developer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: new Date('2021-01-15'),
      endDate: null,
      isCurrentJob: true,
      description: 'Lead development of web applications using React, Node.js, and MongoDB. Collaborate with cross-functional teams to deliver high-quality software solutions.',
      achievements: [
        'Improved application performance by 40% through code optimization',
        'Led a team of 3 developers on a major product redesign',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker']
    }, {
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'San Jose, CA',
      startDate: new Date('2019-03-01'),
      endDate: new Date('2020-12-31'),
      isCurrentJob: false,
      description: 'Developed and maintained web applications using MERN stack. Worked directly with clients to understand requirements and deliver solutions.',
      achievements: [
        'Built 5+ web applications from scratch',
        'Reduced bug reports by 50% through comprehensive testing',
        'Mentored 2 junior developers'
      ],
      technologies: ['React', 'Express.js', 'MongoDB', 'JavaScript', 'CSS3']
    }],
    education: [{
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2019-05-15'),
      gpa: 3.7,
      honors: ['Magna Cum Laude', 'Dean\'s List'],
      relevantCoursework: [
        'Data Structures and Algorithms',
        'Software Engineering',
        'Database Systems',
        'Web Development'
      ]
    }],
    skills: {
      technical: [
        { name: 'JavaScript', level: 'expert', category: 'programming' },
        { name: 'React', level: 'expert', category: 'framework' },
        { name: 'Node.js', level: 'advanced', category: 'framework' },
        { name: 'MongoDB', level: 'advanced', category: 'database' },
        { name: 'Python', level: 'intermediate', category: 'programming' },
        { name: 'Docker', level: 'intermediate', category: 'tool' },
        { name: 'AWS', level: 'intermediate', category: 'tool' }
      ],
      soft: [
        'Leadership',
        'Problem Solving',
        'Team Collaboration',
        'Project Management',
        'Communication',
        'Mentoring'
      ],
      languages: [
        { language: 'English', proficiency: 'native' },
        { language: 'Spanish', proficiency: 'conversational' }
      ]
    },
    projects: [{
      name: 'Task Management System',
      description: 'A comprehensive task management application with real-time collaboration features, built using MERN stack.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.IO', 'Material-UI'],
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-03-15'),
      url: 'https://taskmanager-demo.com',
      github: 'https://github.com/demouser/task-manager',
      achievements: [
        'Supports real-time collaboration for teams',
        'Integrated with calendar applications',
        'Mobile-responsive design'
      ]
    }, {
      name: 'E-commerce Platform',
      description: 'Full-featured e-commerce platform with payment integration and inventory management.',
      technologies: ['React', 'Express.js', 'PostgreSQL', 'Stripe API', 'Redux'],
      startDate: new Date('2022-06-01'),
      endDate: new Date('2022-11-30'),
      github: 'https://github.com/demouser/ecommerce-platform',
      achievements: [
        'Processed $50K+ in transactions during beta testing',
        'Integrated with multiple payment providers',
        'Automated inventory management system'
      ]
    }],
    certifications: [{
      name: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services',
      dateIssued: new Date('2023-02-15'),
      expirationDate: new Date('2026-02-15'),
      credentialId: 'AWS-CDA-123456789',
      url: 'https://aws.amazon.com/certification/verified/ABC123'
    }, {
      name: 'React Developer Certification',
      issuer: 'Meta',
      dateIssued: new Date('2022-08-10'),
      isLifetime: true,
      credentialId: 'META-REACT-987654321'
    }],
    settings: {
      visibility: 'private',
      theme: {
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        fontFamily: 'Arial',
        fontSize: 12
      },
      sections: {
        showProfilePicture: false,
        showProfessionalSummary: true,
        showExperience: true,
        showEducation: true,
        showSkills: true,
        showProjects: true,
        showCertifications: true,
        showAchievements: false,
        showVolunteerWork: false,
        showReferences: false
      }
    }
  });
  
  await sampleResume.save();
  
  // Update user's resumes array
  await User.findByIdAndUpdate(sampleUser._id, {
    $push: { resumes: sampleResume._id }
  });
  
  console.log('✅ Sample resume created');
};

// Run setup
setupDatabase();