const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  poster: {
    type: String, // URL to the uploaded poster image
    required: false, // Optional for now, can make required later
    default: null
  },
  description: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Non-Technical', 'Cultural', 'Sports', 'Workshop', 'Gaming']
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  teamSize: {
    min: {
      type: Number,
      required: true,
      min: 1
    },
    max: {
      type: Number,
      required: true,
      max: 10
    }
  },
  coordinators: [{
    name: String,
    contact: String,
    role: String
  }],
  prizes: [{
    position: String,
    amount: String,
    description: String
  }],
  rules: [{
    type: String
  }],
  registrationDeadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    teamName: String,
    role: {
      type: String,
      enum: ['team_leader', 'member']
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  }],
  maxTeams: {
    type: Number,
    default: 50
  },
  currentTeams: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  return this.isActive && new Date() < this.registrationDeadline && this.currentTeams < this.maxTeams;
});

// Method to check if user can register
eventSchema.methods.canUserRegister = function(userId) {
  return this.participants.some(p => p.userId.toString() === userId.toString());
};

// Method to add participant
eventSchema.methods.addParticipant = function(userId, teamName, role) {
  if (this.currentTeams >= this.maxTeams) {
    throw new Error('Maximum teams reached for this event');
  }
  
  if (this.participants.some(p => p.userId.toString() === userId.toString())) {
    throw new Error('User already registered for this event');
  }
  
  this.participants.push({
    userId,
    teamName,
    role,
    registrationDate: new Date()
  });
  
  if (role === 'team_leader') {
    this.currentTeams += 1;
  }
  
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema); 