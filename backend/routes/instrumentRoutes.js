const express = require('express');
const router = express.Router();
const { getInstrumentModel } = require('../dbHelper');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all instruments with optional filter & search
router.get('/', protect, async (req, res) => {
  try {
    const Instrument = getInstrumentModel();
    const { category, search, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const instruments = await Instrument.find(query).sort({ createdAt: -1 });
    res.json(instruments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Instrument (Admin/Operator)
router.post('/', protect, authorize('admin', 'operator'), async (req, res) => {
  try {
    const Instrument = getInstrumentModel();
    const instrument = await Instrument.create(req.body);
    const io = req.app.get('io');
    if (io) io.emit('instrumentCreated', instrument);
    res.status(201).json(instrument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Instrument (Admin/Operator)
router.put('/:id', protect, authorize('admin', 'operator'), async (req, res) => {
  try {
    const Instrument = getInstrumentModel();
    const instrument = await Instrument.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }
    const io = req.app.get('io');
    if (io) io.emit('instrumentUpdated', instrument);
    res.json(instrument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Instrument (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const Instrument = getInstrumentModel();
    const instrument = await Instrument.findByIdAndDelete(req.params.id);
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }
    const io = req.app.get('io');
    if (io) io.emit('instrumentDeleted', req.params.id);
    res.json({ message: 'Instrument deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


