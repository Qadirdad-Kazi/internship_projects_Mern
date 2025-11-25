import React from 'react';

export default function TaskForm({ form, setForm, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="task-form">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <input
                    placeholder="What needs to be done?"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 3' }}>
                <input
                    placeholder="Description (optional)"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="form-group">
                <select
                    value={form.assignedTo}
                    onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                >
                    <option value="intern">Intern</option>
                    <option value="mentor">Mentor</option>
                </select>
            </div>

            <div className="form-group">
                <input
                    type="datetime-local"
                    value={form.dueAt}
                    onChange={e => setForm({ ...form, dueAt: e.target.value })}
                    required
                />
            </div>

            <button type="submit" className="btn-primary">
                Add Task
            </button>
        </form>
    );
}
