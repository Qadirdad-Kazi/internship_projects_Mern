import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressAPI, tasksAPI } from '../utils/api';
import { formatDate, formatDateTime, getStatusColor, truncateText } from '../utils/helpers';
import { toast } from 'react-toastify';
import {
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaTasks,
  FaClock,
  FaUser,
  FaThumbsUp
} from 'react-icons/fa';
import Loading from '../components/Loading';
import ProgressModal from '../components/ProgressModal';

const Progress = () => {
  const { user, isAdmin } = useAuth();
  const [progressRecords, setProgressRecords] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    taskId: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  useEffect(() => {
    fetchProgress();
    if (isAdmin) {
      fetchTasks();
    } else {
      fetchUserTasks();
    }
  }, [filters]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getAllProgress(filters);
      setProgressRecords(response.data.progress || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to fetch progress records');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getAllTasks({ limit: 100 });
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUserTasks = async () => {
    try {
      const response = await tasksAPI.getAllTasks({ 
        assignedTo: user._id,
        limit: 100 
      });
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleCreateProgress = () => {
    setSelectedProgress(null);
    setModalMode('create');
    setShowProgressModal(true);
  };

  const handleEditProgress = (progress) => {
    setSelectedProgress(progress);
    setModalMode('edit');
    setShowProgressModal(true);
  };

  const handleViewProgress = (progress) => {
    setSelectedProgress(progress);
    setModalMode('view');
    setShowProgressModal(true);
  };

  const handleDeleteProgress = async (progressId) => {
    if (!window.confirm('Are you sure you want to delete this progress record?')) {
      return;
    }

    try {
      await progressAPI.deleteProgress(progressId);
      toast.success('Progress record deleted successfully');
      fetchProgress();
    } catch (error) {
      console.error('Error deleting progress:', error);
      toast.error('Failed to delete progress record');
    }
  };

  const handleApproveProgress = async (progressId) => {
    try {
      await progressAPI.approveProgress(progressId);
      toast.success('Progress approved successfully');
      fetchProgress();
    } catch (error) {
      console.error('Error approving progress:', error);
      toast.error('Failed to approve progress');
    }
  };

  const handleProgressUpdate = (updatedProgress) => {
    if (modalMode === 'create') {
      setProgressRecords(prev => [updatedProgress, ...prev]);
    } else {
      setProgressRecords(prev => prev.map(progress => 
        progress._id === updatedProgress._id ? updatedProgress : progress
      ));
    }
    setShowProgressModal(false);
    setSelectedProgress(null);
  };

  const canEditProgress = (progress) => {
    return !isAdmin ? progress.user._id === user._id && !progress.approvedBy : true;
  };

  const canDeleteProgress = (progress) => {
    return !isAdmin ? progress.user._id === user._id && !progress.approvedBy : true;
  };

  const getProgressColor = (percentage) => {
    if (percentage < 30) return 'danger';
    if (percentage < 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="card-title">
            <FaChartLine className="mr-2" />
            Progress Tracking
          </h1>
          <p className="text-muted">
            {isAdmin 
              ? 'Monitor intern progress and provide feedback' 
              : 'Track your task progress and submit updates'
            }
          </p>
        </div>
        {!isAdmin && tasks.length > 0 && (
          <button
            onClick={handleCreateProgress}
            className="btn btn-primary"
          >
            <FaPlus className="mr-2" />
            Submit Progress
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="form-group mb-0">
              <label className="form-label">
                <FaSearch className="mr-1" />
                Search Progress
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">
                <FaTasks className="mr-1" />
                Task
              </label>
              <select
                className="form-select"
                value={filters.taskId}
                onChange={(e) => handleFilterChange('taskId', e.target.value)}
              >
                <option value="">All Tasks</option>
                {tasks.map(task => (
                  <option key={task._id} value={task._id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">
                <FaFilter className="mr-1" />
                Status
              </label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="working">Working</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
                <option value="needs-review">Needs Review</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Progress List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">
            Progress Records ({pagination.totalRecords || 0})
          </h3>
        </div>
        <div className="card-body">
          {progressRecords.length === 0 ? (
            <div className="text-center text-muted py-5">
              <FaChartLine size={48} className="mb-3 opacity-25" />
              <h4>No progress records found</h4>
              <p>
                {isAdmin 
                  ? 'Interns haven\'t submitted any progress yet.' 
                  : 'You haven\'t submitted any progress reports yet.'
                }
              </p>
              {!isAdmin && tasks.length > 0 && (
                <button
                  onClick={handleCreateProgress}
                  className="btn btn-primary"
                >
                  <FaPlus className="mr-2" />
                  Submit Your First Progress
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Progress Details</th>
                      <th>Task</th>
                      <th>User</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressRecords.map((progress) => (
                      <tr key={progress._id}>
                        <td>
                          <div>
                            <div className="font-weight-bold mb-1">
                              {progress.title}
                            </div>
                            <div className="text-muted small">
                              {truncateText(progress.description, 80)}
                            </div>
                            <div className="text-muted small mt-1">
                              <FaClock className="mr-1" />
                              {progress.hoursWorked}h worked
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="font-weight-bold">
                              {progress.task?.title}
                            </div>
                            <small className="text-muted">
                              Due: {formatDate(progress.task?.dueDate)}
                            </small>
                          </div>
                        </td>
                        <td>
                          {progress.user && (
                            <div className="d-flex align-items-center">
                              <div className="mr-2" style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#007bff',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>
                                {progress.user.firstName?.charAt(0)}
                                {progress.user.lastName?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-weight-bold">
                                  {progress.user.firstName} {progress.user.lastName}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <span className="font-weight-bold">
                                {progress.progressPercentage}%
                              </span>
                            </div>
                            <div style={{ 
                              width: '100px', 
                              height: '6px', 
                              backgroundColor: '#e9ecef', 
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div 
                                style={{ 
                                  width: `${progress.progressPercentage}%`, 
                                  height: '100%', 
                                  backgroundColor: getProgressColor(progress.progressPercentage) === 'success' ? '#28a745' : 
                                                    getProgressColor(progress.progressPercentage) === 'warning' ? '#ffc107' : '#dc3545',
                                  transition: 'width 0.3s ease'
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${getStatusColor(progress.status)}`}>
                            {progress.status}
                          </span>
                          {progress.approvedBy && (
                            <div className="mt-1">
                              <FaCheckCircle className="text-success mr-1" size={12} />
                              <small className="text-success">Approved</small>
                            </div>
                          )}
                        </td>
                        <td>
                          <div>
                            {formatDate(progress.submittedAt)}
                          </div>
                          <small className="text-muted">
                            {formatDateTime(progress.submittedAt).split(' ')[1]}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                            <button
                              onClick={() => handleViewProgress(progress)}
                              className="btn btn-sm btn-outline-primary"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {canEditProgress(progress) && (
                              <button
                                onClick={() => handleEditProgress(progress)}
                                className="btn btn-sm btn-outline-warning"
                                title="Edit Progress"
                              >
                                <FaEdit />
                              </button>
                            )}
                            {canDeleteProgress(progress) && (
                              <button
                                onClick={() => handleDeleteProgress(progress._id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete Progress"
                              >
                                <FaTrash />
                              </button>
                            )}
                            {isAdmin && !progress.approvedBy && (
                              <button
                                onClick={() => handleApproveProgress(progress._id)}
                                className="btn btn-sm btn-outline-success"
                                title="Approve Progress"
                              >
                                <FaThumbsUp />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.totalRecords)} of {pagination.totalRecords} records
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </button>
                    <span className="px-3">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <ProgressModal
          isOpen={showProgressModal}
          onClose={() => {
            setShowProgressModal(false);
            setSelectedProgress(null);
          }}
          progress={selectedProgress}
          mode={modalMode}
          tasks={tasks}
          onSave={handleProgressUpdate}
        />
      )}
    </div>
  );
};

export default Progress;