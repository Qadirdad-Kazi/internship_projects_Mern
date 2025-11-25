# Resume Builder with PDF Export

📝 **Intern Resume Builder**  
🔹 **Objective**: Empower interns to create and export professional resumes effortlessly.

## 📌 Task Deliverables
✅ **Frontend (React)**: Develop dynamic resume templates for easy customization  
✅ **Backend (Node/Express)**: Utilize PDFKit to generate and export resumes as PDFs  

## 📌 Features
✅ **Customizable resume templates** with sections for skills, experience, and education  
✅ **One-click PDF export** for quick and convenient downloads  

## 📌 Outcome
A seamless resume-building solution, enabling interns to create polished, professional resumes with ease.

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