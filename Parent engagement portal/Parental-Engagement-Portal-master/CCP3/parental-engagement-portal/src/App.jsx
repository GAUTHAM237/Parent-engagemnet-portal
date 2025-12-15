import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProgressReports from "./pages/ProgressReports";
import Resources from "./pages/Resources";
import Notifications from "./pages/Notifications";
import Communication from "./pages/Communication";
import Sidebar from "./pages/Sidebar";
import Landingpage from "./pages/Landingpage";
import Dashboard from "./pages/dashboard";
import About from "./pages/about";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Landingpage />} />
              <Route path="/progress-reports" element={<ProgressReports />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sidebar" element={<Sidebar />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
