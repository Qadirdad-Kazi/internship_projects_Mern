# Payment Integration LMS

A comprehensive Learning Management System with integrated PayPal and Stripe payment processing, built with the MERN stack.

![Payment Integration LMS](https://img.shields.io/badge/Payment%20LMS-MERN%20Stack-blue?style=for-the-badge)
![PayPal](https://img.shields.io/badge/PayPal-Integrated-00457C?style=flat&logo=paypal)
![Stripe](https://img.shields.io/badge/Stripe-Integrated-635BFF?style=flat&logo=stripe)

## 🚀 Features

### 💳 **Payment Integration**
- **PayPal Integration**: Secure PayPal payments for courses and subscriptions
- **Stripe Integration**: Credit/debit card payments with Stripe Checkout
- **Subscription Management**: Recurring premium subscriptions with automatic renewal
- **Secure Transactions**: PCI-compliant payment processing with webhook verification

### 🎓 **Learning Management**
- **Course Catalog**: Browse courses by category, level, and pricing
- **Premium Access**: Subscription-based access to exclusive content
- **Progress Tracking**: Monitor learning progress across enrolled courses
- **Certificates**: Generate completion certificates for finished courses

### 👥 **User Management**
- **Role-Based Access**: Student, Instructor, and Admin roles
- **User Profiles**: Customizable profiles with avatar support
- **Authentication**: Secure JWT-based authentication with email verification

### 📊 **Admin Dashboard**
- **User Analytics**: Comprehensive user statistics and growth metrics
- **Payment Tracking**: Real-time payment monitoring and refund management
- **Course Management**: Full CRUD operations for course content
- **Revenue Reports**: Detailed financial reporting and analytics

## 🛠️ Tech Stack

### **Backend**
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **PayPal REST SDK** for PayPal integration
- **Stripe SDK** for Stripe payments
- **Winston** for logging
- **Multer** for file uploads
- **Nodemailer** for email services

### **Frontend**
- **React 18** with hooks and context
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **Axios** for API requests

## 📁 Project Structure

```
payment-integration-lms/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and payment configuration
│   │   ├── controllers/    # Route controllers (auth, courses, payments)
│   │   ├── middleware/     # Authentication and error handling
│   │   ├── models/         # MongoDB schemas (User, Course, Payment)
│   │   ├── routes/         # API route definitions
│   │   └── utils/          # Utilities (JWT, email, upload, seeder)
│   ├── logs/              # Application logs
│   ├── public/uploads/    # File upload directory
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Frontend utilities (API client)
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- PayPal Developer Account
- Stripe Account

### 1. Clone Repository
```bash
git clone https://github.com/Qadirdad-Kazi/payment-integration-lms.git
cd payment-integration-lms
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Configure your environment variables in .env
# - MongoDB connection string
# - PayPal client ID and secret
# - Stripe secret key and webhook secret
# - JWT secret and email configuration
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Copy environment template
cp .env.example .env

# Configure your environment variables in .env
# - API URL (backend endpoint)
# - PayPal client ID
# - Stripe publishable key
```

### 4. Database Seeding
```bash
cd backend
npm run seed -i  # Import sample data
```

### 5. Start Development Servers
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@paymentlms.com | admin123 |
| Instructor | instructor@paymentlms.com | instructor123 |
| Student | student@paymentlms.com | student123 |

## 💳 Payment Configuration

### PayPal Setup
1. Create PayPal Developer Account
2. Create new application for sandbox/live
3. Copy Client ID and Client Secret to `.env`
4. Configure webhook endpoints for payment notifications

### Stripe Setup  
1. Create Stripe Account
2. Get publishable and secret keys
3. Configure webhook endpoint: `/api/payments/webhooks/stripe`
4. Add webhook secret to environment variables

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/payment_lms
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Instructor/Admin)
- `POST /api/courses/:id/purchase` - Purchase course

### Payments
- `POST /api/payments/paypal/create` - Create PayPal payment
- `POST /api/payments/stripe/create-checkout` - Create Stripe session
- `POST /api/payments/webhooks/stripe` - Stripe webhook handler
- `GET /api/payments/history` - Payment history

### Subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions/create` - Create subscription
- `PUT /api/subscriptions/cancel` - Cancel subscription

## 🎯 Key Features Implemented

### ✅ Payment Processing
- Multi-gateway support (PayPal + Stripe)
- Secure webhook handling and verification
- Automatic enrollment after successful payment
- Refund management system

### ✅ Subscription System
- Monthly premium subscriptions
- Automatic access control
- Subscription renewal and cancellation
- Prorated upgrades and downgrades

### ✅ Course Management
- Free, paid, and premium course tiers
- Video lessons with progress tracking
- Course reviews and ratings
- Instructor dashboard for content management

### ✅ User Experience
- Responsive design for all devices
- Real-time payment status updates
- Comprehensive user dashboard
- Email notifications for transactions

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting and request validation
- CORS protection
- Helmet security headers
- Input sanitization and validation
- Secure payment data handling

## 🚀 Deployment

### Backend Deployment
1. Configure production environment variables
2. Set up MongoDB Atlas or production database
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Configure payment webhook URLs

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables for production APIs
4. Update CORS origins in backend configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Qadirdad Kazi**
- GitHub: [@Qadirdad-Kazi](https://github.com/Qadirdad-Kazi)
- Email: qadirdad.kazi@example.com

## 🙏 Acknowledgments

- PayPal Developer Documentation
- Stripe API Documentation  
- React and Node.js Communities
- Open Source Contributors

---

**⭐ If this project helped you, please give it a star!**