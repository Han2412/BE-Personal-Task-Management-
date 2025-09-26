const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['TODO','DONE'], default: 'TODO' },
  dueAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// update updatedAt on save
TodoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
TodoSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Todo', TodoSchema);
