import React from 'react';

export default function TaskRow({ task, toggleDone }) {
    return (
        <div className="task-row">
            <input
                type="checkbox"
                className="task-checkbox"
                checked={task.status === 'done'}
                onChange={() => toggleDone(task)}
            />
            <div className="task-content">
                <div className={`task-title ${task.status === 'done' ? 'muted' : ''}`} style={task.status === 'done' ? { textDecoration: 'line-through' } : {}}>
                    {task.title}
                </div>
                {task.description && <div className="task-desc">{task.description}</div>}
                <div className="task-meta">
                    <span>Assigned to {task.assignedTo}</span>
                    <span>•</span>
                    <span>Due {new Date(task.dueAt).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
