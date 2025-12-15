const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Remove router.use() and apply auth middleware directly to routes

// Get all resources
router.get('/', auth, async (req, res) => {
    try {
        // Replace with actual database query
        const resources = [];
        res.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: 'Error fetching resources' });
    }
});

// Get resource by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ id, name: 'Sample resource' });
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ message: 'Error fetching resource' });
    }
});

// Upload new resource
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, type } = req.body;
        res.status(201).json({ message: 'Resource uploaded successfully' });
    } catch (error) {
        console.error('Error uploading resource:', error);
        res.status(500).json({ message: 'Error uploading resource' });
    }
});

// Download resource
router.get('/:id/download', auth, async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ message: 'Resource download link' });
    } catch (error) {
        console.error('Error downloading resource:', error);
        res.status(500).json({ message: 'Error downloading resource' });
    }
});

module.exports = router;