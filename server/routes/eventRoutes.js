const express = require('express');
const Event = require('../models/Event');
const { optionalAuth, authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Events (Public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .select('title description category date venue teamSize isRegistrationOpen poster registrationDeadline')
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

// Get upcoming events with limit
router.get('/upcoming/limit/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 6;
    const now = new Date();
    
    const events = await Event.find({ 
      date: { $gt: now },
      isActive: true 
    })
    .select('title description category date venue teamSize isRegistrationOpen poster registrationDeadline')
    .sort({ date: 1 })
    .limit(limit);

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Events by Category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const events = await Event.find({ 
      category: { $regex: new RegExp(category, 'i') },
      isActive: true 
    })
    .select('title description category date venue teamSize isRegistrationOpen poster registrationDeadline')
    .sort({ date: 1 });

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get events by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Search Events
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const events = await Event.find({
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { description: { $regex: new RegExp(query, 'i') } },
        { category: { $regex: new RegExp(query, 'i') } }
      ],
      isActive: true
    })
    .select('title description category date venue teamSize isRegistrationOpen poster registrationDeadline')
    .sort({ date: 1 });

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Event Registration Status (for logged in users)
router.get('/:eventId/registration-status', optionalAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    if (!req.user) {
      return res.json({
        success: true,
        data: {
          isLoggedIn: false,
          canRegister: false,
          message: 'Please login to register for events'
        }
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const isRegistered = event.participants.some(
      p => p.userId.toString() === req.user._id.toString()
    );

    const canRegister = event.isRegistrationOpen && !isRegistered;

    res.json({
      success: true,
      data: {
        isLoggedIn: true,
        isRegistered,
        canRegister,
        eventDetails: {
          title: event.title,
          teamSize: event.teamSize,
          currentTeams: event.currentTeams,
          maxTeams: event.maxTeams,
          registrationDeadline: event.registrationDeadline
        }
      }
    });

  } catch (error) {
    console.error('Get registration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Event Participants (Public - limited info)
router.get('/:eventId/participants', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('participants.userId', 'name userId')
      .select('participants teamName');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Group participants by team for better organization
    const teamMap = new Map();
    
    event.participants.forEach(p => {
      if (!teamMap.has(p.teamName)) {
        teamMap.set(p.teamName, {
          teamName: p.teamName,
          members: []
        });
      }
      
      teamMap.get(p.teamName).members.push({
        participantName: p.userId ? p.userId.name : 'Anonymous',
        participantId: p.userId ? p.userId.userId : 'N/A',
        role: p.role || 'member'
      });
    });

    // Convert to array and sort by team name
    const teams = Array.from(teamMap.values()).sort((a, b) => a.teamName.localeCompare(b.teamName));

    res.json({
      success: true,
      data: {
        eventId,
        totalTeams: teams.length,
        totalParticipants: event.participants.length,
        teams
      }
    });

  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Event Registration Route (Protected)
router.post('/:eventId/register', authenticateUser, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { teamName, member2, member3, member4, termsAccepted } = req.body;
    
    console.log('Event registration attempt:', {
      eventId,
      userId: req.user._id,
      userUserId: req.user.userId,
      teamName,
      member2,
      member3,
      member4,
      termsAccepted
    });
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is already registered (double-check with both ObjectId and userId)
    const isAlreadyRegistered = event.participants.some(p => 
      p.userId.toString() === req.user._id.toString() || 
      p.userId === req.user.userId
    );
    
    console.log('Registration check:', {
      eventParticipants: event.participants.map(p => ({ userId: p.userId, userIdString: p.userId.toString() })),
      currentUserId: req.user._id,
      currentUserUserId: req.user.userId,
      isAlreadyRegistered
    });
    
    if (isAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event is active
    if (!event.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Event is not active'
      });
    }

    // Check if registration is open
    if (new Date() >= new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Event registration is closed'
      });
    }

    // Check if teams are full
    if (event.currentTeams >= event.maxTeams) {
      return res.status(400).json({
        success: false,
        message: 'Maximum teams reached for this event'
      });
    }

    // Validate team size
    const teamMembers = [member2, member3, member4].filter(m => m && m.trim());
    const totalTeamSize = teamMembers.length + 1; // +1 for team leader
    
    if (totalTeamSize < event.teamSize.min || totalTeamSize > event.teamSize.max) {
      return res.status(400).json({
        success: false,
        message: `Team size must be between ${event.teamSize.min} and ${event.teamSize.max} members. Current team size: ${totalTeamSize}`
      });
    }

    // Validate team members - prevent duplicate IDs and self-registration
    const uniqueMemberIds = new Set();
    const currentUserId = req.user.userId;
    
    // Check if team leader is trying to add themselves
    if (teamMembers.includes(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add yourself as a team member. You are already the team leader.'
      });
    }
    
    // Check for duplicate member IDs
    for (const memberId of teamMembers) {
      if (uniqueMemberIds.has(memberId)) {
        return res.status(400).json({
          success: false,
          message: `Duplicate team member ID: ${memberId}. Each member must have a unique ID.`
        });
      }
      uniqueMemberIds.add(memberId);
    }

    // Import User model at the top level
    const User = require('../models/User');
    
    // Validate that all team member IDs actually exist in the database
    let existingMembers = [];
    if (teamMembers.length > 0) {
      const nonExistentMembers = [];
      
      for (const memberId of teamMembers) {
        if (memberId.trim()) {
          const member = await User.findOne({ userId: memberId });
          if (member) {
            existingMembers.push({
              userId: memberId,
              name: member.name,
              userObject: member
            });
          } else {
            nonExistentMembers.push(memberId);
          }
        }
      }
      
      // If any member IDs don't exist, return error
      if (nonExistentMembers.length > 0) {
        return res.status(400).json({
          success: false,
          message: `The following team member IDs do not exist: ${nonExistentMembers.join(', ')}. Please check the IDs and try again.`
        });
      }
      
      // Check if minimum team size is met with existing members
      if (existingMembers.length + 1 < event.teamSize.min) {
        return res.status(400).json({
          success: false,
          message: `This event requires at least ${event.teamSize.min} team members. You have ${existingMembers.length + 1} members.`
        });
      }
    }

    // Check terms acceptance
    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the terms and conditions'
      });
    }

    // Add user as participant to event
    event.participants.push({
      userId: req.user._id,
      teamName,
      role: 'team_leader',
      registrationDate: new Date()
    });

    // Increment team count
    event.currentTeams += 1;

    // Update user's participatedEvents array
    const user = await User.findById(req.user._id);
    user.participatedEvents.push({
      eventId: event._id,
      teamName,
      role: 'team_leader',
      teamMembers: [], // Will be populated below
      registrationDate: new Date()
    });

    // Save both event and user atomically
    await Promise.all([event.save(), user.save()]);

    // If there are team members, add them to the event as well
    if (teamMembers.length > 0) {
      const teamMemberDetails = [];
      
      // Use the validated member data from earlier validation
      for (const memberData of existingMembers) {
        // Add team member to event participants
        event.participants.push({
          userId: memberData.userObject._id, // Use the actual ObjectId from the found user
          teamName,
          role: 'member',
          registrationDate: new Date()
        });

        // Update team member's participatedEvents with complete team information
        // Exclude the current member from their own teamMembers array to avoid duplication
        const otherTeamMembers = teamMembers
          .filter(memberId => memberId !== memberData.userId) // Exclude current member
          .map(memberId => {
            const member = existingMembers.find(m => m.userId === memberId);
            return {
              userId: member.userId,
              name: member.name
            };
          });

        memberData.userObject.participatedEvents.push({
          eventId: event._id,
          teamName,
          role: 'member',
          teamLeader: {
            userId: req.user.userId,
            name: req.user.name
          },
          teamMembers: otherTeamMembers, // Only other members, not including self
          registrationDate: new Date()
        });
        await memberData.userObject.save();
        
        // Add to team member details for team leader
        teamMemberDetails.push({
          userId: memberData.userId,
          name: memberData.name
        });
      }
      
      // Update team leader's participatedEvents with member details
      const teamLeaderParticipation = user.participatedEvents[user.participatedEvents.length - 1];
      teamLeaderParticipation.teamMembers = teamMemberDetails;
      await user.save();
      
      // Save event again with team members
      await event.save();
    } else {
      // Solo registration - no team members
      // Update team leader's participatedEvents (empty teamMembers array)
      const teamLeaderParticipation = user.participatedEvents[user.participatedEvents.length - 1];
      teamLeaderParticipation.teamMembers = [];
      await user.save();
    }

    res.json({
      success: true,
      message: 'Event registration successful!',
      data: {
        eventId,
        teamName,
        teamSize: teamMembers.length + 1,
        message: 'You have been successfully registered for this event'
      }
    });

  } catch (error) {
    console.error('Event registration error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    console.error('User ID:', req.user?._id);
    console.error('Event ID:', req.params.eventId);
    
    res.status(500).json({
      success: false,
      message: 'Server error during event registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get Event by ID (Public) - This should be last to avoid conflicts
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('participants.userId', 'name userId')
      .select('-__v -participants -currentTeams');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event is not active'
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

// Utility function to clean duplicate team members
const cleanTeamMembers = (teamMembers) => {
  if (!teamMembers || !Array.isArray(teamMembers)) return [];
  
  const uniqueMembers = [];
  const seenIds = new Set();
  
  teamMembers.forEach(member => {
    if (member && member.userId && !seenIds.has(member.userId)) {
      seenIds.add(member.userId);
      uniqueMembers.push(member);
    }
  });
  
  return uniqueMembers;
};

// Get Complete Team Information for an Event (for debugging)
router.get('/:eventId/team-info', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('participants.userId', 'name userId')
      .select('participants teamName');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Group participants by team and show complete team structure
    const teamMap = new Map();
    
    event.participants.forEach(p => {
      if (!teamMap.has(p.teamName)) {
        teamMap.set(p.teamName, {
          teamName: p.teamName,
          members: [],
          leader: null
        });
      }
      
      const team = teamMap.get(p.teamName);
      const participantInfo = {
        participantName: p.userId ? p.userId.name : 'Anonymous',
        participantId: p.userId ? p.userId.userId : 'N/A',
        role: p.role || 'member',
        userId: p.userId ? p.userId._id : null
      };
      
      if (p.role === 'team_leader') {
        team.leader = participantInfo;
      } else {
        team.members.push(participantInfo);
      }
    });

    // Convert to array and sort by team name
    const teams = Array.from(teamMap.values()).sort((a, b) => a.teamName.localeCompare(b.teamName));

    res.json({
      success: true,
      data: {
        eventId,
        totalTeams: teams.length,
        totalParticipants: event.participants.length,
        teams
      }
    });

  } catch (error) {
    console.error('Get team info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Clean up duplicate team members in existing registrations (Admin/Utility route)
router.post('/cleanup-duplicates', async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Find all users with participatedEvents
    const users = await User.find({ 'participatedEvents.0': { $exists: true } });
    let cleanedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      
      user.participatedEvents.forEach(participation => {
        if (participation.teamMembers && Array.isArray(participation.teamMembers)) {
          const originalLength = participation.teamMembers.length;
          participation.teamMembers = cleanTeamMembers(participation.teamMembers);
          
          if (participation.teamMembers.length !== originalLength) {
            needsUpdate = true;
            cleanedCount++;
          }
        }
      });
      
      if (needsUpdate) {
        await user.save();
      }
    }
    
    res.json({
      success: true,
      message: `Cleaned up duplicate team members in ${cleanedCount} participations`,
      data: { cleanedCount }
    });
    
  } catch (error) {
    console.error('Cleanup duplicates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during cleanup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 