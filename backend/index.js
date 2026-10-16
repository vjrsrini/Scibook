const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const instrumentRoutes = require('./routes/instrumentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const seedDatabase = require('./seed');
const { setInMemory } = require('./dbHelper');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Attach Socket.io to Express App
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'SciBook — Scientific Equipment & Lab Booking API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      instruments: '/api/instruments',
      bookings: '/api/bookings'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SciBook Scientific Instrument Management API is running' });
});

io.on('connection', (socket) => {
  console.log('Client connected to WebSocket:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from WebSocket:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/instrument-booking';
  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to MongoDB database successfully!');
  } catch (err) {
    console.log('Local MongoDB not running. Activating Instant In-Memory Database Mode...');
    setInMemory(true);
    console.log('In-Memory Mode Active!');
  }
};

connectDB()
  .then(async () => {
    await seedDatabase();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
  });



