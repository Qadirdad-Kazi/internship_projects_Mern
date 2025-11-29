import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import './App.css';

function App() {
  // Hardcoded project ID for now, in a real app this would come from routing
  const projectId = 'project-1';

  return (
    <div className="app">
      <header className="app-header">
        <h1>Collaborative Project Space</h1>
        <div className="user-avatars">
          {/* Placeholder for user avatars */}
          <div className="avatar">A</div>
          <div className="avatar">B</div>
        </div>
      </header>
      <main>
        <KanbanBoard projectId={projectId} />
      </main>
    </div>
  );
}

export default App;
