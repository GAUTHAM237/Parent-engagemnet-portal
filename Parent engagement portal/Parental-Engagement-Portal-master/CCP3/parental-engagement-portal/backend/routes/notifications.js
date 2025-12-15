const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Remove router.use() and apply auth middleware directly to routes

// Get all notifications
router.get('/', auth, async (req, res) => {
    try {
        // Replace with actual database query
        const notifications = [];
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Get unread notifications count
router.get('/unread', auth, async (req, res) => {
    try {
        // Replace with actual count query
        const count = 0;
        res.json({ count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Error fetching unread count' });
    }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error marking notification as read' });
    }
});

module.exports = router;