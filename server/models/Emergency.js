const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    type: { type: String, required: true }, // Flood, Building Collapse, Fire, Medical Emergency, Food Shortage
    peopleAffected: { type: Number, default: 1 },
    vulnerablePeople: { type: Number, default: 0 },
    urgency: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'HIGH',
    },
    description: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'ASSIGNED', 'RESCUED'],
      default: 'PENDING',
    },
    priorityScore: { type: Number, default: 0 },
    priorityReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Emergency', emergencySchema);
