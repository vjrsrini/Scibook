const bcrypt = require('bcryptjs');
const { getUserModel, getInstrumentModel, getBookingModel } = require('./dbHelper');

const seedDatabase = async () => {
  try {
    const User = getUserModel();
    const Instrument = getInstrumentModel();
    const Booking = getBookingModel();

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already initialized with data.');
      return;
    }

    console.log('Seeding initial demo data...');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Dr. Sarah Connor (Lab Admin)',
      email: 'admin@scibook.io',
      password: passwordHash,
      role: 'admin',
      certificationLevel: 'advanced'
    });

    const researcher = await User.create({
      name: 'Dr. Alex Rivera (Researcher)',
      email: 'researcher@scibook.io',
      password: passwordHash,
      role: 'researcher',
      certificationLevel: 'advanced'
    });

    const student = await User.create({
      name: 'Jordan Lee (Student)',
      email: 'student@scibook.io',
      password: passwordHash,
      role: 'student',
      certificationLevel: 'basic'
    });

    const sem = await Instrument.create({
      name: 'JEOL JSM-7900F Field Emission SEM',
      category: 'Microscopy',
      description: 'Ultra-high resolution field emission scanning electron microscope with EDS analysis.',
      status: 'available',
      requiresCertification: 'advanced',
      location: 'Room 102 - Nanofab Suite'
    });

    const xrd = await Instrument.create({
      name: 'Bruker D8 ADVANCE XRD',
      category: 'X-Ray Crystallography',
      description: 'X-Ray diffractometer for phase identification and crystal structure determination.',
      status: 'available',
      requiresCertification: 'basic',
      location: 'Room 105 - Characterization Suite'
    });

    const nmr = await Instrument.create({
      name: 'Bruker Avance III HD 600 MHz NMR',
      category: 'Spectroscopy',
      description: 'High-field liquid-state nuclear magnetic resonance spectrometer.',
      status: 'in-use',
      requiresCertification: 'advanced',
      location: 'Room 108 - Spectroscopy Wing'
    });

    const confocal = await Instrument.create({
      name: 'Leica SP8 Confocal Laser Microscope',
      category: 'Microscopy',
      description: 'High-speed spectral confocal imaging system for live biological samples.',
      status: 'available',
      requiresCertification: 'basic',
      location: 'Room 201 - Bio-Imaging Lab'
    });

    const massSpec = await Instrument.create({
      name: 'Thermo Orbitrap Exploris 240 Mass Spec',
      category: 'Mass Spectrometry',
      description: 'High resolution accurate-mass mass spectrometer for proteomics and metabolomics.',
      status: 'maintenance',
      requiresCertification: 'advanced',
      location: 'Room 204 - Analytical Chem'
    });

    const now = new Date();
    const startTime1 = new Date(now.getTime() + 2 * 3600 * 1000);
    const endTime1 = new Date(now.getTime() + 4 * 3600 * 1000);

    await Booking.create({
      instrument: sem._id,
      user: researcher._id,
      startTime: startTime1,
      endTime: endTime1,
      status: 'approved'
    });

    const startTime2 = new Date(now.getTime() + 24 * 3600 * 1000);
    const endTime2 = new Date(now.getTime() + 26 * 3600 * 1000);

    await Booking.create({
      instrument: xrd._id,
      user: student._id,
      startTime: startTime2,
      endTime: endTime2,
      status: 'pending'
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
