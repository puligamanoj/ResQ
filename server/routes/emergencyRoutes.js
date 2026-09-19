const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const Resource = require('../models/Resource');
const Road = require('../models/Road');
const { calculatePriority } = require('../services/priorityEngine');
const { recommendResource } = require('../services/allocationEngine');

// POST /api/emergencies - Create emergency
router.post('/', async (req, res) => {
  try {
    const {
      name,
      location,
      latitude,
      longitude,
      type,
      peopleAffected,
      vulnerablePeople,
      urgency,
      description,
    } = req.body;

    if (!name || !location || !type) {
      return res.status(400).json({ message: 'Name, location, and type are required' });
    }

    const priorityCalc = calculatePriority(req.body);

    const emergency = new Emergency({
      name,
      location,
      latitude: latitude || 0,
      longitude: longitude || 0,
      type,
      peopleAffected: peopleAffected || 1,
      vulnerablePeople: vulnerablePeople || 0,
      urgency: urgency || 'HIGH',
      description,
      priorityScore: priorityCalc.priorityScore,
      priorityReason: priorityCalc.priorityReason,
      status: 'PENDING',
    });

    await emergency.save();

    // Get available resources and roads for recommendation
    const availableResources = await Resource.find({ available: true, status: 'AVAILABLE' });
    const roads = await Road.find();
    const recommendation = recommendResource(emergency, availableResources, roads);

    // Socket.IO Broadcast
    const io = req.app.get('socketio');
    if (io) {
      io.emit('emergencyCreated', { emergency, recommendation });
    }

    return res.status(201).json({
      success: true,
      emergency,
      recommendation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error creating emergency' });
  }
});

// GET /api/emergencies - List all emergencies sorted by priorityScore DESC
router.get('/', async (req, res) => {
  try {
    const emergencies = await Emergency.find().sort({ priorityScore: -1, createdAt: -1 });
    return res.status(200).json(emergencies);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching emergencies' });
  }
});

// GET /api/emergencies/:id
router.get('/:id', async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    return res.status(200).json(emergency);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching emergency' });
  }
});

// PUT /api/emergencies/:id - Update emergency & recalculate priority
router.put('/:id', async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    Object.assign(emergency, req.body);

    // Recalculate priority score
    const priorityCalc = calculatePriority(emergency);
    emergency.priorityScore = priorityCalc.priorityScore;
    emergency.priorityReason = priorityCalc.priorityReason;

    await emergency.save();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('emergencyUpdated', emergency);
      io.emit('priorityUpdated', emergency);
    }

    return res.status(200).json(emergency);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error updating emergency' });
  }
});

// DELETE /api/emergencies/:id
router.delete('/:id', async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndDelete(req.params.id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    return res.status(200).json({ message: 'Emergency deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error deleting emergency' });
  }
});

module.exports = router;
