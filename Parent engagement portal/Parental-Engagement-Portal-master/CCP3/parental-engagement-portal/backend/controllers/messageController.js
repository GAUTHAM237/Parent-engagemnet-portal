const Message = require("../models/Message");
const User = require("../models/User");

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          name: "$userDetails.name",
          email: "$userDetails.email",
          role: "$userDetails.role",
          unreadCount: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $and: [
                    { $eq: ["$$message.receiverId", userId] },
                    { $eq: ["$$message.read", false] },
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    res.json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res
      .status(500)
      .json({ message: "Error fetching conversations", error: error.message });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.userId;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    // Mark messages as read
    await Message.updateMany(
      {
        senderId: otherUserId,
        receiverId: userId,
        read: false,
      },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: new Date(),
    });

    await newMessage.save();

    // Populate sender and receiver details
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    // If you're using Socket.IO, emit the message here
    // io.to(receiverId).emit('new-message', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is the sender
    if (message.senderId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    await message.remove();
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res
      .status(500)
      .json({ message: "Error deleting message", error: error.message });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    await Message.updateMany(
      {
        senderId: conversationId,
        receiverId: userId,
        read: false,
      },
      { $set: { read: true } }
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res
      .status(500)
      .json({
        message: "Error marking messages as read",
        error: error.message,
      });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
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

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
  markAsRead,
  getUnreadCount,
};
