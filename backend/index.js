import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Appointment from './models/Appointment.js';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import doctorRoutes from './routes/doctors.js';

dotenv.config();

const app = express();
const server = createServer(app);
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const frontendOrigins = new Set([frontendOrigin]);

if (process.env.NODE_ENV !== 'production') {
  [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ].forEach((origin) => frontendOrigins.add(origin));
}
const allowedFrontendOrigins = [...frontendOrigins];

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedFrontendOrigins,
    methods: ["GET", "POST", "PATCH"]
  }
});
app.set('io', io);

// Middleware
app.use(cors({ origin: allowedFrontendOrigins }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded.user;
    next();
  } catch (error) {
    next(new Error('Invalid authentication token'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  const { id, role } = socket.data.user;
  if (role === 'doctor') {
    socket.join(`doctor:${id}`);
  } else {
    socket.join(`patient:${id}`);
    Appointment.distinct('doctor', { patient: id })
      .then((doctorIds) => {
        doctorIds.forEach((doctorId) => socket.join(`doctor:${doctorId}`));
      })
      .catch((error) => {
        console.error('Failed to subscribe patient to appointment updates:', error);
        socket.disconnect(true);
      });
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});