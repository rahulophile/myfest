const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Get all faculty members
router.get('/', async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true }).sort({ name: 1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty members', error: error.message });
  }
});

// Get faculty member by ID
router.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty member', error: error.message });
  }
});

// Create new faculty member (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ message: 'Error creating faculty member', error: error.message });
  }
});

// Update faculty member (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ message: 'Error updating faculty member', error: error.message });
  }
});

// Delete faculty member (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting faculty member', error: error.message });
  }
});

// Get faculty by event
router.get('/event/:eventName', async (req, res) => {
  try {
    const faculty = await Faculty.find({
      isActive: true,
      assignedEvents: { $in: [req.params.eventName] }
    }).sort({ name: 1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty by event', error: error.message });
  }
});

module.exports = router; 