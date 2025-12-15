import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPaperPlane,
  FaFile,
  FaImage,
  FaUserCircle,
} from "react-icons/fa";
import "./Communication.css";

const Communication = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  
  // Load messages from localStorage on component mount
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        id: 2,
        teacherId: 2,
        messages: [
          { sender: 'teacher', text: 'Hello! Your child has shown great improvement in recent math tests.', time: '10:30 AM' },
          { sender: 'parent', text: 'Thats wonderful news! Weve been practicing at home.', time: '10:35 AM' }
        ]
      }
    ];
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const teachers = [

   
    { id: 2, name: "Mrs. Emily Parker", subject: "English", status: "online" },
    { id: 3, name: "Mr. Robert Brown", subject: "History", status: "away" },
  ];

  const announcements = [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      date: "2025-03-25",
      content:
        "Annual parent-teacher conference scheduled for next week. Please book your slots.",
      priority: "high",
    },
    {
      id: 2,
      title: "Internal Assessment",
      date: "2025-03-20",
      content:
        "Study Well.",
      priority: "medium",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedTeacher) return;

    const newMessage = {
      sender: "parent",
      text: messageInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => {
      const teacherMessages = prevMessages.find(
        (m) => m.teacherId === selectedTeacher.id
      );

      if (teacherMessages) {
        return prevMessages.map((m) =>
          m.teacherId === selectedTeacher.id
            ? { ...m, messages: [...m.messages, newMessage] }
            : m
        );
      } else {
        return [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            teacherId: selectedTeacher.id,
            messages: [newMessage],
          },
        ];
      }
    });

    setMessageInput("");
  };

  return (
    <div className="communication-container">
      <div className="communication-sidebar">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search messages or teachers..." />
        </div>

        <div className="communication-tabs">
          <button
            className={`tab ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
          <button
            className={`tab ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            Announcements
          </button>
        </div>

        {activeTab === "messages" ? (
          <div className="teachers-list">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`teacher-item ${
                  selectedTeacher?.id === teacher.id ? "selected" : ""
                }`}
                onClick={() => setSelectedTeacher(teacher)}
              >
                <FaUserCircle className="teacher-avatar" />
                <div className="teacher-info">
                  <h4>{teacher.name}</h4>
                  <p>{teacher.subject}</p>
                </div>
                <span className={`status-indicator ${teacher.status}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`announcement-item priority-${announcement.priority}`}
              >
                <h4>{announcement.title}</h4>
                <p className="announcement-date">{announcement.date}</p>
                <p className="announcement-content">{announcement.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === "messages" && selectedTeacher && (
        <div className="chat-section">
          <div className="chat-header">
            <div className="chat-teacher-info">
              <FaUserCircle className="teacher-avatar" />
              <div>
                <h3>{selectedTeacher.name}</h3>
                <p>{selectedTeacher.subject} Teacher</p>
              </div>
            </div>
          </div>

          <div className="messages-container">
            {messages
              .find((m) => m.teacherId === selectedTeacher.id)
              ?.messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">{message.time}</span>
                  </div>
                </div>
              ))}
          </div>

          <form className="message-input-form" onSubmit={handleSendMessage}>
            <div className="attachment-buttons">
              <button type="button" title="Attach file">
                <FaFile />
              </button>
              <button type="button" title="Attach image">
                <FaImage />
              </button>
            </div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message here..."
            />
            <button type="submit" className="send-button">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Communication;
