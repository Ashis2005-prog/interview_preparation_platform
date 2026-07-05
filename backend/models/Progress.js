const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },

  status:   { type: String, enum: ['viewed','attempted','solved'], default: 'viewed' },
  attempts: { type: Number, default: 0 },
  solvedAt: { type: Date },

  // Code submission
  language: { type: String, default: 'javascript' },
  code:     { type: String, default: '' },
  notes:    { type: String, default: '' },

  // Timing
  timeSpent:   { type: Number, default: 0 }, // seconds
  pointsEarned:{ type: Number, default: 0 },
}, { timestamps: true });

progressSchema.index({ user: 1, question: 1 }, { unique: true });
progressSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Progress', progressSchema);
