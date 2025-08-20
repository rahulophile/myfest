const express = require('express');
const router = express.Router();
const StudentTeam = require('../models/StudentTeam');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Get all student team members
router.get('/', async (req, res) => {
  try {
    const students = await StudentTeam.find({ isActive: true }).sort({ name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student team members', error: error.message });
  }
});

// Get student team member by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await StudentTeam.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student team member not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student team member', error: error.message });
  }
});

// Create new student team member (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const student = new StudentTeam(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error creating student team member', error: error.message });
  }
});

// Update student team member (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const student = await StudentTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student team member not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error updating student team member', error: error.message });
  }
});

// Delete student team member (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const student = await StudentTeam.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student team member not found' });
    }
    res.json({ message: 'Student team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student team member', error: error.message });
  }
});

// Get student team members by event
router.get('/event/:eventName', async (req, res) => {
  try {
    const students = await StudentTeam.find({
      isActive: true,
      assignedEvents: { $in: [req.params.eventName] }
    }).sort({ name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student team members by event', error: error.message });
  }
});

module.exports = router; 