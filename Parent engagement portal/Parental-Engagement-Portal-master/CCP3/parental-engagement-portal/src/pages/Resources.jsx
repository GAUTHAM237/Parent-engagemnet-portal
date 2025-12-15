import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Resources.css";

const Resources = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Resources" },
    { id: "study", label: "Study Materials" },
    { id: "homework", label: "Homework Help" },
    { id: "exam", label: "Exam Preparation" },
    { id: "extra", label: "Extra Learning" },
  ];

  const resources = [
    {
      id: 1,
      title: "Discrete Mathematics",
      category: "study",
      subject: "Mathematics",
      type: "PDF",
      size: "2.5 MB",
      uploadedBy: "Mrs. Kavya",
      date: "2025-03-15",
      downloads: 125,
      description: "Practice worksheets covering Discrete Mathematics concepts",
    },
    {
      id: 2,
      title: "AIML",
      category: "study",
      subject: "AI",
      type: "PDF",
      size: "1.8 MB",
      uploadedBy: "Mr.Balaraman",
      date: "2025-03-14",
      downloads: 98,
      description: "AI Notes",
    },
    {
      id: 3,
      title: "Python Exam",
      category: "exam",
      subject: "Python",
      type: "PDF",
      size: "3.2 MB",
      uploadedBy: "Ms.Priya",
      date: "2024-03-13",
      downloads: 156,
      description: "Python Notes",
    },
    {
      id: 4,
      title: "Software Engineering",
      category: "extra",
      subject: "Software Engineering",
      type: "PDF",
      uploadedBy: "Mr.Kumar",
      date: "2024-03-12",
      downloads: 87,
      description: "Software Engineering Notes",
    },
    {
      id: 5,
      title: "Aptitude Homework",
      category: "homework",
      subject: "Aptitude",
      type: "PDF",
      size: "1.5 MB",
      uploadedBy: "Mrs. Smith",
      date: "2024-03-11",
      downloads: 234,
      description: "Aptitude Notes",
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const searchFields = [
      resource.title,
      resource.description,
      resource.subject,
      resource.uploadedBy,
      resource.category,
    ].map((field) => (field || "").toLowerCase());

    const searchTerms = searchQuery.toLowerCase().split(" ");

    const matchesSearch = searchTerms.every((term) =>
      searchFields.some((field) => field.includes(term))
    );

    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="resources-container">
      <header className="resources-header">
        <div className="header-content">
          <h1>Educational Resources</h1>
          <p>Access study materials, guides, and learning resources</p>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title, subject, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </header>

      <div className="categories-nav">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="resources-grid">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="resource-icon">
              {resource.type === "PDF" ? "📄" : "🔗"}
            </div>
            <div className="resource-content">
              <h3>{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-meta">
                <span className="subject-tag">{resource.subject}</span>
                <span className="type-tag">{resource.type}</span>
                {resource.size && (
                  <span className="size-tag">{resource.size}</span>
                )}
              </div>
              <div className="resource-footer">
                <div className="resource-info">
                  <p>Uploaded by: {resource.uploadedBy}</p>
                  <p>Date: {resource.date}</p>
                  <p>Downloads: {resource.downloads}</p>
                </div>
                <button className="download-btn">
                  Download
                  <span className="download-icon">⭳</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && searchQuery && (
        <div className="no-results">
          <p>No resources found matching "{searchQuery}"</p>
          <button onClick={() => setSearchQuery("")}>Clear Search</button>
        </div>
      )}
    </div>
  );
};

export default Resources;
