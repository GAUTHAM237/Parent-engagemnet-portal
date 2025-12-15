import React from "react";
import { useNavigate } from "react-router-dom";
import "./about.css";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📊",
      title: "Progress Tracking",
      description:
        "Monitor your child's academic performance in real-time with detailed progress reports and analytics.",
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description:
        "Stay connected with teachers through our integrated messaging system for seamless communication.",
    },
    {
      icon: "📚",
      title: "Learning Resources",
      description:
        "Access a comprehensive library of educational materials and resources to support your child's learning.",
    },
    {
      icon: "🔔",
      title: "Instant Updates",
      description:
        "Receive timely notifications about assignments, events, and important announcements.",
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Wilson",
      role: "Principal",
      image: "https://via.placeholder.com/150",
      description:
        "Leading our institution with over 15 years of educational experience.",
    },
    {
      name: "Mr. James Thompson",
      role: "Academic Director",
      image: "https://via.placeholder.com/150",
      description: "Overseeing curriculum development and academic excellence.",
    },
    {
      name: "Ms. Emily Parker",
      role: "Parent Coordinator",
      image: "https://via.placeholder.com/150",
      description: "Facilitating parent-school communication and engagement.",
    },
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Parent Portal</h1>
        <p>
          Empowering parents to actively participate in their child's
          educational journey
        </p>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            To create a seamless connection between parents and educators,
            fostering a collaborative environment that enhances student success
            through transparent communication and active engagement.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>What We Offer</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section 
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <h4>{member.role}</h4>
              <p>{member.description}</p>
            </div>
          ))}
        </div>
      </section>*/}

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Get in Touch</h2>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <span className="icon">📍</span>
              <p>123 Education Street, School District, City</p>
            </div>
            <div className="contact-item">
              <span className="icon">📞</span>
              <p>91+ 979008158</p>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <p>dinesh.kumar@gmail.com</p>
            </div>
          </div>
          <button
            className="contact-btn"
            onClick={() => navigate("/communication")}
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
