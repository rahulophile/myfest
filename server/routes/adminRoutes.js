const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Event = require('../models/Event');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Generate Admin JWT Token
const generateAdminToken = (adminId) => {
  return jwt.sign(
    { 
      adminId,
      userType: 'admin',
      iat: Math.floor(Date.now() / 1000),
      jti: Math.random().toString(36).substring(2) + Date.now().toString(36)
    },
    process.env.JWT_SECRET || 'vision-fest-25-secret',
    { 
      algorithm: 'HS256',
      expiresIn: '24h'
    }
  );
};

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Admin login attempt:', { username, passwordProvided: !!password });

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    console.log('Admin found:', { adminId: admin._id, username: admin.username });

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for admin:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    console.log('Password valid for admin:', username);

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateAdminToken(admin._id);
    console.log('Generated admin token:', { adminId: admin._id, tokenLength: token.length });

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        adminId: admin._id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions,
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// File Upload Route for Event Posters (Protected)
router.post('/upload-poster', authenticateAdmin, upload.single('poster'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create the file URL
    const fileUrl = `/uploads/events/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Poster uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload',
      error: error.message
    });
  }
});

// Serve uploaded files
router.get('/uploads/events/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', 'events', filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
});

// Get All Users (Protected)
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get All Registrations (Protected)
router.get('/registrations', authenticateAdmin, async (req, res) => {
  try {
    console.log('Fetching all registrations...');
    
    // Get all events with participants
    const events = await Event.find({})
      .populate('participants.userId', 'name userId registrationNumber mobileNumber emailId collegeName isGECVaishaliStudent')
      .sort({ date: 1 });

    console.log('Events found:', events.length);
    
    // Flatten all registrations from all events
    const allRegistrations = [];
    
    events.forEach((event, eventIndex) => {
      console.log(`Event ${eventIndex + 1}: ${event.title} - Participants: ${event.participants?.length || 0}`);
      
      if (event.participants && Array.isArray(event.participants)) {
        event.participants.forEach((participant, participantIndex) => {
          console.log(`  Participant ${participantIndex + 1}:`, {
            userId: participant.userId,
            teamName: participant.teamName,
            role: participant.role
          });
          
          if (participant.userId) {
            allRegistrations.push({
              eventId: {
                _id: event._id,
                title: event.title,
                date: event.date
              },
              userId: participant.userId.userId,
              name: participant.userId.name,
              registrationNumber: participant.userId.registrationNumber,
              mobileNumber: participant.userId.mobileNumber,
              emailId: participant.userId.emailId,
              collegeName: participant.userId.isGECVaishaliStudent ? 'GEC Vaishali' : participant.userId.collegeName,
              teamName: participant.teamName,
              role: participant.role,
              registrationDate: participant.registrationDate
            });
          } else {
            console.log('  Skipping participant with no userId:', participant);
          }
        });
      } else {
        console.log(`  No participants array for event: ${event.title}`);
      }
    });

    console.log('Total registrations processed:', allRegistrations.length);

    // Alternative approach: Get registrations directly from User model
    console.log('Trying alternative approach...');
    
    const usersWithEvents = await User.find({
      'participatedEvents.0': { $exists: true }
    }).populate('participatedEvents.eventId');
    
    console.log('Users with events found:', usersWithEvents.length);
    
    const alternativeRegistrations = [];
    
    usersWithEvents.forEach(user => {
      user.participatedEvents.forEach(participation => {
        alternativeRegistrations.push({
          eventId: {
            _id: participation.eventId._id,
            title: participation.eventId.title,
            date: participation.eventId.date
          },
          userId: user.userId,
          name: user.name,
          registrationNumber: user.registrationNumber,
          mobileNumber: user.mobileNumber,
          emailId: user.emailId,
          collegeName: user.isGECVaishaliStudent ? 'GEC Vaishali' : user.collegeName,
          teamName: participation.teamName,
          role: participation.role,
          registrationDate: participation.registrationDate
        });
      });
    });
    
    console.log('Alternative registrations found:', alternativeRegistrations.length);
    
    // Use alternative approach if primary approach found no registrations
    const finalRegistrations = allRegistrations.length > 0 ? allRegistrations : alternativeRegistrations;
    
    res.json({
      success: true,
      data: finalRegistrations,
      debug: {
        primaryMethod: allRegistrations.length,
        alternativeMethod: alternativeRegistrations.length,
        finalCount: finalRegistrations.length
      }
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get User by ID (Protected)
router.get('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-password')
      .populate('participatedEvents.eventId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get All Events (Protected)
router.get('/events', authenticateAdmin, async (req, res) => {
  try {
    const events = await Event.find({})
      .populate('participants.userId', 'name userId')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Event by ID (Protected)
router.get('/events/:eventId', authenticateAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('participants.userId', 'name userId registrationNumber mobileNumber emailId');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Event Registrations (Protected)
router.get('/events/:eventId/registrations', authenticateAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('participants.userId', 'name userId registrationNumber mobileNumber emailId collegeName isGECVaishaliStudent');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const registrations = event.participants.map(p => ({
      userId: p.userId.userId,
      name: p.userId.name,
      registrationNumber: p.userId.registrationNumber,
      mobileNumber: p.userId.mobileNumber,
      emailId: p.userId.emailId,
      collegeName: p.userId.isGECVaishaliStudent ? 'GEC Vaishali' : p.userId.collegeName,
      teamName: p.teamName,
      role: p.role,
      registrationDate: p.registrationDate
    }));

    res.json({
      success: true,
      data: {
        eventTitle: event.title,
        totalRegistrations: registrations.length,
        registrations
      }
    });

  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Event Teams with Complete Member Details (Protected)
router.get('/events/:eventId/teams', authenticateAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    console.log('Fetching teams for event:', eventId);
    
    const event = await Event.findById(eventId)
      .populate('participants.userId', 'name userId registrationNumber mobileNumber emailId collegeName isGECVaishaliStudent');

    if (!event) {
      console.log('Event not found:', eventId);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    console.log('Event found:', event.title, 'Participants:', event.participants.length);

    // Check if participants exist and have proper structure
    if (!event.participants || !Array.isArray(event.participants)) {
      console.log('No participants or invalid structure');
      return res.json({
        success: true,
        data: {
          eventTitle: event.title,
          eventId: event._id,
          totalTeams: 0,
          totalParticipants: 0,
          teams: []
        }
      });
    }

    // Group participants by team
    const teamMap = new Map();
    
    event.participants.forEach((p, index) => {
      console.log(`Processing participant ${index}:`, {
        userId: p.userId,
        teamName: p.teamName,
        role: p.role
      });
      
      // Skip if no userId or teamName
      if (!p.userId || !p.teamName) {
        console.log('Skipping participant with missing data:', p);
        return;
      }

      if (!teamMap.has(p.teamName)) {
        teamMap.set(p.teamName, {
          teamName: p.teamName,
          leader: null,
          members: [],
          totalMembers: 0,
          registrationDate: null
        });
      }
      
      const team = teamMap.get(p.teamName);
      const participantInfo = {
        userId: p.userId.userId,
        name: p.userId.name,
        registrationNumber: p.userId.registrationNumber,
        mobileNumber: p.userId.mobileNumber,
        emailId: p.userId.emailId,
        collegeName: p.userId.isGECVaishaliStudent ? 'GEC Vaishali' : p.userId.collegeName,
        role: p.role,
        registrationDate: p.registrationDate
      };
      
      if (p.role === 'team_leader') {
        team.leader = participantInfo;
        team.registrationDate = p.registrationDate;
      } else {
        team.members.push(participantInfo);
      }
      
      team.totalMembers = team.leader ? team.members.length + 1 : team.members.length;
    });

    // Convert to array and sort by team name
    const teams = Array.from(teamMap.values()).sort((a, b) => a.teamName.localeCompare(b.teamName));

    console.log('Teams processed:', teams.length);

    res.json({
      success: true,
      data: {
        eventTitle: event.title,
        eventId: event._id,
        totalTeams: teams.length,
        totalParticipants: event.participants.length,
        teams
      }
    });

  } catch (error) {
    console.error('Get event teams error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request params:', req.params);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create New Event (Protected)
router.post('/events', authenticateAdmin, async (req, res) => {
  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.date) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and date are required'
      });
    }

    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update Event (Protected)
router.put('/events/:eventId', authenticateAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete Event (Protected)
router.delete('/events/:eventId', authenticateAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Toggle Event Status (Active/Inactive)
router.patch('/events/:eventId/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.isActive = !event.isActive;
    await event.save();

    res.json({
      success: true,
      message: `Event ${event.isActive ? 'activated' : 'deactivated'} successfully`,
      data: event
    });

  } catch (error) {
    console.error('Toggle event status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Dashboard Statistics (Protected)
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true });
    
    // Get total registrations across all events
    const events = await Event.find({});
    const totalRegistrations = events.reduce((sum, event) => sum + event.participants.length, 0);

    // Get users by college
    const collegeStats = await User.aggregate([
      {
        $group: {
          _id: '$isGECVaishaliStudent',
          count: { $sum: 1 }
        }
      }
    ]);

    const gecVaishaliCount = collegeStats.find(stat => stat._id === true)?.count || 0;
    const otherCollegeCount = collegeStats.find(stat => stat._id === false)?.count || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        activeEvents,
        totalRegistrations,
        collegeStats: {
          gecVaishali: gecVaishaliCount,
          otherColleges: otherCollegeCount
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Search Users (Protected)
router.get('/search/users/:query', authenticateAdmin, async (req, res) => {
  try {
    const { query } = req.params;
    
    const users = await User.find({
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { userId: { $regex: new RegExp(query, 'i') } },
        { registrationNumber: { $regex: new RegExp(query, 'i') } },
        { emailId: { $regex: new RegExp(query, 'i') } }
      ]
    })
    .select('-password')
    .limit(20);

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Export Data (Protected)
router.get('/export/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    // Convert to CSV format
    const csvData = users.map(user => ({
      'User ID': user.userId,
      'Name': user.name,
      'Registration Number': user.registrationNumber,
      'Mobile Number': user.mobileNumber,
      'Email ID': user.emailId,
      'GEC Vaishali Student': user.isGECVaishaliStudent ? 'Yes' : 'No',
      'College Name': user.collegeName || 'N/A',
      'Created Date': user.createdAt.toLocaleDateString()
    }));

    res.json({
      success: true,
      data: csvData
    });

  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Export Event Registrations (Protected)
router.get('/export/events/:eventId/registrations', authenticateAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('participants.userId', 'name userId registrationNumber mobileNumber emailId collegeName');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const registrations = event.participants.map(p => ({
      'Event Title': event.title,
      'Team Name': p.teamName,
      'User ID': p.userId.userId,
      'Name': p.userId.name,
      'Registration Number': p.userId.registrationNumber,
      'Mobile Number': p.userId.mobileNumber,
      'Email ID': p.userId.emailId,
      'College Name': p.userId.collegeName || 'N/A',
      'Role': p.role,
      'Registration Date': p.registrationDate.toLocaleDateString()
    }));

    res.json({
      success: true,
      data: registrations
    });

  } catch (error) {
    console.error('Export event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Debug endpoint to check database state (Protected)
router.get('/debug/database-state', authenticateAdmin, async (req, res) => {
  try {
    console.log('Debug: Checking database state...');
    
    // Check events
    const totalEvents = await Event.countDocuments();
    const eventsWithParticipants = await Event.countDocuments({
      'participants.0': { $exists: true }
    });
    
    // Check users
    const totalUsers = await User.countDocuments();
    const usersWithEvents = await User.countDocuments({
      'participatedEvents.0': { $exists: true }
    });
    
    // Sample data
    const sampleEvent = await Event.findOne().populate('participants.userId');
    const sampleUser = await User.findOne({
      'participatedEvents.0': { $exists: true }
    }).populate('participatedEvents.eventId');
    
    const debugInfo = {
      events: {
        total: totalEvents,
        withParticipants: eventsWithParticipants,
        sample: sampleEvent ? {
          title: sampleEvent.title,
          participantsCount: sampleEvent.participants?.length || 0,
          participants: sampleEvent.participants?.map(p => ({
            userId: p.userId?._id,
            teamName: p.teamName,
            role: p.role
          })) || []
        } : null
      },
      users: {
        total: totalUsers,
        withEvents: usersWithEvents,
        sample: sampleUser ? {
          userId: sampleUser.userId,
          name: sampleUser.name,
          participatedEventsCount: sampleUser.participatedEvents?.length || 0,
          participatedEvents: sampleUser.participatedEvents?.map(p => ({
            eventId: p.eventId?._id,
            eventTitle: p.eventId?.title,
            teamName: p.teamName,
            role: p.role
          })) || []
        } : null
      }
    };
    
    console.log('Debug info:', debugInfo);
    
    res.json({
      success: true,
      data: debugInfo
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router; 