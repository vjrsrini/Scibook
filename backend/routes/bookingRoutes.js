const express = require('express');
const router = express.Router();
const { getBookingModel, getInstrumentModel } = require('../dbHelper');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all bookings (Admin/Operator sees all, users see their own)
router.get('/', protect, async (req, res) => {
  try {
    const Booking = getBookingModel();
    const query = (req.user.role === 'admin' || req.user.role === 'operator') ? {} : { user: req.user._id };
    const bookings = await Booking.find(query)
      .populate('instrument', 'name category status location requiresCertification')
      .populate('user', 'name email role certificationLevel')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking
router.post('/', protect, async (req, res) => {
  try {
    const Booking = getBookingModel();
    const Instrument = getInstrumentModel();
    const { instrumentId, startTime, endTime } = req.body;
    
    if (!instrumentId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Instrument, start time, and end time are required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const instrument = await Instrument.findById(instrumentId);
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }

    if (instrument.status === 'maintenance' || instrument.status === 'offline') {
      return res.status(400).json({ message: `Instrument is currently ${instrument.status}` });
    }

    // Check overlap with active bookings
    const conflict = await Booking.findOne({
      instrument: instrumentId,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: 'Instrument is already booked for this requested time slot' });
    }

    const booking = await Booking.create({
      instrument: instrumentId,
      user: req.user._id,
      startTime: start,
      endTime: end,
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id);

    const io = req.app.get('io');
    if (io) io.emit('bookingCreated', populatedBooking);

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking status (Admin/Operator)
router.put('/:id/status', protect, authorize('admin', 'operator'), async (req, res) => {
  try {
    const Booking = getBookingModel();
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const io = req.app.get('io');
    if (io) io.emit('bookingUpdated', booking);

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel / Delete Booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const Booking = getBookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    if (bookingUserId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    if (booking.save) await booking.save();

    const io = req.app.get('io');
    if (io) io.emit('bookingUpdated', booking);

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


