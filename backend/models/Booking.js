const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  instrument: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending' 
  },
  usageLogs: {
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    notes: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
