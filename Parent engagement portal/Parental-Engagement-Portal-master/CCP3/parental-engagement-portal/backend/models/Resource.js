const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "study-materials",
        "homework",
        "exam-preparation",
        "extra-learning",
        "video-lectures",
        "assignments",
      ],
      default: "study-materials",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: [
        "pdf",
        "doc",
        "docx",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
        "mp4",
        "mp3",
        "jpg",
        "png",
        "zip",
      ],
    },
    fileSize: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private", "grade-specific"],
      default: "public",
    },
    accessibleTo: [
      {
        type: String, // Grade levels or user roles that can access
        trim: true,
      },
    ],
    metadata: {
      language: String,
      duration: String, // For video/audio content
      pages: Number, // For documents
      author: String,
      publishDate: Date,
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "archived", "under-review"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
resourceSchema.index({ title: "text", description: "text", subject: "text" });
resourceSchema.index({ category: 1, subject: 1, grade: 1 });
resourceSchema.index({ downloads: -1 });

// Virtual for formatted file size
resourceSchema.virtual("formattedFileSize").get(function () {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (this.fileSize === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(this.fileSize) / Math.log(1024)));
  return Math.round(this.fileSize / Math.pow(1024, i), 2) + " " + sizes[i];
});

// Methods
resourceSchema.methods = {
  // Increment download count
  incrementDownloads: function () {
    this.downloads += 1;
    return this.save();
  },

  // Add rating
  addRating: function (userId, rating, review) {
    this.ratings.push({
      userId,
      rating,
      review,
      date: new Date(),
    });
    this.calculateAverageRating();
    return this.save();
  },

  // Calculate average rating
  calculateAverageRating: function () {
    if (this.ratings.length === 0) {
      this.averageRating = 0;
    } else {
      const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      this.averageRating = sum / this.ratings.length;
    }
  },

  // Archive resource
  archive: function () {
    this.status = "archived";
    return this.save();
  },
};

// Static methods
resourceSchema.statics = {
  // Get popular resources
  getPopularResources: function (limit = 10) {
    return this.find({ status: "active" })
      .sort({ downloads: -1 })
      .limit(limit)
      .populate("uploadedBy", "name role");
  },

  // Search resources
  searchResources: function (query) {
    return this.find({
      $text: { $search: query },
      status: "active",
    }).sort({ score: { $meta: "textScore" } });
  },

  // Get resources by category
  getByCategory: function (category) {
    return this.find({
      category,
      status: "active",
    }).sort({ createdAt: -1 });
  },
};

// Middleware
resourceSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
