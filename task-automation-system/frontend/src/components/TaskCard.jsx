import React from 'react';

export default function TaskCard({ task, toggleDone }) {
    return (
        <div className={`task-card ${task.status === 'done' ? 'done' : ''}`}>
            <div className="card-header">
                <h3 className="task-title">{task.title}</h3>
                <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.status === 'done'}
                    onChange={() => toggleDone(task)}
                />
            </div>

            {task.description && <p className="task-desc">{task.description}</p>}

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <div className="task-meta">
                    <span>{task.assignedTo}</span>
                    <span>•</span>
                    <span>{new Date(task.dueAt).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
