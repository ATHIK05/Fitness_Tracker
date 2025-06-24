const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['workout', 'walk', 'food', 'custom'], required: true },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  unit: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  description: { type: String }
});

module.exports = mongoose.model('Goal', goalSchema); 