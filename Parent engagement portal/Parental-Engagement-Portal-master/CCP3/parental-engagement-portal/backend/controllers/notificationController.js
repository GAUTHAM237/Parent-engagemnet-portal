const Notification = require("../models/Notification");
const User = require("../models/User");

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate("sender", "name role");

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, priority } = req.body;
    const senderId = req.user.userId;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notification = new Notification({
      userId,
      sender: senderId,
      title,
      message,
      type: type || "general", // general, academic, attendance, event
      priority: priority || "normal", // low, normal, high
      read: false,
      createdAt: new Date(),
    });

    await notification.save();

    // Populate sender details
    const populatedNotification = await Notification.findById(
      notification._id
    ).populate("sender", "name role");

    // If using Socket.IO, emit the notification
    // io.to(userId).emit('new-notification', populatedNotification);

    res.status(201).json(populatedNotification);
  } catch (error) {
    console.error("Create notification error:", error);
    res
      .status(500)
      .json({ message: "Error creating notification", error: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Mark as read error:", error);
    res
      .status(500)
      .json({
        message: "Error marking notification as read",
        error: error.message,
      });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res
      .status(500)
      .json({
        message: "Error marking all notifications as read",
        error: error.message,
      });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.remove();
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res
      .status(500)
      .json({ message: "Error deleting notification", error: error.message });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Get unread count error:", error);
    res
      .status(500)
      .json({ message: "Error getting unread count", error: error.message });
  }
};

// Get notifications by type
const getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user.userId;

    const notifications = await Notification.find({
      userId,
      type,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name role");

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications by type error:", error);
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

// Get notifications by priority
const getNotificationsByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    const userId = req.user.userId;

    const notifications = await Notification.find({
      userId,
      priority,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name role");

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications by priority error:", error);
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  getNotificationsByType,
  getNotificationsByPriority,
};
