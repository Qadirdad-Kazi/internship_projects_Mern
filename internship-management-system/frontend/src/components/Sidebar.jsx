import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaTasks,
  FaChartLine,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: <FaHome />,
      label: 'Dashboard',
      roles: ['admin', 'intern']
    },
    {
      path: '/tasks',
      icon: <FaTasks />,
      label: 'Tasks',
      roles: ['admin', 'intern']
    },
    {
      path: '/progress',
      icon: <FaChartLine />,
      label: 'Progress',
      roles: ['admin', 'intern']
    },
    {
      path: '/users',
      icon: <FaUsers />,
      label: 'Users',
      roles: ['admin']
    },
    {
      path: '/profile',
      icon: <FaUser />,
      label: 'Profile',
      roles: ['admin', 'intern']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="sidebar">
      <div className="nav-brand">
        <h2>Internship Hub</h2>
        <p className="text-muted">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</p>
        <small className="badge badge-primary">{user?.role?.toUpperCase()}</small>
      </div>

      <nav>
        <ul className="nav-menu">
          {filteredMenuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;