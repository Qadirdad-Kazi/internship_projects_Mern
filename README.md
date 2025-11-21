# 🚀 Internship Projects MERN Stack Collection

A comprehensive collection of full-stack MERN (MongoDB, Express.js, React, Node.js) applications designed for internship and learning purposes. This repository contains five distinct projects showcasing different aspects of modern web development, including payment integration, real-time collaboration, and automation systems.

## 📋 Table of Contents

- [Projects Overview](#projects-overview)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Descriptions](#project-descriptions)
- [Installation Guide](#installation-guide)
- [Development Workflow](#development-workflow)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Projects Overview

| Project | Description | Tech Stack | Status |
|---------|-------------|------------|--------|
| [**Payment Integration LMS**](#payment-integration-lms) | Learning Management System with PayPal/Stripe | React, Node.js, PayPal, Stripe, MongoDB | ✅ Complete |
| [**Collaborative Project Space**](#collaborative-project-space) | Real-time project collaboration platform | React, Node.js, Socket.IO, MongoDB | ✅ Active |
| [**Task Automation System**](#task-automation-system) | Intelligent workflow automation tool | React, Node.js, Express, MongoDB | ✅ Active |
| [**Internship Management System**](#internship-management-system) | Complete internship program management | React, Node.js, Express, MongoDB | ✅ Active |
| [**Resume Builder**](#resume-builder) | Professional resume builder with PDF export | React, Node.js, Express, MongoDB | ✅ Active |

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **PayPal React SDK** - PayPal payment integration
- **Stripe React SDK** - Stripe payment processing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Socket.IO** - Real-time communication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **PayPal REST SDK** - PayPal payment processing
- **Stripe SDK** - Stripe payment gateway
- **Nodemailer** - Email service integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands
- **dotenv** - Environment variables

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Clone Repository
```bash
git clone https://github.com/Qadirdad-Kazi/internship_projects_Mern.git
cd internship_projects_Mern
```

### Choose a Project
```bash
# Navigate to desired project
cd collaborative-project-space
# OR
cd task-automation-system
# OR
cd internship-management-system
# OR
cd resume-builder
# OR
cd payment-integration-lms
```

### Install & Run
```bash
# Install backend dependencies
cd backend
npm install
npm run dev

# Install frontend dependencies (new terminal)
cd ../frontend
npm install
npm run dev
```

## 📊 Project Descriptions

### 💳 Payment Integration LMS
**Learning Management System with integrated payment processing**

**Features:**
- 💳 PayPal & Stripe payment integration
- 🎓 Course management system
- 👥 User authentication & authorization
- 📊 Subscription management
- 📈 Payment analytics dashboard
- 🔔 Email notifications
- 📱 Responsive design
- 🛡️ Secure payment processing

**Tech Highlights:**
- Dual payment gateway integration
- JWT-based authentication
- Role-based access control
- Subscription lifecycle management
- Payment webhook handling
- Email verification system

**Ports:**
- Frontend: `http://localhost:5176`
- Backend: `http://localhost:5005`

---

### 🤝 Collaborative Project Space
**Real-time project collaboration platform for teams**

**Features:**
- 📋 Kanban board task management
- 👥 Real-time team collaboration
- 🔄 Live project updates via Socket.IO
- 📈 Project progress tracking
- 🎯 Milestone management
- 💬 Team communication
- 📱 Responsive design

**Tech Highlights:**
- Real-time updates with Socket.IO
- Drag-and-drop task management
- Role-based permissions
- Project analytics dashboard

**Ports:**
- Frontend: `http://localhost:5174`
- Backend: `http://localhost:5003`

---

### ⚙️ Task Automation System
**Intelligent workflow automation and task scheduling**

**Features:**
- 🤖 Automated task execution
- ⏰ Advanced scheduling system
- 📊 Task performance analytics
- 🔔 Smart notifications
- 📋 Workflow templates
- 📈 Progress monitoring
- 🎯 Goal tracking

**Tech Highlights:**
- Cron job scheduling
- Email automation
- Performance metrics
- Workflow builder interface

**Ports:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

---

### 🎓 Internship Management System
**Comprehensive internship program administration**

**Features:**
- 👨‍🎓 Student profile management
- 🏢 Company partnership portal
- 📝 Application processing
- 📊 Performance evaluation
- 📅 Schedule management
- 📋 Document handling
- 🎯 Goal setting & tracking

**Tech Highlights:**
- Multi-role authentication
- Document upload system
- Evaluation workflows
- Reporting dashboard

**Ports:**
- Frontend: `http://localhost:5175`
- Backend: `http://localhost:5004`

---

### 📄 Resume Builder
**Professional resume creation with PDF export**

**Features:**
- 🎨 Multiple professional templates
- 📝 Real-time editing
- 📱 Responsive preview
- 📁 PDF export functionality
- 💾 Cloud storage
- 🔗 Shareable links
- 📊 Analytics tracking

**Tech Highlights:**
- PDF generation with jsPDF
- Template customization
- Real-time preview
- Cloud file storage

**Ports:**
- Frontend: `http://localhost:5172`
- Backend: `http://localhost:5002`

## 📥 Installation Guide

### Method 1: Individual Project Setup

1. **Choose your project:**
   ```bash
   cd [project-name]
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configurations
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Method 2: All Projects Setup

Use the provided setup script (if available):
```bash
./setup-all-projects.sh
```

### Environment Variables

Each project requires specific environment variables:

#### Backend (.env)
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/project_name
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d

# Payment Integration (Payment LMS Project)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Configuration
EMAIL_FROM=your-email@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api/v1
VITE_SOCKET_URL=http://localhost:5001

# Payment Integration (Payment LMS Project)
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 🔄 Development Workflow

### Project Structure
```
internship_projects_Mern/
├── payment-integration-lms/
│   ├── frontend/          # React application with payment UI
│   ├── backend/           # Node.js API with payment processing
│   └── README.md
├── collaborative-project-space/
│   ├── frontend/          # React application
│   ├── backend/           # Node.js API
│   └── README.md
├── task-automation-system/
│   ├── frontend/          # React application
│   ├── backend/           # Node.js API
│   └── README.md
├── internship-management-system/
│   ├── frontend/          # React application
│   ├── backend/           # Node.js API
│   └── README.md
├── resume-builder/
│   ├── frontend/          # React application
│   ├── backend/           # Node.js API
│   └── README.md
└── README.md              # This file
```

### Development Commands

#### Backend Commands
```bash
npm run dev          # Start development server
npm start           # Start production server
npm run seed        # Seed database (if available)
npm test           # Run tests
```

#### Frontend Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## ⭐ Features

### Common Features Across All Projects
- 🔐 **JWT Authentication** - Secure user authentication
- 👥 **Role-based Access** - Different user permissions
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern UI/UX** - Clean, intuitive interfaces
- 📊 **Analytics Dashboard** - Performance tracking
- 🔔 **Real-time Notifications** - Instant updates
- 📁 **File Upload** - Document management
- 🌙 **Dark/Light Mode** - Theme switching
- 🔍 **Search & Filter** - Advanced filtering
- 📈 **Data Visualization** - Charts and graphs

### Project-Specific Features

#### Payment Integration LMS
- Dual payment gateway support (PayPal & Stripe)
- Subscription billing and management
- Secure payment processing with webhooks
- Email automation for transactions
- Course enrollment and access control
- Payment analytics and reporting

#### Collaborative Project Space
- Real-time collaboration with Socket.IO
- Drag-and-drop Kanban boards
- Team chat and communication
- Project timeline visualization

#### Task Automation System
- Cron job scheduling
- Email automation workflows
- Performance analytics
- Custom automation scripts

#### Internship Management System
- Multi-tenant architecture
- Document workflow management
- Evaluation and grading systems
- Academic calendar integration

#### Resume Builder
- PDF generation and export
- Multiple professional templates
- Real-time preview
- ATS-friendly formats

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login
POST /api/v1/auth/logout       # User logout
GET  /api/v1/auth/profile      # Get user profile
PUT  /api/v1/auth/profile      # Update profile
```

### Common Resource Endpoints
```
GET    /api/v1/[resource]           # Get all items
GET    /api/v1/[resource]/:id       # Get single item
POST   /api/v1/[resource]           # Create new item
PUT    /api/v1/[resource]/:id       # Update item
DELETE /api/v1/[resource]/:id       # Delete item
```

### Project-Specific Endpoints
Each project has detailed API documentation in their respective README files.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git fork https://github.com/Qadirdad-Kazi/internship_projects_Mern.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Code Style Guidelines
- Use ESLint and Prettier configurations
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for functions
- Ensure responsive design

### Testing
- Write unit tests for utilities
- Add integration tests for API endpoints
- Test responsive design across devices
- Verify accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MongoDB University** - Database design patterns
- **React Documentation** - Best practices and patterns
- **Node.js Community** - Express.js and ecosystem tools
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO** - Real-time communication

## 📞 Contact & Support

- **Author:** Qadirdad Kazi
- **GitHub:** [@Qadirdad-Kazi](https://github.com/Qadirdad-Kazi)
- **Repository:** [internship_projects_Mern](https://github.com/Qadirdad-Kazi/internship_projects_Mern)

### Getting Help
- 📖 Check project-specific README files
- 🐛 Open an issue for bugs
- 💡 Submit feature requests
- 📧 Contact maintainers

---

## 🎯 Learning Objectives

This repository serves as a comprehensive learning resource for:

- **Full-Stack Development** - MERN stack implementation
- **Real-time Applications** - WebSocket communication
- **Authentication & Security** - JWT, bcrypt, CORS
- **Database Design** - MongoDB schema design
- **API Development** - RESTful API patterns
- **Frontend Architecture** - React component patterns
- **State Management** - Zustand implementation
- **Responsive Design** - Mobile-first approach
- **DevOps Basics** - Environment management
- **Testing Strategies** - Unit and integration testing

---

<div align="center">

**⭐ If you find this project helpful, please consider giving it a star! ⭐**

Made with ❤️ by [Qadirdad Kazi](https://github.com/Qadirdad-Kazi)

</div>