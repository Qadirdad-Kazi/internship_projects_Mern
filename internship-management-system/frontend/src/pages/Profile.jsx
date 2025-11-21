import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate, validateEmail } from '../utils/helpers';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCalendarAlt,
  FaUserShield,
  FaKey,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    bio: user?.bio || '',
    skills: user?.skills ? user.skills.join(', ') : ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
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

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    setLoading(true);

    try {
      const submitData = {
        ...profileData,
        skills: profileData.skills 
          ? profileData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
          : []
      };

      const result = await updateProfile(submitData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    setLoading(true);

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setActiveTab('profile');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling
      setProfileData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        department: user?.department || '',
        bio: user?.bio || '',
        skills: user?.skills ? user.skills.join(', ') : ''
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="card-title">
          <FaUser className="mr-2" />
          My Profile
        </h1>
        <p className="text-muted">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="card">
        {/* Profile Header */}
        <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="mr-4" style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="mb-1">{user?.firstName} {user?.lastName}</h2>
                <div className="d-flex align-items-center">
                  <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-primary'} mr-2`}>
                    {user?.role === 'admin' ? 'Administrator' : 'Intern'}
                  </span>
                  <span className="text-white opacity-75">
                    <FaEnvelope className="mr-1" size={12} />
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={handleEditToggle}
                className={`btn ${isEditing ? 'btn-outline' : 'btn-primary'}`}
                style={{ 
                  backgroundColor: isEditing ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }}
              >
                {isEditing ? (
                  <>
                    <FaTimes className="mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #ddd' }}>
          <div className="d-flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`btn btn-link ${activeTab === 'profile' ? 'text-primary border-bottom-primary' : 'text-muted'}`}
              style={{ 
                borderRadius: 0, 
                borderBottom: activeTab === 'profile' ? '2px solid #007bff' : 'none',
                paddingBottom: '12px'
              }}
            >
              <FaUser className="mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`btn btn-link ${activeTab === 'security' ? 'text-primary border-bottom-primary' : 'text-muted'}`}
              style={{ 
                borderRadius: 0,
                borderBottom: activeTab === 'security' ? '2px solid #007bff' : 'none',
                paddingBottom: '12px'
              }}
            >
              <FaKey className="mr-2" />
              Security
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 className="mb-3">Personal Information</h4>
                  
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      disabled={!isEditing}
                    />
                    {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      disabled={!isEditing}
                    />
                    {errors.lastName && <div className="form-error">{errors.lastName}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaEnvelope className="mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      disabled={!isEditing}
                    />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaPhone className="mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="form-input"
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Professional Information</h4>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FaBuilding className="mr-1" />
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleProfileChange}
                      className="form-input"
                      disabled={!isEditing}
                      placeholder="e.g., Software Development"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Skills</label>
                    <input
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleProfileChange}
                      className="form-input"
                      disabled={!isEditing}
                      placeholder="e.g., React, Node.js, Python (comma separated)"
                    />
                    <small className="text-muted">Separate skills with commas</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      className="form-textarea"
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  </div>

                  {/* Account Information (Read-only) */}
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h5>Account Information</h5>
                    <div className="mb-2">
                      <strong>Role:</strong> 
                      <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-primary'} ml-2`}>
                        {user?.role === 'admin' ? 'Administrator' : 'Intern'}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>Member Since:</strong> {formatDate(user?.createdAt)}
                    </div>
                    {user?.endDate && (
                      <div className="mb-2">
                        <strong>Internship Ends:</strong> {formatDate(user?.endDate)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="d-flex justify-content-end mt-4" style={{ gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="btn btn-secondary"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h4 className="mb-3">Change Password</h4>
              <div style={{ maxWidth: '400px' }}>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">Current Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`form-input ${errors.newPassword ? 'error' : ''}`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                    ) : (
                      <>
                        <FaKey className="mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </form>

                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196f3' }}>
                  <h5 className="text-primary">Password Requirements</h5>
                  <ul className="mb-0" style={{ paddingLeft: '20px' }}>
                    <li>At least 6 characters long</li>
                    <li>Should include a mix of letters and numbers</li>
                    <li>Avoid using personal information</li>
                    <li>Use a unique password not used elsewhere</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;