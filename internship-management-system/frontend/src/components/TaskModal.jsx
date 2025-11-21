import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, usersAPI } from '../utils/api';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';
import { FaTimes, FaCalendarAlt, FaClock, FaUser, FaFlag, FaTasks } from 'react-icons/fa';

const TaskModal = ({ isOpen, onClose, task, mode, onSave }) => {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    category: '',
    tags: [],
    dueDate: '',
    estimatedHours: '',
    requirements: [],
    deliverables: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' || mode === 'view') {
        setFormData({
          title: task?.title || '',
          description: task?.description || '',
          assignedTo: task?.assignedTo?._id || '',
          priority: task?.priority || 'medium',
          category: task?.category || '',
          tags: task?.tags || [],
          dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          estimatedHours: task?.estimatedHours || '',
          requirements: task?.requirements || [],
          deliverables: task?.deliverables || []
        });
      }
      
      if (isAdmin) {
        fetchUsers();
      }
    }
  }, [isOpen, task, mode, isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getInterns();
      setUsers(response.data.interns || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign this task to someone';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    if (formData.estimatedHours && (formData.estimatedHours < 0.5 || formData.estimatedHours > 200)) {
      newErrors.estimatedHours = 'Estimated hours must be between 0.5 and 200';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim()),
        deliverables: formData.deliverables.filter(del => del.trim()),
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined
      };

      let response;
      if (mode === 'create') {
        response = await tasksAPI.createTask(submitData);
        toast.success('Task created successfully!');
      } else {
        response = await tasksAPI.updateTask(task._id, submitData);
        toast.success('Task updated successfully!');
      }

      onSave(response.data.task);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isReadOnly = isViewMode || !isAdmin;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <FaTasks className="mr-2" />
            {mode === 'create' ? 'Create New Task' : 
             mode === 'edit' ? 'Edit Task' : 'Task Details'}
          </h2>
          <button onClick={onClose} className="modal-close">
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter task title"
                disabled={isReadOnly}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe the task in detail"
                rows="4"
                disabled={isReadOnly}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="mr-1" />
                  Assign To *
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className={`form-select ${errors.assignedTo ? 'error' : ''}`}
                  disabled={isReadOnly}
                >
                  <option value="">Select an intern</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.assignedTo && <div className="form-error">{errors.assignedTo}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaFlag className="mr-1" />
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                  disabled={isReadOnly}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">
                  <FaCalendarAlt className="mr-1" />
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`form-input ${errors.dueDate ? 'error' : ''}`}
                  disabled={isReadOnly}
                />
                {errors.dueDate && <div className="form-error">{errors.dueDate}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaClock className="mr-1" />
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleChange}
                  className={`form-input ${errors.estimatedHours ? 'error' : ''}`}
                  placeholder="e.g., 8"
                  min="0.5"
                  max="200"
                  step="0.5"
                  disabled={isReadOnly}
                />
                {errors.estimatedHours && <div className="form-error">{errors.estimatedHours}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Development, Design"
                  disabled={isReadOnly}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="form-input"
                  placeholder="e.g., React, Frontend, UI (comma separated)"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="form-group">
              <label className="form-label">Requirements</label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="d-flex align-items-center mb-2" style={{ gap: '8px' }}>
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="form-input"
                    placeholder="Enter requirement"
                    disabled={isReadOnly}
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="btn btn-sm btn-outline-primary"
                >
                  Add Requirement
                </button>
              )}
            </div>

            {/* Deliverables */}
            <div className="form-group">
              <label className="form-label">Deliverables</label>
              {formData.deliverables.map((deliverable, index) => (
                <div key={index} className="d-flex align-items-center mb-2" style={{ gap: '8px' }}>
                  <input
                    type="text"
                    value={deliverable}
                    onChange={(e) => handleArrayChange('deliverables', index, e.target.value)}
                    className="form-input"
                    placeholder="Enter deliverable"
                    disabled={isReadOnly}
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('deliverables', index)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => addArrayItem('deliverables')}
                  className="btn btn-sm btn-outline-primary"
                >
                  Add Deliverable
                </button>
              )}
            </div>

            {/* Task Info in View Mode */}
            {isViewMode && task && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4>Task Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div>
                    <strong>Status:</strong> 
                    <span className={`badge badge-${task.status} ml-2`}>
                      {task.status}
                    </span>
                  </div>
                  <div>
                    <strong>Created:</strong> {formatDate(task.createdAt)}
                  </div>
                  {task.assignedBy && (
                    <div>
                      <strong>Assigned By:</strong> {task.assignedBy.firstName} {task.assignedBy.lastName}
                    </div>
                  )}
                  {task.actualHours > 0 && (
                    <div>
                      <strong>Actual Hours:</strong> {task.actualHours}h
                    </div>
                  )}
                  {task.completedAt && (
                    <div>
                      <strong>Completed:</strong> {formatDate(task.completedAt)}
                    </div>
                  )}
                </div>
                {task.feedback?.comment && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Feedback:</strong>
                    <p className="mt-2 p-2" style={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {task.feedback.comment}
                    </p>
                    {task.feedback.rating && (
                      <div>
                        <strong>Rating:</strong> {task.feedback.rating}/5 stars
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            {isViewMode ? 'Close' : 'Cancel'}
          </button>
          {!isViewMode && (
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              ) : (
                mode === 'create' ? 'Create Task' : 'Update Task'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;