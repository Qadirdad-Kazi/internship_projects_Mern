import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../utils/api';
import { formatDate, getStatusColor, capitalize } from '../utils/helpers';
import { toast } from 'react-toastify';
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEye,
  FaUserShield,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCalendarAlt
} from 'react-icons/fa';
import Loading from '../components/Loading';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    department: '',
    page: 1,
    limit: 10
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAllUsers(filters);
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
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

  const handleViewUser = (userData) => {
    setSelectedUser(userData);
    setModalMode('view');
    setShowUserModal(true);
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setModalMode('edit');
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await usersAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await usersAPI.updateUser(userId, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
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
            <FaUsers className="mr-2" />
            User Management
          </h1>
          <p className="text-muted">
            Manage intern accounts, roles, and permissions
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid mb-4">
        <div className="stat-card primary">
          <div className="stat-info">
            <h3>{users.filter(u => u.role === 'intern').length}</h3>
            <p>Total Interns</p>
          </div>
          <div className="stat-icon">
            <FaUserTie />
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-info">
            <h3>{users.filter(u => u.status === 'active').length}</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-icon">
            <FaUsers />
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-info">
            <h3>{users.filter(u => u.role === 'admin').length}</h3>
            <p>Administrators</p>
          </div>
          <div className="stat-icon">
            <FaUserShield />
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-info">
            <h3>{users.filter(u => u.status === 'inactive').length}</h3>
            <p>Inactive Users</p>
          </div>
          <div className="stat-icon">
            <FaUsers />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="form-group mb-0">
              <label className="form-label">
                <FaSearch className="mr-1" />
                Search Users
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">
                <FaUserShield className="mr-1" />
                Role
              </label>
              <select
                className="form-select"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="intern">Intern</option>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">
                <FaBuilding className="mr-1" />
                Department
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by department..."
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">
            Users ({pagination.totalUsers || 0})
          </h3>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <div className="text-center text-muted py-5">
              <FaUsers size={48} className="mb-3 opacity-25" />
              <h4>No users found</h4>
              <p>No users match your current filters.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User Details</th>
                      <th>Contact Info</th>
                      <th>Role & Status</th>
                      <th>Department</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userData) => (
                      <tr key={userData._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="mr-3" style={{
                              width: '45px',
                              height: '45px',
                              borderRadius: '50%',
                              backgroundColor: userData.role === 'admin' ? '#dc3545' : '#007bff',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '16px',
                              fontWeight: 'bold'
                            }}>
                              {userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-weight-bold">
                                {userData.firstName} {userData.lastName}
                              </div>
                              <small className="text-muted">
                                {userData.bio ? userData.bio.substring(0, 50) + '...' : 'No bio provided'}
                              </small>
                              {userData.skills && userData.skills.length > 0 && (
                                <div style={{ marginTop: '4px' }}>
                                  {userData.skills.slice(0, 2).map((skill, index) => (
                                    <span key={index} className="badge badge-secondary mr-1" style={{ fontSize: '10px' }}>
                                      {skill}
                                    </span>
                                  ))}
                                  {userData.skills.length > 2 && (
                                    <span className="text-muted" style={{ fontSize: '10px' }}>
                                      +{userData.skills.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <FaEnvelope className="mr-2 text-muted" size={12} />
                              <span style={{ fontSize: '13px' }}>{userData.email}</span>
                            </div>
                            {userData.phone && (
                              <div className="d-flex align-items-center">
                                <FaPhone className="mr-2 text-muted" size={12} />
                                <span style={{ fontSize: '13px' }}>{userData.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <span className={`badge ${userData.role === 'admin' ? 'badge-danger' : 'badge-primary'} mb-1`}>
                              {userData.role === 'admin' ? 'Administrator' : 'Intern'}
                            </span>
                            <br />
                            <button
                              onClick={() => handleStatusToggle(userData._id, userData.status)}
                              className={`badge badge-${getStatusColor(userData.status)} btn btn-sm`}
                              style={{ border: 'none', cursor: 'pointer' }}
                              disabled={userData._id === user._id}
                              title={userData._id === user._id ? 'Cannot change your own status' : `Click to ${userData.status === 'active' ? 'deactivate' : 'activate'}`}
                            >
                              {capitalize(userData.status)}
                            </button>
                          </div>
                        </td>
                        <td>
                          {userData.department ? (
                            <div>
                              <FaBuilding className="mr-1 text-muted" size={12} />
                              {userData.department}
                            </div>
                          ) : (
                            <span className="text-muted">Not specified</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="mr-1 text-muted" size={12} />
                            {formatDate(userData.startDate || userData.createdAt)}
                          </div>
                          {userData.endDate && (
                            <div className="text-muted small">
                              Ends: {formatDate(userData.endDate)}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                            <button
                              onClick={() => handleViewUser(userData)}
                              className="btn btn-sm btn-outline-primary"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleEditUser(userData)}
                              className="btn btn-sm btn-outline-warning"
                              title="Edit User"
                            >
                              <FaEdit />
                            </button>
                            {userData._id !== user._id && (
                              <button
                                onClick={() => handleDeleteUser(userData._id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete User"
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
                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.totalUsers)} of {pagination.totalUsers} users
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          mode={modalMode}
          onSave={() => {
            setShowUserModal(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

// Simple User Modal Component
const UserModal = ({ isOpen, onClose, user: userData, mode }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <FaUser className="mr-2" />
            {mode === 'view' ? 'User Details' : 'Edit User'}
          </h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4>Personal Information</h4>
              <div className="mb-3">
                <strong>Name:</strong> {userData.firstName} {userData.lastName}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {userData.email}
              </div>
              {userData.phone && (
                <div className="mb-3">
                  <strong>Phone:</strong> {userData.phone}
                </div>
              )}
              <div className="mb-3">
                <strong>Role:</strong> 
                <span className={`badge ${userData.role === 'admin' ? 'badge-danger' : 'badge-primary'} ml-2`}>
                  {userData.role === 'admin' ? 'Administrator' : 'Intern'}
                </span>
              </div>
              <div className="mb-3">
                <strong>Status:</strong> 
                <span className={`badge badge-${getStatusColor(userData.status)} ml-2`}>
                  {capitalize(userData.status)}
                </span>
              </div>
            </div>

            <div>
              <h4>Professional Information</h4>
              {userData.department && (
                <div className="mb-3">
                  <strong>Department:</strong> {userData.department}
                </div>
              )}
              <div className="mb-3">
                <strong>Start Date:</strong> {formatDate(userData.startDate || userData.createdAt)}
              </div>
              {userData.endDate && (
                <div className="mb-3">
                  <strong>End Date:</strong> {formatDate(userData.endDate)}
                </div>
              )}
              {userData.supervisor && (
                <div className="mb-3">
                  <strong>Supervisor:</strong> {userData.supervisor.firstName} {userData.supervisor.lastName}
                </div>
              )}
            </div>
          </div>

          {userData.bio && (
            <div>
              <h4>Bio</h4>
              <p className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                {userData.bio}
              </p>
            </div>
          )}

          {userData.skills && userData.skills.length > 0 && (
            <div>
              <h4>Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {userData.skills.map((skill, index) => (
                  <span key={index} className="badge badge-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;