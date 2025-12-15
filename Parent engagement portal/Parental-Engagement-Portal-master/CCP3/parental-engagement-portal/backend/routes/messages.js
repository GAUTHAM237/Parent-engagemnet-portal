const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Apply auth middleware to individual routes instead of using router.use()

// Get all messages
router.get('/', auth, async (req, res) => {
    try {
        const messages = []; // Replace with actual database query
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// Get message by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ id, message: 'Sample message' });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ message: 'Error fetching message' });
    }
});

// Create new message
router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;
        res.status(201).json({ message: 'Message created successfully' });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Error creating message' });
    }
});

module.exports = router;