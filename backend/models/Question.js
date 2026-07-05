const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  description: { type: String, default: '' },
  category:    { type: String, required: true },
  difficulty:  { type: String, enum: ['Easy','Medium','Hard'], required: true },
  tags:        [{ type: String, lowercase: true }],
  companies:   [{ type: String }],

  // Metadata
  frequency:       { type: Number, default: 50, min: 0, max: 100 },
  acceptanceRate:  { type: Number, default: 50, min: 0, max: 100 },
  likes:           { type: Number, default: 0 },
  dislikes:        { type: Number, default: 0 },

  // Content
  hints:           [{ type: String }],
  solution:        { type: String, default: '' },
  solutionCode:    { type: String, default: '' },
  timeComplexity:  { type: String, default: '' },
  spaceComplexity: { type: String, default: '' },
  similar:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],

  isPremium:   { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate slug
questionSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g,'');
  }
  next();
});

// Text index for MongoDB full-text search (fallback to Trie)
questionSchema.index({ title: 'text', category: 'text', tags: 'text' });
questionSchema.index({ difficulty: 1, category: 1 });
questionSchema.index({ frequency: -1 });

module.exports = mongoose.model('Question', questionSchema);
