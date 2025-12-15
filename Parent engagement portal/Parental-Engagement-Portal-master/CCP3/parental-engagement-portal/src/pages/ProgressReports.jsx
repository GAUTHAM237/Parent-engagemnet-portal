import React, { useState } from "react";
import "./ProgressReports.css";

const ProgressReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const subjects = [
    {
      name: "Mathematics",
      grade: "A",
      percentage: 92,
      teacher: "Mrs.Kavya",
      lastUpdated: "2025-03-15",
      assignments: [
        { name: "Algebra Test", score: "95/100", date: "2024-03-10" },
        { name: "Maths Assignment", score: "88/100", date: "2024-03-05" },
        { name: "Homework ", score: "92/100", date: "2024-02-28" },
      ],
    },
    {
      name: "Python",
      grade: "A-",
      percentage: 89,
      teacher: "Mr.Dinesh",
      lastUpdated: "2025-03-14",
      assignments: [
        { name: "Python Lab", score: "90/100", date: "2025-03-16" },
        { name: "Python Test", score: "87/100", date: "2025-03-08" },
        { name: "Python Assignment", score: "91/100", date: "2024-03-01" },
      ],
    },
    {
      name: "AIML",
      grade: "B+",
      percentage: 87,
      teacher: "Ms.Priya",
      lastUpdated: "2025-03-13",
      assignments: [
        { name: "AIML LAB", score: "88/100", date: "2024-03-11" },
        { name: "AIML Assignment", score: "85/100", date: "2024-03-07" },
        { name: "AIML Test", score: "89/100", date: "2024-02-25" },
      ],
    },
  ];

  const periods = [
    { id: "current", label: "Current Term" },
    // { id: "previous", label: "Previous Term" },
    // { id: "yearly", label: "Yearly Overview" },
  ];

  return (
    <div className="progress-reports">
      <header className="progress-header">
        <div>
          <h1>Progress Reports</h1>
          <p>Track academic performance and assignments</p>
        </div>
        <div className="period-selector">
          {periods.map((period) => (
            <button
              key={period.id}
              className={`period-btn ${
                selectedPeriod === period.id ? "active" : ""
              }`}
              onClick={() => setSelectedPeriod(period.id)}
            >
              {period.label}
            </button>
          ))}
        </div>
      </header>

      <div className="overall-progress">
        <div className="progress-card">
          <h3>Overall GPA</h3>
          <div className="grade-circle">9.5</div>
          <p className="trend positive">Good Improvement</p>
        </div>
        <div className="progress-card">
          <h3>Class Rank</h3>
          <div className="rank-circle">5/120</div>
          <p className="trend">Top 5%</p>
        </div>
        <div className="progress-card">
          <h3>Attendance</h3>
          <div className="attendance-circle">95%</div>
          <p className="trend positive"></p>
        </div>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject, index) => (
          <div key={index} className="subject-card">
            <div className="subject-header">
              <div>
                <h3>{subject.name}</h3>
                <p>Teacher: {subject.teacher}</p>
              </div>
              <div className="grade-badge">{subject.grade}</div>
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${subject.percentage}%` }}
              >
                {subject.percentage}%
              </div>
            </div>

            <div className="assignments-list">
              <h4>Recent Assignments</h4>
              {subject.assignments.map((assignment, idx) => (
                <div key={idx} className="assignment-item">
                  <div>
                    <p className="assignment-name">{assignment.name}</p>
                    <span className="assignment-date">{assignment.date}</span>
                  </div>
                  <span className="assignment-score">{assignment.score}</span>
                </div>
              ))}
            </div>

            <div className="subject-footer">
              <span>Last Updated: {subject.lastUpdated}</span>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressReports;
