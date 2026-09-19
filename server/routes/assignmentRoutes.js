const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Emergency = require('../models/Emergency');
const Resource = require('../models/Resource');

// POST /api/assignments - Create new assignment
router.post('/', async (req, res) => {
  try {
    const { emergencyId, resourceId, estimatedDistance, estimatedTime, reason } = req.body;

    if (!emergencyId || !resourceId) {
      return res.status(400).json({ message: 'emergencyId and resourceId are required' });
    }

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const assignment = new Assignment({
      emergencyId,
      resourceId,
      status: 'ASSIGNED',
      estimatedDistance: estimatedDistance || 0,
      estimatedTime: estimatedTime || '10 mins',
      reason: reason || 'Assigned by Command Center',
    });

    await assignment.save();

    // Update Emergency status
    emergency.status = 'ASSIGNED';
    await emergency.save();

    // Update Resource status
    resource.status = 'BUSY';
    resource.available = false;
    await resource.save();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('resourceAssigned', { assignment, emergency, resource });
      io.emit('assignmentUpdated', assignment);
      io.emit('resourceUpdated', resource);
      io.emit('emergencyUpdated', emergency);
    }

    return res.status(201).json({
      success: true,
      assignment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error creating assignment' });
  }
});

// GET /api/assignments - List assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('emergencyId')
      .populate('resourceId')
      .sort({ createdAt: -1 });
    return res.status(200).json(assignments);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching assignments' });
  }
});

module.exports = router;
