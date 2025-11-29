# Collaborative Project Space 🚀

A real-time project collaboration platform for interns to work together seamlessly on shared projects.

## Features

✅ **Kanban-style Project Board** - Drag-and-drop task management  
✅ **Real-time Synchronization** - Live updates using Socket.IO  
✅ **Task Management** - Create, update, and delete tasks  
✅ **Project Milestones** - Track progress effectively  
✅ **Collaborative Environment** - Multiple users can work simultaneously

## Tech Stack

### Frontend
- **React** with Vite
- **@hello-pangea/dnd** for drag-and-drop
- **Socket.IO Client** for real-time updates
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Socket.IO** for WebSocket connections
- **MongoDB** with Mongoose
- **CORS** enabled for cross-origin requests

## Project Structure

```
collaborative-project-space/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   └── package.json
│
└── server/                # Node.js backend
    ├── models/            # Mongoose models
    ├── routes/            # Express routes
    ├── controllers/       # Route controllers
    ├── index.js           # Server entry point
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies (already done if you followed initial setup):
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/collab_project_space
```

4. Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies (already done if you followed initial setup):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. You'll see a Kanban board with three columns: **To Do**, **In Progress**, and **Done**
3. Click "Add Task" to create a new task in any column
4. Drag and drop tasks between columns to update their status
5. Open multiple browser windows to see real-time synchronization in action

## API Endpoints

### Tasks
- `GET /api/tasks/:projectId` - Get all tasks for a project
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Socket.IO Events

- `join_project` - Join a project room
- `task_updated` - Broadcast task updates to all connected clients

## Future Enhancements

- User authentication and authorization
- Multiple projects support
- Task assignment to team members
- Comments and attachments
- Due dates and reminders
- Activity timeline
- Project analytics dashboard

## License

MIT
