import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../utils/api';
import { formatDate, getStatusColor, getPriorityColor } from '../utils/helpers';
import { 
  FaTasks, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown 
} from 'react-icons/fa';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await tasksAPI.getStatistics();
      setStats(statsResponse.data.statistics);

      // Fetch recent tasks
      const tasksResponse = await tasksAPI.getAllTasks({ 
        limit: 5,
        page: 1
      });
      setRecentTasks(tasksResponse.data.tasks || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="card-title">
          {getGreeting()}, {user?.firstName}! 👋
        </h1>
        <p className="text-muted">
          Welcome to your {isAdmin ? 'admin' : 'internship'} dashboard
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-info">
            <h3>{stats?.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-icon">
            <FaTasks />
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-info">
            <h3>{stats?.completedTasks || 0}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-info">
            <h3>{stats?.inProgressTasks || 0}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-icon">
            <FaClock />
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-info">
            <h3>{stats?.overdueTasks || 0}</h3>
            <p>Overdue</p>
          </div>
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {stats && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">
              <FaChartLine className="mr-2" />
              Progress Overview
            </h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Completion Rate</span>
                  <span className="text-primary font-weight-bold">
                    {stats.completionRate}%
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      width: `${stats.completionRate}%`, 
                      height: '100%', 
                      backgroundColor: '#28a745',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Average Hours</span>
                  <span className="text-info font-weight-bold">
                    {stats.avgActualHours?.toFixed(1) || 0}h
                  </span>
                </div>
                <small className="text-muted">
                  Estimated: {stats.avgEstimatedHours?.toFixed(1) || 0}h
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <FaTasks className="mr-2" />
            Recent Tasks
          </h3>
        </div>
        <div className="card-body">
          {recentTasks.length === 0 ? (
            <div className="text-center text-muted py-4">
              <FaTasks size={48} className="mb-3 opacity-25" />
              <p>No tasks available</p>
              {isAdmin && (
                <p>
                  <a href="/tasks" className="btn btn-primary btn-sm">
                    Create Your First Task
                  </a>
                </p>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <div>
                          <div className="font-weight-bold">{task.title}</div>
                          <small className="text-muted">
                            {task.description?.substring(0, 60)}...
                          </small>
                        </div>
                      </td>
                      <td>
                        {task.assignedTo ? (
                          <span>
                            {task.assignedTo.firstName} {task.assignedTo.lastName}
                          </span>
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="mr-1 text-muted" size={12} />
                          {formatDate(task.dueDate)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;