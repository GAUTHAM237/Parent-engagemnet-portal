import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaComments, FaBook, FaBell, FaCalendar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <FaHome />
    },
    {
      title: 'Progress Reports',
      path: '/progress-reports',
      icon: <FaChartBar />
    },
    {
      title: 'Communication',
      path: '/communication',
      icon: <FaComments />
    },
    {
      title: 'Resources',
      path: '/resources',
      icon: <FaBook />
    },
    {
      title: 'Notifications',
      path: '/notifications',
      icon: <FaBell />
    },
    {
      title: 'Calendar',
      path: '/calendar',
      icon: <FaCalendar />
    }
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {!isCollapsed && <h2>ParentConnect</h2>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="user-profile">
        <div className="avatar">
          <img 
            src="/images/default-avatar.png" 
            alt="User Avatar"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/40';
            }}
          />
        </div>
        {!isCollapsed && (
          <div className="user-info">
            <h3>John Doe</h3>
            <p>Parent</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={isCollapsed ? item.title : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-title">{item.title}</span>}
            {location.pathname === item.path && (
              <span className="active-indicator" />
            )}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link 
          to="/settings" 
          className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          title={isCollapsed ? 'Settings' : ''}
        >
          <span className="nav-icon"><FaCog /></span>
          {!isCollapsed && <span className="nav-title">Settings</span>}
        </Link>
        
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : ''}
        >
          <span className="nav-icon"><FaSignOutAlt /></span>
          {!isCollapsed && <span className="nav-title">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;