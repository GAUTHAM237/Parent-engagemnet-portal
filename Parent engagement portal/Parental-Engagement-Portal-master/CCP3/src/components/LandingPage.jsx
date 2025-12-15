import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Parent Portal</h1>
          <p>Your gateway to your child's educational journey</p>
          <Link to="/dashboard" className="cta-button">
            Access Dashboard
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>
              Monitor your child's academic performance and attendance in
              real-time
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Direct Communication</h3>
            <p>
              Connect with teachers and stay updated with important
              announcements
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Learning Resources</h3>
            <p>
              Access educational materials and support your child's learning at
              home
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Event Calendar</h3>
            <p>Stay informed about upcoming school events and activities</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Login</h3>
            <p>Access your secure parent account</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>View Dashboard</h3>
            <p>Get an overview of your child's progress</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Stay Connected</h3>
            <p>Engage with teachers and track activities</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Need Help?</h2>
        <p>Our support team is here to assist you</p>
        <div className="contact-buttons">
          <button className="contact-button">Contact Support</button>
          <button className="contact-button">FAQ</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Parent Portal</h4>
            <p>Empowering parents in education</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@parentportal.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Parent Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
