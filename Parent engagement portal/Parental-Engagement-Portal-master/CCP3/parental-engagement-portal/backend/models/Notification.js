const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "general",
        "academic",
        "attendance",
        "event",
        "homework",
        "behavior",
      ],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
    },
    metadata: {
      subject: String,
      grade: String,
      dueDate: Date,
      location: String,
      attachments: [
        {
          fileUrl: String,
          fileName: String,
          fileType: String,
        },
      ],
    },
    expiresAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ read: 1 });

// Virtual for time ago
notificationSchema.virtual("timeAgo").get(function () {
  const seconds = Math.floor((new Date() - this.createdAt) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return "just now";
});

// Methods
notificationSchema.methods = {
  // Mark notification as read
  markAsRead: function () {
    this.read = true;
    return this.save();
  },

  // Check if notification is expired
  isExpired: function () {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  },

  // Get notification color based on priority
  getPriorityColor: function () {
    const colors = {
      low: "#28a745",
      normal: "#007bff",
      high: "#ffc107",
      urgent: "#dc3545",
    };
    return colors[this.priority] || colors.normal;
  },

  // Get notification icon based on type
  getTypeIcon: function () {
    const icons = {
      general: "bell",
      academic: "graduation-cap",
      attendance: "calendar-check",
      event: "calendar",
      homework: "book",
      behavior: "exclamation-circle",
    };
    return icons[this.type] || icons.general;
  },
};

// Static methods
notificationSchema.statics = {
  // Get unread notifications count
  getUnreadCount: function (userId) {
    return this.countDocuments({
      userId,
      read: false,
    });
  },

  // Get notifications by type
  getByType: function (userId, type) {
    return this.find({
      userId,
      type,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name role");
  },

  // Get notifications by priority
  getByPriority: function (userId, priority) {
    return this.find({
      userId,
      priority,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name role");
  },

  // Mark all as read
  markAllAsRead: function (userId) {
    return this.updateMany({ userId, read: false }, { $set: { read: true } });
  },

  // Delete expired notifications
  deleteExpired: function () {
    return this.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  },
};

// Middleware
notificationSchema.pre("save", function (next) {
  // Set expiration date if not set (30 days by default)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
