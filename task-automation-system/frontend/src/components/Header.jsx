import React from 'react';

export default function Header({ view, setView }) {
  return (
    <header className="app-header">
      <h1>Task Automation</h1>
      <div className="view-toggle">
        <button 
          type="button" 
          className={view === 'cards' ? 'active' : ''} 
          onClick={() => setView('cards')}
        >
          Cards
        </button>
        <button 
          type="button" 
          className={view === 'list' ? 'active' : ''} 
          onClick={() => setView('list')}
        >
          List
        </button>
      </div>
    </header>
  );
}
