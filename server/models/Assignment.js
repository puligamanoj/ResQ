const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    emergencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emergency',
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    assignedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['ASSIGNED', 'IN_TRANSIT', 'ON_SITE', 'COMPLETED', 'REASSIGNED'],
      default: 'ASSIGNED',
    },
    estimatedDistance: { type: Number, default: 0 },
    estimatedTime: { type: String, default: '10 mins' },
    reason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
