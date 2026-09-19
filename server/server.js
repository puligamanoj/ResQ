require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const emergencyRoutes = require('./routes/emergencyRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const roadRoutes = require('./routes/roadRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/resq_db';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

app.set('socketio', io);

// Express Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'OK',
    message: 'ResQ Backend & Real-Time Engine Active',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/roads', roadRoutes);
app.use('/api/assignments', assignmentRoutes);

// Global Error Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
});

// Socket.IO Connections
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB & Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => {
      console.log(`ResQ server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
