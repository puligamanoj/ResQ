const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// POST /api/resources - Create resource
router.post('/', async (req, res) => {
  try {
    const { name, type, latitude, longitude, capacity, currentLocation, skills } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Resource name and type are required' });
    }

    const resource = new Resource({
      name,
      type,
      latitude: latitude || 0,
      longitude: longitude || 0,
      capacity: capacity || 10,
      currentLocation,
      skills: skills || [],
      available: true,
      status: 'AVAILABLE',
    });

    await resource.save();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('resourceUpdated', resource);
    }

    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error creating resource' });
  }
});

// GET /api/resources - List resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching resources' });
  }
});

// PUT /api/resources/:id - Update resource
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const io = req.app.get('socketio');
    if (io) {
      io.emit('resourceUpdated', resource);
    }

    return res.status(200).json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error updating resource' });
  }
});

module.exports = router;
