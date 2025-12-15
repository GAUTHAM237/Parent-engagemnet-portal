import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landingpage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="nav-logo">
          <h1>ParentConnect</h1>
        </div>
        <div className="nav-links">
          <a href="/about">About</a>
         
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
          <button onClick={() => navigate("/signup")} className="signup-btn">
            Sign Up
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to ParentConnect</h1>
            <p>
              Bridging the gap between parents and teachers for better
              education.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="get-started-btn"
            >
              Access Dashboard
            </button>
          </div>
          <div className="hero-image">
            <img
              src="/parental-engagement-header.webp"
              alt="Parent-Teacher Connection"
            />
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Real-time Updates</h3>
            <p>Stay informed about your child's progress instantly.</p>
          </div>
          <div className="feature-card">
            <h3>Direct Communication</h3>
            <p>Easy messaging between parents and teachers.</p>
          </div>
          <div className="feature-card">
            <h3>Progress Tracking</h3>
            <p>Monitor academic performance and attendance.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
           
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
