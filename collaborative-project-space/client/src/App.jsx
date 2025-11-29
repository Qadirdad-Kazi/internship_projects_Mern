import React, { useState } from 'react';
import KanbanBoard from './components/KanbanBoard';
import MilestoneTracker from './components/MilestoneTracker';
import { LayoutGrid, Target } from 'lucide-react';
import './App.css';

function App() {
  const projectId = 'project-1';
  const [activeTab, setActiveTab] = useState('board');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Collaborative Project Space</h1>
          <p className="header-subtitle">Real-time collaboration for teams</p>
        </div>
        <div className="user-avatars">
          <div className="avatar">A</div>
          <div className="avatar">B</div>
          <div className="avatar-more">+3</div>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'board' ? 'active' : ''}`}
          onClick={() => setActiveTab('board')}
        >
          <LayoutGrid size={18} />
          Task Board
        </button>
        <button
          className={`tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          <Target size={18} />
          Milestones
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'board' && <KanbanBoard projectId={projectId} />}
        {activeTab === 'milestones' && <MilestoneTracker projectId={projectId} />}
      </main>
    </div>
  );
}

export default App;
