const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g. XRD, SEM, NMR
  description: { type: String },
  status: { 
    type: String, 
    enum: ['available', 'in-use', 'maintenance', 'offline'],
    default: 'available' 
  },
  requiresCertification: { type: String, default: 'none' }, // e.g. none, basic, advanced
  location: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Instrument', instrumentSchema);
