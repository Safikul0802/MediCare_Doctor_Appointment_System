import express from 'express';
import Appointment from '../models/Appointment.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get appointments for the logged-in user (either doctor or patient)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Fetching appointments for user:', {
      userId: user._id,
      role: user.role
    });

    let query = {};
    if (user.role === 'doctor') {
      query.doctor = user._id;
    } else {
      query.patient = user._id;
    }

 

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name email specialization profilePicture')
      .populate('patient', 'name email profilePicture')
      .sort({ date: 1 });

    console.log('Found appointments:', appointments.length);

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
  try {
    const patient = await User.findById(req.user.id).select('role');
    if (!patient) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (patient.role !== 'patient') {
      return res.status(403).json({
        message: 'This account is registered as a doctor. Log in with a patient account to book an appointment.'
      });
    }

    const { doctorId, date } = req.body;

    // Validate required fields
    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Appointment date is required' });
    }

    const appointmentDate = new Date(date);
    if (Number.isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }

    // Validate doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    console.log('Creating appointment with data:', {
      doctorId,
      patientId: req.user.id,
      date
    });

    const { start: dayStart, end: dayEnd } = getUtcDayBounds(appointmentDate);
    const pendingAppointments = await Appointment.find({
      doctor: doctorId,
      status: 'pending',
      date: { $gte: dayStart, $lt: dayEnd }
    });

    const appointment = new Appointment({
      doctor: doctorId,
      patient: req.user.id,
      date: appointmentDate,
      status: 'pending',
      turnNumber: pendingAppointments.length + 1
    });

    await appointment.save();

    const newTurnNumbers = await renumberPendingAppointments(doctorId, appointmentDate);
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name email specialization profilePicture')
      .populate('patient', 'name email profilePicture');

    const stats = await getUpdatedStats(doctorId);
    const update = {
      doctorId: doctorId.toString(),
      newTurnNumbers,
      stats,
      refreshAppointments: true
    };
    const io = req.app.get('io');
    io?.in(`patient:${req.user.id}`).socketsJoin(`doctor:${doctorId}`);
    io?.to(`doctor:${doctorId}`).emit('appointmentUpdated', update);

    res.status(201).json({
      appointment: populatedAppointment,
      stats
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid appointment data', 
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor's statistics
router.get('/doctor/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const doctorId = req.user.id;

    // Get all appointments for the doctor
    const allAppointments = await Appointment.find({ 
      doctor: doctorId,
    });
    
    // Calculate total, completed, and pending appointments
    const totalAppointments = allAppointments.length;
    const completedAppointments = allAppointments.filter(apt => apt.status === 'completed').length;
    const pendingAppointments = allAppointments.filter(apt => apt.status === 'pending').length;

    // Calculate monthly data using JavaScript instead of MongoDB aggregation
    const monthlyData = [];
    const months = {};

    // Group appointments by year and month
    allAppointments.forEach(apt => {
      const year = apt.date.getFullYear();
      const month = apt.date.getMonth() + 1; // getMonth() returns 0-11
      const key = `${year}-${month}`;
      
      if (!months[key]) {
        months[key] = {
          _id: { year, month },
          count: 0
        };
      }
      months[key].count++;
    });

    // Convert to array and sort
    monthlyData.push(...Object.values(months));
    monthlyData.sort((a, b) => {
      if (a._id.year !== b._id.year) {
        return a._id.year - b._id.year;
      }
      return a._id.month - b._id.month;
    });

    console.log('Monthly data:', monthlyData);

    // Calculate weekly data
    const weeklyData = [];
    const days = {};
    
    // Group appointments by day of week (1 = Monday, 7 = Sunday)
    allAppointments.forEach(apt => {
      // Convert Sunday (0) to 7, and other days to 1-6
      let dayOfWeek = apt.date.getDay();
      dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      
      if (!days[dayOfWeek]) {
        days[dayOfWeek] = {
          _id: { dayOfWeek },
          count: 0
        };
      }
      days[dayOfWeek].count++;
    });

    // Convert to array and sort by day
    weeklyData.push(...Object.values(days));
    weeklyData.sort((a, b) => a._id.dayOfWeek - b._id.dayOfWeek);

    console.log('Weekly data before formatting:', weeklyData);

    // Create the final array with all days (even those with 0 appointments)
    const formattedWeeklyData = [];
    for (let i = 1; i <= 7; i++) {
      const dayData = weeklyData.find(d => d._id.dayOfWeek === i);
      formattedWeeklyData.push({
        _id: { dayOfWeek: i },
        count: dayData ? dayData.count : 0
      });
    }

    console.log('Final weekly data:', formattedWeeklyData);

    res.json({
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      monthlyData,
      weeklyData: formattedWeeklyData
    });
  } catch (error) {
    console.error('Error fetching doctor stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark appointment as completed
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'doctor' || appointment.doctor?._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending appointments can be completed' });
    }

    // Mark the appointment as completed
    appointment.status = 'completed';
    await appointment.save();

    const newTurnNumbers = await renumberPendingAppointments(
      appointment.doctor._id,
      appointment.date
    );

    const stats = await getUpdatedStats(appointment.doctor._id);
    const update = {
      doctorId: appointment.doctor._id.toString(),
      completedAppointmentId: appointment._id.toString(),
      newTurnNumbers,
      stats
    };
    req.app.get('io')?.to(`doctor:${appointment.doctor._id}`).emit('appointmentUpdated', update);

    res.json({ 
      message: 'Appointment completed successfully',
      completedAppointmentId: appointment._id.toString(),
      newTurnNumbers,
      stats
    });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

function getUtcDayBounds(date) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

async function renumberPendingAppointments(doctorId, date) {
  const { start, end } = getUtcDayBounds(date);
  const appointments = await Appointment.find({
    doctor: doctorId,
    status: 'pending',
    date: { $gte: start, $lt: end }
  }).sort({ date: 1, _id: 1 });
  const newTurnNumbers = {};

  for (let index = 0; index < appointments.length; index++) {
    const appointment = appointments[index];
    const turnNumber = index + 1;
    if (appointment.turnNumber !== turnNumber) {
      appointment.turnNumber = turnNumber;
      await appointment.save();
      newTurnNumbers[appointment._id.toString()] = turnNumber;
    }
  }

  return newTurnNumbers;
}

async function getUpdatedStats(doctorId) {
  const allAppointments = await Appointment.find({ doctor: doctorId });
  
  const totalAppointments = allAppointments.length;
  const completedAppointments = allAppointments.filter(apt => apt.status === 'completed').length;
  const pendingAppointments = allAppointments.filter(apt => apt.status === 'pending').length;

  return {
    totalAppointments,
    completedAppointments,
    pendingAppointments
  };
}

export default router;