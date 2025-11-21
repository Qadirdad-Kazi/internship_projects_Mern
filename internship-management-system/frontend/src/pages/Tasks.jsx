import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../utils/api';
import { formatDate, getStatusColor, getPriorityColor, truncateText } from '../utils/helpers';
import { toast } from 'react-toastify';
import {
  FaTasks,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaFlag,
  FaClock,
  FaEye,
  FaStar
} from 'react-icons/fa';
import Loading from '../components/Loading';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 10
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAllTasks(filters);
      setTasks(response.data.tasks || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setModalMode('create');
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalMode('edit');
    setShowTaskModal(true);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setModalMode('view');
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.deleteTask(taskId);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    if (modalMode === 'create') {
      setTasks(prev => [updatedTask, ...prev]);
    } else {
      setTasks(prev => prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      ));
    }
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await tasksAPI.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task._id === taskId ? response.data.task : task
      ));
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const canEditTask = (task) => {
    return isAdmin || task.assignedTo?._id === user?._id;
  };

  const canDeleteTask = (task) => {
    return isAdmin;
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
            <FaTasks className="mr-2" />
            Tasks Management
          </h1>
          <p className="text-muted">
            {isAdmin ? 'Manage and assign tasks to interns' : 'View and update your assigned tasks'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreateTask}
            className="btn btn-primary"
          >
            <FaPlus className="mr-2" />
            Create Task
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
                Search Tasks
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
                <FaFilter className="mr-1" />
                Status
              </label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">
                <FaFlag className="mr-1" />
                Priority
              </label>
              <select
                className="form-select"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">
            Tasks ({pagination.totalTasks || 0})
          </h3>
        </div>
        <div className="card-body">
          {tasks.length === 0 ? (
            <div className="text-center text-muted py-5">
              <FaTasks size={48} className="mb-3 opacity-25" />
              <h4>No tasks found</h4>
              <p>
                {isAdmin 
                  ? 'Create your first task to get started.' 
                  : 'No tasks have been assigned to you yet.'
                }
              </p>
              {isAdmin && (
                <button
                  onClick={handleCreateTask}
                  className="btn btn-primary"
                >
                  <FaPlus className="mr-2" />
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Task Details</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id}>
                        <td>
                          <div>
                            <div className="font-weight-bold mb-1">
                              {task.title}
                            </div>
                            <div className="text-muted small">
                              {truncateText(task.description, 100)}
                            </div>
                            {task.estimatedHours && (
                              <div className="text-muted small mt-1">
                                <FaClock className="mr-1" />
                                Est: {task.estimatedHours}h
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {task.assignedTo ? (
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
                                {task.assignedTo.firstName?.charAt(0)}
                                {task.assignedTo.lastName?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-weight-bold">
                                  {task.assignedTo.firstName} {task.assignedTo.lastName}
                                </div>
                                <small className="text-muted">
                                  {task.assignedTo.email}
                                </small>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted">Unassigned</span>
                          )}
                        </td>
                        <td>
                          {canEditTask(task) ? (
                            <select
                              className={`form-select form-select-sm badge-${getStatusColor(task.status)}`}
                              value={task.status}
                              onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                              style={{ minWidth: '120px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="review">Under Review</option>
                              <option value="completed">Completed</option>
                              {isAdmin && <option value="rejected">Rejected</option>}
                            </select>
                          ) : (
                            <span className={`badge badge-${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge priority-${task.priority}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="mr-1 text-muted" size={12} />
                            <span className={task.isOverdue ? 'text-danger' : ''}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                            <button
                              onClick={() => handleViewTask(task)}
                              className="btn btn-sm btn-outline-primary"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {canEditTask(task) && (
                              <button
                                onClick={() => handleEditTask(task)}
                                className="btn btn-sm btn-outline-warning"
                                title="Edit Task"
                              >
                                <FaEdit />
                              </button>
                            )}
                            {canDeleteTask(task) && (
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete Task"
                              >
                                <FaTrash />
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
                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.totalTasks)} of {pagination.totalTasks} tasks
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

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          mode={modalMode}
          onSave={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default Tasks;