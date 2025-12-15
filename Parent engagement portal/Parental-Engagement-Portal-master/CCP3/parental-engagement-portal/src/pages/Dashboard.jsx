import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const studentData = {
    name: "Gautham",
    grade: "12th Grade",
    attendance: "95%",
    nextEvent: "Parent-Teacher Meeting",
    eventDate: "March 25, 2024"
  };

  const recentActivities = [
    { type: 'grade', subject: 'Mathematics', grade: 'A', date: '2024-03-15' },
    { type: 'attendance', status: 'Present', date: '2024-03-14' },
    { type: 'message', from: 'Mrs. Smith', subject: 'Homework Update', date: '2024-03-13' },
    { type: 'event', title: 'Science Fair', date: '2024-03-20' }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'progress', label: 'Progress Reports', icon: '📈', path: '/progress-reports' },
    { id: 'resources', label: 'Resources', icon: '📚', path: '/resources' },
    { id: 'communication', label: 'Communication', icon: '💬', path: '/communication' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/notifications' }
  ];

  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Parent Portal</h2>
          <p>{studentData.name}</p>
          <p>{studentData.grade}</p>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-welcome">
            <h1>Welcome back!</h1>
            <p>Here's your child's progress overview</p>
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
           
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>Attendance</h3>
                <p className="stat-value">{studentData.attendance}</p>
                <p className="stat-trend positive">↑ 2% from last month</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>Next Event</h3>
                <p className="stat-value">{studentData.nextEvent}</p>
                <p className="stat-date">{studentData.eventDate}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>Assignments</h3>
                <p className="stat-value">5 Pending</p>
                <p className="stat-trend">Due this week</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="activities-section">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'grade' && '📚'}
                    {activity.type === 'attendance' && '✓'}
                    {activity.type === 'message' && '💬'}
                    {activity.type === 'event' && '📅'}
                  </div>
                  <div className="activity-details">
                    <h4>
                      {activity.type === 'grade' && `${activity.subject}: ${activity.grade}`}
                      {activity.type === 'attendance' && `Attendance: ${activity.status}`}
                      {activity.type === 'message' && `Message from ${activity.from}`}
                      {activity.type === 'event' && activity.title}
                    </h4>
                    <p>{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;