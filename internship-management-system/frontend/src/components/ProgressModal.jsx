import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FaTimes, FaChartLine, FaClock, FaTasks, FaCheckCircle } from 'react-icons/fa';

const ProgressModal = ({ isOpen, onClose, progress, mode, tasks, onSave }) => {
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    task: '',
    title: '',
    description: '',
    progressPercentage: 0,
    hoursWorked: 0,
    status: 'working',
    achievements: [],
    challenges: [],
    nextSteps: [],
    blockers: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' || mode === 'view') {
        setFormData({
          task: progress?.task?._id || '',
          title: progress?.title || '',
          description: progress?.description || '',
          progressPercentage: progress?.progressPercentage || 0,
          hoursWorked: progress?.hoursWorked || 0,
          status: progress?.status || 'working',
          achievements: progress?.achievements || [],
          challenges: progress?.challenges || [],
          nextSteps: progress?.nextSteps || [],
          blockers: progress?.blockers || []
        });
      } else {
        // Reset form for create mode
        setFormData({
          task: '',
          title: '',
          description: '',
          progressPercentage: 0,
          hoursWorked: 0,
          status: 'working',
          achievements: [],
          challenges: [],
          nextSteps: [],
          blockers: []
        });
      }
    }
  }, [isOpen, progress, mode]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.task) {
      newErrors.task = 'Please select a task';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.progressPercentage < 0 || formData.progressPercentage > 100) {
      newErrors.progressPercentage = 'Progress must be between 0 and 100';
    }

    if (formData.hoursWorked < 0) {
      newErrors.hoursWorked = 'Hours worked cannot be negative';
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
        achievements: formData.achievements.filter(item => item.trim()),
        challenges: formData.challenges.filter(item => item.trim()),
        nextSteps: formData.nextSteps.filter(item => item.trim()),
        blockers: formData.blockers.map(blocker => ({
          issue: blocker.issue || blocker,
          severity: blocker.severity || 'medium'
        })).filter(blocker => blocker.issue.trim())
      };

      let response;
      if (mode === 'create') {
        response = await progressAPI.createProgress(submitData);
        toast.success('Progress submitted successfully!');
      } else {
        response = await progressAPI.updateProgress(progress._id, submitData);
        toast.success('Progress updated successfully!');
      }

      onSave(response.data.progress);
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isReadOnly = isViewMode || (isAdmin && mode !== 'create');
  const selectedTask = tasks.find(task => task._id === formData.task);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <FaChartLine className="mr-2" />
            {mode === 'create' ? 'Submit Progress Report' : 
             mode === 'edit' ? 'Edit Progress Report' : 'Progress Details'}
          </h2>
          <button onClick={onClose} className="modal-close">
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Task Selection */}
            <div className="form-group">
              <label className="form-label">
                <FaTasks className="mr-1" />
                Task *
              </label>
              <select
                name="task"
                value={formData.task}
                onChange={handleChange}
                className={`form-select ${errors.task ? 'error' : ''}`}
                disabled={isReadOnly}
              >
                <option value="">Select a task</option>
                {tasks.map(task => (
                  <option key={task._id} value={task._id}>
                    {task.title} - Due: {new Date(task.dueDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {errors.task && <div className="form-error">{errors.task}</div>}
            </div>

            {/* Progress Title */}
            <div className="form-group">
              <label className="form-label">Progress Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Brief title for this progress update"
                disabled={isReadOnly}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe what you've accomplished, what you're working on, and any issues you're facing..."
                rows="4"
                disabled={isReadOnly}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            {/* Progress Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Progress Percentage *</label>
                <input
                  type="number"
                  name="progressPercentage"
                  value={formData.progressPercentage}
                  onChange={handleChange}
                  className={`form-input ${errors.progressPercentage ? 'error' : ''}`}
                  min="0"
                  max="100"
                  disabled={isReadOnly}
                />
                {errors.progressPercentage && <div className="form-error">{errors.progressPercentage}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaClock className="mr-1" />
                  Hours Worked *
                </label>
                <input
                  type="number"
                  name="hoursWorked"
                  value={formData.hoursWorked}
                  onChange={handleChange}
                  className={`form-input ${errors.hoursWorked ? 'error' : ''}`}
                  min="0"
                  step="0.5"
                  disabled={isReadOnly}
                />
                {errors.hoursWorked && <div className="form-error">{errors.hoursWorked}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  disabled={isReadOnly}
                >
                  <option value="working">Working</option>
                  <option value="blocked">Blocked</option>
                  <option value="completed">Completed</option>
                  <option value="needs-review">Needs Review</option>
                </select>
              </div>
            </div>

            {/* Achievements */}
            <div className="form-group">
              <label className="form-label">Achievements</label>
              <small className="text-muted d-block mb-2">
                List what you've accomplished in this update
              </small>
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="d-flex align-items-center mb-2" style={{ gap: '8px' }}>
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                    className="form-input"
                    placeholder="Enter achievement"
                    disabled={isReadOnly}
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('achievements', index)}
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
                  onClick={() => addArrayItem('achievements')}
                  className="btn btn-sm btn-outline-primary"
                >
                  Add Achievement
                </button>
              )}
            </div>

            {/* Challenges */}
            <div className="form-group">
              <label className="form-label">Challenges & Issues</label>
              <small className="text-muted d-block mb-2">
                Describe any difficulties or roadblocks you've encountered
              </small>
              {formData.challenges.map((challenge, index) => (
                <div key={index} className="d-flex align-items-center mb-2" style={{ gap: '8px' }}>
                  <input
                    type="text"
                    value={challenge}
                    onChange={(e) => handleArrayChange('challenges', index, e.target.value)}
                    className="form-input"
                    placeholder="Describe challenge or issue"
                    disabled={isReadOnly}
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('challenges', index)}
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
                  onClick={() => addArrayItem('challenges')}
                  className="btn btn-sm btn-outline-primary"
                >
                  Add Challenge
                </button>
              )}
            </div>

            {/* Next Steps */}
            <div className="form-group">
              <label className="form-label">Next Steps</label>
              <small className="text-muted d-block mb-2">
                Outline what you plan to work on next
              </small>
              {formData.nextSteps.map((step, index) => (
                <div key={index} className="d-flex align-items-center mb-2" style={{ gap: '8px' }}>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleArrayChange('nextSteps', index, e.target.value)}
                    className="form-input"
                    placeholder="Describe next step"
                    disabled={isReadOnly}
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('nextSteps', index)}
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
                  onClick={() => addArrayItem('nextSteps')}
                  className="btn btn-sm btn-outline-primary"
                >
                  Add Next Step
                </button>
              )}
            </div>

            {/* Task Info in View Mode */}
            {isViewMode && progress && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4>Progress Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div>
                    <strong>Submitted:</strong> {new Date(progress.submittedAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <span className={`badge badge-${progress.status} ml-2`}>
                      {progress.status}
                    </span>
                  </div>
                  {progress.approvedBy && (
                    <>
                      <div>
                        <strong>Approved By:</strong> {progress.approvedBy.firstName} {progress.approvedBy.lastName}
                      </div>
                      <div>
                        <strong>Approved On:</strong> {new Date(progress.approvedAt).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
                
                {progress.feedback?.comment && (
                  <div style={{ marginTop: '15px' }}>
                    <h5>Feedback</h5>
                    <div className="p-3" style={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
                      <p className="mb-2">{progress.feedback.comment}</p>
                      {progress.feedback.rating && (
                        <div>
                          <strong>Rating:</strong> {progress.feedback.rating}/5 stars
                        </div>
                      )}
                      <small className="text-muted">
                        By {progress.feedback.givenBy?.firstName} {progress.feedback.givenBy?.lastName} 
                        on {new Date(progress.feedback.givenAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                )}

                {progress.activeBlockers?.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <h5 className="text-danger">Active Blockers</h5>
                    {progress.activeBlockers.map((blocker, index) => (
                      <div key={index} className="p-2 mb-2" style={{ backgroundColor: '#ffe6e6', borderRadius: '4px', border: '1px solid #ffcccc' }}>
                        <div><strong>Issue:</strong> {blocker.issue}</div>
                        <div><strong>Severity:</strong> {blocker.severity}</div>
                        <small className="text-muted">
                          Reported: {new Date(blocker.reportedAt).toLocaleDateString()}
                        </small>
                      </div>
                    ))}
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
                mode === 'create' ? 'Submit Progress' : 'Update Progress'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;