const mongoose = require('mongoose');

const roadSchema = new mongoose.Schema(
  {
    roadId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    from: { type: String },
    to: { type: String },
    blocked: { type: Boolean, default: false },
    reason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Road', roadSchema);
