import React, { useState } from 'react';
import { X } from 'lucide-react';
import './TaskModal.css';

const TaskModal = ({ isOpen, onClose, onSubmit, initialStatus = 'todo' }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: initialStatus,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title.trim()) {
            onSubmit(formData);
            setFormData({ title: '', description: '', priority: 'medium', status: initialStatus });
            onClose();
        }
    };

    const handleClose = () => {
        setFormData({ title: '', description: '', priority: 'medium', status: initialStatus });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Create New Task</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Task Title *</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Enter task title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Add task description (optional)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <div className="priority-options">
                            <label className={`priority-option low ${formData.priority === 'low' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="low"
                                    checked={formData.priority === 'low'}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                />
                                <span className="priority-label">Low</span>
                            </label>

                            <label className={`priority-option medium ${formData.priority === 'medium' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="medium"
                                    checked={formData.priority === 'medium'}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                />
                                <span className="priority-label">Medium</span>
                            </label>

                            <label className={`priority-option high ${formData.priority === 'high' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="high"
                                    checked={formData.priority === 'high'}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                />
                                <span className="priority-label">High</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
