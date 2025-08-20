const mongoose = require('mongoose');

const studentTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  regNumber: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String, // URL to the uploaded photo (stud1.webp, stud2.webp, etc.)
    default: null
  },
  assignedEvents: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
studentTeamSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('StudentTeam', studentTeamSchema); 