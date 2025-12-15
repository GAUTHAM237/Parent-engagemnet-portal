const Resource = require("../models/Resource");
const User = require("../models/User");

// Get all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    console.error("Get resources error:", error);
    res
      .status(500)
      .json({ message: "Error fetching resources", error: error.message });
  }
};

// Get resources by category
const getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const resources = await Resource.find({ category })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    console.error("Get resources by category error:", error);
    res
      .status(500)
      .json({ message: "Error fetching resources", error: error.message });
  }
};

// Upload new resource
const uploadResource = async (req, res) => {
  try {
    const { title, description, category, subject, grade } = req.body;
    const uploadedBy = req.user.userId;

    // Handle file upload (assuming file is stored and URL is generated)
    const fileUrl = req.file ? req.file.path : "";
    const fileType = req.file ? req.file.mimetype : "";
    const fileSize = req.file ? req.file.size : 0;

    const resource = new Resource({
      title,
      description,
      category,
      subject,
      grade,
      fileUrl,
      fileType,
      fileSize,
      uploadedBy,
      downloads: 0,
      createdAt: new Date(),
    });

    await resource.save();

    const populatedResource = await Resource.findById(resource._id).populate(
      "uploadedBy",
      "name role"
    );

    res.status(201).json(populatedResource);
  } catch (error) {
    console.error("Upload resource error:", error);
    res
      .status(500)
      .json({ message: "Error uploading resource", error: error.message });
  }
};

// Download resource
const downloadResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    // In a real application, handle file download here
    res.json({ downloadUrl: resource.fileUrl });
  } catch (error) {
    console.error("Download resource error:", error);
    res
      .status(500)
      .json({ message: "Error downloading resource", error: error.message });
  }
};

// Delete resource
const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.userId;

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if user is authorized to delete
    if (
      resource.uploadedBy.toString() !== userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this resource" });
    }

    // In a real application, delete the file from storage here
    await resource.remove();
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    res
      .status(500)
      .json({ message: "Error deleting resource", error: error.message });
  }
};

// Update resource
const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { title, description, category, subject, grade } = req.body;
    const userId = req.user.userId;

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if user is authorized to update
    if (
      resource.uploadedBy.toString() !== userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this resource" });
    }

    // Update fields
    resource.title = title || resource.title;
    resource.description = description || resource.description;
    resource.category = category || resource.category;
    resource.subject = subject || resource.subject;
    resource.grade = grade || resource.grade;

    await resource.save();

    const updatedResource = await Resource.findById(resourceId).populate(
      "uploadedBy",
      "name role"
    );

    res.json(updatedResource);
  } catch (error) {
    console.error("Update resource error:", error);
    res
      .status(500)
      .json({ message: "Error updating resource", error: error.message });
  }
};

// Search resources
const searchResources = async (req, res) => {
  try {
    const { query } = req.query;
    const resources = await Resource.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { subject: { $regex: query, $options: "i" } },
      ],
    })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    console.error("Search resources error:", error);
    res
      .status(500)
      .json({ message: "Error searching resources", error: error.message });
  }
};

// Get popular resources
const getPopularResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .sort({ downloads: -1 })
      .limit(10)
      .populate("uploadedBy", "name role");

    res.json(resources);
  } catch (error) {
    console.error("Get popular resources error:", error);
    res.status(500).json({
      message: "Error fetching popular resources",
      error: error.message,
    });
  }
};

module.exports = {
  getAllResources,
  getResourcesByCategory,
  uploadResource,
  downloadResource,
  deleteResource,
  updateResource,
  searchResources,
  getPopularResources,
};
