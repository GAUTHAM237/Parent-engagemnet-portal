import React, { useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "academic",
      title: "Math Test Results",
      message: "Your child scored 95% in the recent Mathematics assessment.",
      date: "2024-03-17",
      time: "2:30 PM",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "event",
      title: "Parent-Teacher Meeting",
      message: "Scheduled for March 25th, 2024 at 4:00 PM in Room 201.",
      date: "2024-03-16",
      time: "10:00 AM",
      read: true,
      priority: "medium",
    },
    {
      id: 3,
      type: "attendance",
      title: "Attendance Alert",
      message: "Your child was marked absent for today's morning session.",
      date: "2024-03-15",
      time: "9:15 AM",
      read: false,
      priority: "high",
    },
    {
      id: 4,
      type: "homework",
      title: "New Assignment Posted",
      message: "Science project guidelines have been uploaded.",
      date: "2024-03-14",
      time: "3:45 PM",
      read: true,
      priority: "normal",
    },
    {
      id: 5,
      type: "general",
      title: "School Newsletter",
      message: "March newsletter is now available for viewing.",
      date: "2024-03-13",
      time: "11:00 AM",
      read: true,
      priority: "normal",
    },
  ];

  const filters = [
    { id: "all", label: "All Notifications" },
    { id: "unread", label: "Unread" },
    { id: "academic", label: "Academic" },
    { id: "event", label: "Events" },
    { id: "attendance", label: "Attendance" },
    { id: "homework", label: "Homework" },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    return notification.type === activeFilter;
  });

  const getIcon = (type) => {
    switch (type) {
      case "academic":
        return "📚";
      case "event":
        return "📅";
      case "attendance":
        return "✓";
      case "homework":
        return "📝";
      default:
        return "📢";
    }
  };

  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <div className="header-content">
          <h1>Notifications</h1>
          <p>Stay updated with your child's academic journey</p>
        </div>
        <div className="notification-stats">
          <div className="stat-item">
            <span className="stat-number">
              {notifications.filter((n) => !n.read).length}
            </span>
            <span className="stat-label">Unread</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{notifications.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </header>

      <div className="notifications-filters">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-btn ${
              activeFilter === filter.id ? "active" : ""
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="notifications-list">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${
              notification.read ? "read" : ""
            } priority-${notification.priority}`}
          >
            <div className="notification-icon">
              {getIcon(notification.type)}
            </div>
            <div className="notification-content">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <div className="notification-meta">
                <span className="date">{notification.date}</span>
                <span className="time">{notification.time}</span>
                <span className={`type ${notification.type}`}>
                  {notification.type.charAt(0).toUpperCase() +
                    notification.type.slice(1)}
                </span>
              </div>
            </div>
            {!notification.read && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
