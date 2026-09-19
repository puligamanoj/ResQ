const express = require('express');
const router = express.Router();
const Road = require('../models/Road');
const Assignment = require('../models/Assignment');
const Emergency = require('../models/Emergency');
const Resource = require('../models/Resource');
const { recommendResource } = require('../services/allocationEngine');

// POST /api/roads - Create road record
router.post('/', async (req, res) => {
  try {
    const { roadId, name, from, to, blocked, reason } = req.body;
    if (!roadId || !name) {
      return res.status(400).json({ message: 'roadId and name are required' });
    }

    const road = new Road({
      roadId,
      name,
      from,
      to,
      blocked: blocked || false,
      reason: reason || '',
    });

    await road.save();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('roadUpdated', road);
    }

    return res.status(201).json(road);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error creating road' });
  }
});

// GET /api/roads - List all roads
router.get('/', async (req, res) => {
  try {
    const roads = await Road.find();
    return res.status(200).json(roads);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching roads' });
  }
});

// PUT /api/roads/:id - Update road & trigger Dynamic Replanning if newly blocked
router.put('/:id', async (req, res) => {
  try {
    const road = await Road.findById(req.params.id);
    if (!road) {
      return res.status(404).json({ message: 'Road not found' });
    }

    const wasBlocked = road.blocked;
    const isNowBlocked = req.body.blocked !== undefined ? req.body.blocked : wasBlocked;

    Object.assign(road, req.body);
    await road.save();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('roadUpdated', road);
    }

    // Dynamic Replanning Trigger: Road changes from unblocked to blocked
    if (!wasBlocked && isNowBlocked) {
      if (io) io.emit('replanningStarted', { roadId: road.roadId, roadName: road.name });

      // Find active assignments that might be affected
      const activeAssignments = await Assignment.find({
        status: { $in: ['ASSIGNED', 'IN_TRANSIT'] },
      }).populate('emergencyId resourceId');

      const allRoads = await Road.find();

      for (const assignment of activeAssignments) {
        const emergency = assignment.emergencyId;
        if (!emergency) continue;

        const isAffected =
          (emergency.location || '').toLowerCase().includes(road.name.toLowerCase()) ||
          (road.from && (emergency.location || '').toLowerCase().includes(road.from.toLowerCase())) ||
          (road.to && (emergency.location || '').toLowerCase().includes(road.to.toLowerCase()));

        if (isAffected) {
          // Free current assigned resource
          if (assignment.resourceId) {
            await Resource.findByIdAndUpdate(assignment.resourceId._id, {
              status: 'AVAILABLE',
              available: true,
            });
          }

          // Find alternative resource
          const availableResources = await Resource.find({ available: true, status: 'AVAILABLE' });
          const recommendation = recommendResource(emergency, availableResources, allRoads);

          if (recommendation && recommendation.resourceObj) {
            const newResource = recommendation.resourceObj;

            // Mark new resource as BUSY
            await Resource.findByIdAndUpdate(newResource._id, {
              status: 'BUSY',
              available: false,
            });

            // Update assignment to REASSIGNED
            assignment.resourceId = newResource._id;
            assignment.status = 'REASSIGNED';
            assignment.estimatedDistance = recommendation.distance;
            assignment.estimatedTime = `${recommendation.distance * 3} mins (Detour)`;
            assignment.reason = `DYNAMIC REPLANNING: ${road.name} blocked. Diverted to ${newResource.name}`;
            await assignment.save();

            if (io) {
              io.emit('resourceReassigned', {
                assignment,
                oldResourceId: assignment.resourceId,
                newResource: newResource.name,
                reason: assignment.reason,
              });
              io.emit('assignmentUpdated', assignment);
            }
          }
        }
      }
    }

    return res.status(200).json(road);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error updating road' });
  }
});

module.exports = router;
