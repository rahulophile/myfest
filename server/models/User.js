const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      // Generate exactly 3 characters: 0-9, A-Z mixture (all uppercase)
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = 'VZN25';
      for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  isGECVaishaliStudent: {
    type: Boolean,
    required: true
  },
  collegeName: {
    type: String,
    required: function() {
      return !this.isGECVaishaliStudent;
    },
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(v) {
        // At least one special character required
        return /[!@#$%^&*(),.?":{}|<>]/.test(v);
      },
      message: 'Password must contain at least one special character'
    }
  },
  participatedEvents: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    teamName: String,
    role: {
      type: String,
      enum: ['team_leader', 'member'],
      default: 'member'
    },
    teamLeader: {
      userId: String,
      name: String
    },
    teamMembers: [{
      userId: String,
      name: String
    }],
    registrationDate: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate new unique ID
userSchema.methods.generateNewUserId = async function() {
  let newUserId;
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    newUserId = 'VZN25';
    for (let i = 0; i < 3; i++) {
      newUserId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    attempts++;
    
    if (attempts > maxAttempts) {
      throw new Error('Unable to generate unique user ID after multiple attempts');
    }
  } while (await mongoose.model('User').findOne({ userId: newUserId }));
  
  return newUserId;
};

module.exports = mongoose.model('User', userSchema); 