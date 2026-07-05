const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: [true,'Username required'],
    unique: true, trim: true,
    minlength: [3,'Min 3 chars'], maxlength: [30,'Max 30 chars']
  },
  email: {
    type: String, required: [true,'Email required'],
    unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  password: {
    type: String, required: [true,'Password required'], minlength: 6, select: false
  },
  avatar: { type: String, default: '' },
  role:   { type: String, enum: ['user','admin'], default: 'user' },

  // Stats
  streak:     { type: Number, default: 0 },
  maxStreak:  { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  score:      { type: Number, default: 0 },
  xp:         { type: Number, default: 0 },

  // Progress
  solvedProblems:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  starredProblems:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  attemptedProblems:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  completedRoadmapNodes: [{ type: String }],

  // Daily activity — { date: 'YYYY-MM-DD', count: n }
  activityLog: [{
    date:  { type: String },
    count: { type: Number, default: 0 }
  }],

  // Achievements
  achievements: [{
    id:       String,
    title:    String,
    earnedAt: { type: Date, default: Date.now }
  }],

  // Preferences
  preferences: {
    theme:         { type: String, enum: ['dark','light'], default: 'dark' },
    notifications: { type: Boolean, default: true },
    dailyGoal:     { type: Number, default: 3 }
  }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Update streak
userSchema.methods.updateStreak = function() {
  const today     = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastDate  = this.lastActive?.toISOString().split('T')[0];

  if (lastDate === today) return;
  if (lastDate === yesterday) {
    this.streak++;
  } else {
    this.streak = 1;
  }
  this.maxStreak  = Math.max(this.maxStreak, this.streak);
  this.lastActive = new Date();
};

// Sanitize for API response
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
