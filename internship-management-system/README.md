# Internship Management System

🔹 **Objective**: Developed a full-stack system to efficiently manage and track intern progress.

## 📌 Task Deliverables
✅ **Frontend (React)**: Created a dashboard for both interns and admins  
✅ **Backend (Node/Express)**: Implemented CRUD operations for intern profiles, tasks, and progress tracking  
✅ **Database (MongoDB)**: Store intern data, feedback, and deadlines securely  

## 📌 Features
✅ **Admin Login** for intern onboarding and task management  
✅ **Intern Dashboard** to view tasks, submit work, and track progress in real-time  

## 📌 Outcome
A streamlined system to enhance intern tracking and improve operational efficiency.

## 🛠️ Tech Stack
- **Frontend**: React + Vite, React Router, Axios
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Styling**: CSS3 + Modern UI components

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
internship-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🔐 Default Admin Credentials
- **Email**: admin@internship.com
- **Password**: admin123

## 📋 API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users` - Get all users
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/progress` - Submit progress

## 🌟 Key Features
- Role-based authentication (Admin/Intern)
- Real-time task management
- Progress tracking and feedback
- Secure data storage
- Responsive design
- CRUD operations for all entities