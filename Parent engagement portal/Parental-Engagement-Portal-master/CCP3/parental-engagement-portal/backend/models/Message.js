const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        fileUrl: String,
        fileName: String,
        fileType: String,
        fileSize: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedBySender: {
      type: Boolean,
      default: false,
    },
    deletedByReceiver: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual for timeAgo
messageSchema.virtual("timeAgo").get(function () {
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

  return Math.floor(seconds) + " seconds ago";
});

// Methods
messageSchema.methods = {
  // Mark message as read
  markAsRead: function () {
    this.read = true;
    return this.save();
  },

  // Soft delete for sender
  deleteBySender: function () {
    this.deletedBySender = true;
    return this.save();
  },

  // Soft delete for receiver
  deleteByReceiver: function () {
    this.deletedByReceiver = true;
    return this.save();
  },

  // Check if message should be completely removed
  shouldRemove: function () {
    return this.deletedBySender && this.deletedByReceiver;
  },
};

// Static methods
messageSchema.statics = {
  // Get conversation between two users
  getConversation: function (userId1, userId2) {
    return this.find({
      $or: [
        { senderId: userId1, receiverId: userId2, deletedBySender: false },
        { senderId: userId2, receiverId: userId1, deletedByReceiver: false },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name avatar")
      .populate("receiverId", "name avatar");
  },

  // Get unread messages count
  getUnreadCount: function (userId) {
    return this.countDocuments({
      receiverId: userId,
      read: false,
      deletedByReceiver: false,
    });
  },
};

// Middleware
messageSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
