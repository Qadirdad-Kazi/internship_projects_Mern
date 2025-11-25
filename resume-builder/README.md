# Resume Builder with PDF Export

📝 **Professional Resume Builder**  
🔹 **Objective**: Create and export professional resumes with ease and confidence.

## 📌 Key Features
✅ **Dynamic Resume Templates** - Multiple professional templates with real-time preview  
✅ **PDF Export** - High-quality PDF generation with professional formatting  
✅ **User Authentication** - Secure account management with JWT  
✅ **Data Persistence** - Save drafts and manage multiple resumes  
✅ **Responsive Design** - Optimized for desktop and mobile devices  
✅ **Live Preview** - Real-time preview as you type  

## 🚀 Live Demo
- **Frontend**: [Deployed on Netlify](https://your-resume-builder.netlify.app)
- **Backend API**: [Deployed on Vercel](https://your-resume-builder-api.vercel.app)

## 📌 Production Ready
This application is fully configured for production deployment with:
- Environment-based configuration
- Error handling and logging
- Performance optimizations
- Security best practices
- Comprehensive deployment documentation

## 🛠️ Tech Stack
- **Frontend**: React + Vite, React Router, Axios, React Hook Form
- **Backend**: Node.js + Express.js, PDFKit for PDF generation
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Styling**: CSS3 + Modern UI components
- **PDF Generation**: PDFKit, Canvas API for preview

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure
```
resume-builder/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── templates/
│   │   └── utils/
│   └── package.json
└── README.md
```


## 📋 API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/resumes` - Get user resumes
- `POST /api/resumes` - Create resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/pdf` - Generate PDF
- `GET /api/templates` - Get available templates

## 🌟 Key Features
- **Multiple Resume Templates**: Professional, Modern, Creative, Minimal designs
- **Real-time Preview**: See changes as you type
- **PDF Export**: High-quality PDF generation with custom styling
- **Auto-save**: Never lose your work
- **Responsive Design**: Works on all devices
- **Template Customization**: Colors, fonts, layout options
- **Section Management**: Add/remove/reorder resume sections
- **Import/Export**: JSON format for data portability

## 🚀 Deployment

### Quick Deployment
This project is ready for production deployment:

```bash
# Validate environment configuration
node validate-env.js

# Run deployment preparation
./deploy.sh

# Follow the detailed deployment guide
open DEPLOYMENT.md
```

### Deployment Platforms
- **Backend**: Vercel (Serverless Functions)
- **Frontend**: Netlify (Static Site Hosting)
- **Database**: MongoDB Atlas (Cloud Database)

### Environment Variables Required
#### Backend (.env.production)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.netlify.app
NODE_ENV=production
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-api.vercel.app
VITE_APP_NAME=Resume Builder
VITE_APP_VERSION=1.0.0
```

## 📝 Resume Sections
- **Personal Information**: Name, contact, photo
- **Professional Summary**: Brief overview
- **Work Experience**: Job history with details
- **Education**: Academic background
- **Skills**: Technical and soft skills
- **Projects**: Portfolio projects
- **Certifications**: Professional certifications
- **Languages**: Language proficiencies
- **References**: Professional references

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB (local or Atlas)
- Git

### Local Development Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-builder
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Update with your configuration
   ```

4. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend && npm run dev
   
   # Frontend (Terminal 2)
   cd frontend && npm run dev
   ```

### Available Scripts
#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Build for production (if applicable)

#### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📚 Documentation
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) - Comprehensive deployment guide
- [`validate-env.js`](./validate-env.js) - Environment validation script
- [`deploy.sh`](./deploy.sh) - Automated deployment preparation

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- Built with modern React and Node.js best practices
- PDF generation powered by PDFKit
- UI components inspired by modern design principles
- Deployment optimized for Vercel and Netlify platforms

---

**Ready for Production Deployment** 🚀  
Follow the [`DEPLOYMENT.md`](./DEPLOYMENT.md) guide for step-by-step deployment instructions.