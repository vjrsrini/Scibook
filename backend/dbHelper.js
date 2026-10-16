const User = require('./models/User');
const Instrument = require('./models/Instrument');
const Booking = require('./models/Booking');
const memoryDb = require('./memoryDb');

let inMemory = false;

module.exports = {
  setInMemory: (val) => {
    inMemory = val;
    memoryDb.setInMemoryMode(val);
  },
  isInMemory: () => inMemory,
  getUserModel: () => (inMemory ? memoryDb.User : User),
  getInstrumentModel: () => (inMemory ? memoryDb.Instrument : Instrument),
  getBookingModel: () => (inMemory ? memoryDb.Booking : Booking)
};
