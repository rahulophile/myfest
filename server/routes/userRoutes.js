const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Event = require('../models/Event');
const { authenticateUser, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'visionfest25@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Generate JWT Token with better security
const generateToken = (userId, userType = 'user') => {
  const payload = {
    userId,
    userType,
    iat: Math.floor(Date.now() / 1000),
    jti: Math.random().toString(36).substring(2) + Date.now().toString(36) // Unique token ID
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'vision-fest-25-secret',
    { 
      algorithm: 'HS256',
      expiresIn: '7d'
    }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { 
      userId, 
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      jti: Math.random().toString(36).substring(2) + Date.now().toString(36)
    },
    process.env.JWT_REFRESH_SECRET || 'vision-fest-25-refresh-secret',
    { 
      algorithm: 'HS256',
      expiresIn: '30d'
    }
  );
};

// User Signup with improved validation
router.post('/signup', async (req, res) => {
  try {
    const {
      name,
      registrationNumber,
      mobileNumber,
      emailId,
      isGECVaishaliStudent,
      collegeName,
      password
    } = req.body;

    // Enhanced validation
    if (!name || !registrationNumber || !mobileNumber || !emailId || password === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ emailId }, { registrationNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or registration number already exists'
      });
    }

    // Enhanced password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one special character'
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter'
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one number'
      });
    }

    // Create new user
    const user = new User({
      name,
      registrationNumber,
      mobileNumber,
      emailId,
      isGECVaishaliStudent,
      collegeName: isGECVaishaliStudent ? undefined : collegeName,
      password
    });

    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id, 'user');
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user.userId,
        name: user.name,
        emailId: user.emailId,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message
    });
  }
});

// User Login with improved security
router.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateToken(user._id, 'user');
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.userId,
        name: user.name,
        emailId: user.emailId,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'vision-fest-25-refresh-secret');
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new access token
    const newAccessToken = generateToken(user._id, 'user');

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired. Please login again.'
      });
    }
    
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh',
      error: error.message
    });
  }
});

// Forgot User ID
router.post('/forgot-userid', async (req, res) => {
  try {
    const { registrationNumber, emailId } = req.body;

    const user = await User.findOne({ registrationNumber, emailId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with these details'
      });
    }

    res.json({
      success: true,
      message: 'User ID found',
      data: {
        userId: user.userId,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Forgot User ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).substr(2, 8) + '!@#';
    
    // Update user password
    user.password = tempPassword;
    await user.save();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'visionfest25@gmail.com',
      to: user.emailId,
      subject: 'Vision Fest 25 - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Vision Fest 25</h1>
            <p style="color: white; margin: 10px 0 0 0;">Password Reset Request</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Hello ${user.name},</h2>
            
            <p>You requested a password reset for your Vision Fest 25 account.</p>
            
            <div style="background: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1976D2;">Your New Password:</h3>
              <p style="font-size: 18px; font-weight: bold; color: #1976D2; margin: 0;">${tempPassword}</p>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This is a temporary password</li>
              <li>Please change it immediately after logging in</li>
              <li>Keep your password secure and don't share it</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/login" style="background: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Login Now</a>
            </div>
            
            <p>If you didn't request this password reset, please ignore this email.</p>
            
            <p>Best regards,<br>Vision Fest 25 Team</p>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; 2025 Vision Fest 25. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Try to send email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully to:', user.emailId);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }
    
    // Always return the new password in response
    res.json({
      success: true,
      message: 'Password reset successful! Here is your new password:',
      data: {
        userId: user.userId,
        emailId: user.emailId,
        newPassword: tempPassword,
        note: 'Please use this password to login. Email has also been sent to your registered email address.'
      }
    });

  } catch (error) {
    console.error('Forgot Password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message
    });
  }
});

// Get User Dashboard
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('participatedEvents.eventId')
      .select('-password');

    // Enhance team information for better display
    const enhancedUser = user.toObject();
    
    // For each participated event, ensure team information is complete and clean
    enhancedUser.participatedEvents = enhancedUser.participatedEvents.map(participation => {
      if (participation.role === 'team_leader') {
        // Team leader already has complete team information
        // Ensure no duplicates in teamMembers
        if (participation.teamMembers) {
          const uniqueMembers = [];
          const seenIds = new Set();
          
          participation.teamMembers.forEach(member => {
            if (!seenIds.has(member.userId)) {
              seenIds.add(member.userId);
              uniqueMembers.push(member);
            }
          });
          
          participation.teamMembers = uniqueMembers;
        }
        return participation;
      } else if (participation.role === 'member' && participation.teamLeader) {
        // Member has team leader info, ensure team members are clean and don't include duplicates
        if (participation.teamMembers) {
          const uniqueMembers = [];
          const seenIds = new Set();
          
          participation.teamMembers.forEach(member => {
            if (!seenIds.has(member.userId)) {
              seenIds.add(member.userId);
              uniqueMembers.push(member);
            }
          });
          
          participation.teamMembers = uniqueMembers;
        }
        return participation;
      }
      return participation;
    });

    res.json({
      success: true,
      data: enhancedUser
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get User Profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('participatedEvents.eventId')
      .select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update User Profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update through this route
    delete updates.userId; // Don't allow userId update

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router; 