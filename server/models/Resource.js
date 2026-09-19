const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['AMBULANCE', 'FIRE_TRUCK', 'RESCUE_TEAM', 'HELICOPTER', 'BOAT'],
      required: true,
    },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    capacity: { type: Number, default: 10 },
    available: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'AVAILABLE',
    },
    currentLocation: { type: String },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
