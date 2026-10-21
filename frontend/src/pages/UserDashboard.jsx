import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  HeartPulse,
  Stethoscope,
} from 'lucide-react';
import io from 'socket.io-client';
import useAuthStore from '../store/authStore';
import api, { socketUrl } from '../services/api';

const UserDashboard = () => {
  const { user, token } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/doctors')
        ]);
        
        setAppointments(appointmentsRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!token || user?.role !== 'patient') return undefined;

    const socket = io(socketUrl, { auth: { token } });
    socket.on('appointmentUpdated', (update) => {
      setAppointments((current) => current.map((appointment) => {
        if (appointment.doctor?._id !== update.doctorId) return appointment;
        return {
          ...appointment,
          turnNumber: update.newTurnNumbers?.[appointment._id] ?? appointment.turnNumber,
          status: update.completedAppointmentId === appointment._id
            ? 'completed'
            : appointment.status
        };
      }));
    });

    socket.on('connect_error', (error) => {
      console.error('Appointment updates connection failed:', error);
    });

    return () => socket.disconnect();
  }, [token, user?.role]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate) {
      toast.error('Please select both doctor and appointment date');
      return;
    }

    setIsBooking(true);
    try {
      const response = await api.post(
        '/appointments',
        {
          doctorId: selectedDoctor,
          date: new Date(appointmentDate).toISOString()
        }
      );

      setAppointments(prevAppointments => [...prevAppointments, response.data.appointment]);
      
      toast.success('Appointment booked successfully');
      
      setSelectedDoctor('');
      setAppointmentDate('');
    } catch (error) {
      console.error('Error booking appointment:', error.response?.data || error);
      toast.error(
        error.response?.data?.message || 
        'Failed to book appointment. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
          <p className="text-sm font-medium text-slate-500">Loading your care dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === 'pending'
  ).length;
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'completed'
  ).length;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-50 pb-16 pt-20">
      <div
        className="absolute -right-28 top-20 -z-10 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-28 top-[36rem] -z-10 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-6 pt-8 sm:px-8 lg:px-10">
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-800 to-teal-950 px-6 py-9 text-white shadow-xl shadow-teal-900/10 sm:px-10 sm:py-11">
          <div
            className="absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-48 right-36 -z-10 h-96 w-96 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute right-1/3 top-0 -z-10 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-100">
                <HeartPulse className="h-4 w-4" />
                Patient dashboard
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {user?.name || 'there'}
              </h1>
              <p className="mt-3 max-w-xl leading-7 text-teal-50/80">
                Your care, appointments, and next steps — all in one place.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <HeartPulse className="h-5 w-5 text-teal-100" />
              </div>
              <div>
                <p className="text-xs text-teal-100/80">Your health matters</p>
                <p className="text-sm font-bold">Care, at your pace</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Appointment overview" className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Total appointments',
              value: appointments.length,
              icon: Calendar,
              tone: 'bg-sky-50 text-sky-700',
            },
            {
              label: 'Awaiting your visit',
              value: pendingAppointments,
              icon: Clock,
              tone: 'bg-amber-50 text-amber-700',
            },
            {
              label: 'Completed visits',
              value: completedAppointments,
              icon: CheckCircle2,
              tone: 'bg-emerald-50 text-emerald-700',
            },
          ].map(({ label, value, icon: Icon, tone }) => (
            <article
              key={label}
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
                  Find your care
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Book an appointment</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Choose a doctor and a time that works for you.
                </p>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-5">
              <div>
                <label htmlFor="selectedDoctor" className="mb-2 block text-sm font-semibold text-slate-700">
                  Select a doctor
                </label>
                <select
                  id="selectedDoctor"
                  required
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                {doctors.length === 0 && (
                  <p className="mt-2 text-sm text-amber-700">
                    No doctors are available yet. Please try again later.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="appointmentDate" className="mb-2 block text-sm font-semibold text-slate-700">
                  Appointment date &amp; time
                </label>
                <input
                  id="appointmentDate"
                  type="datetime-local"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                />
              </div>
              <button
                type="submit"
                disabled={isBooking || doctors.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isBooking ? 'Booking appointment...' : 'Book appointment'}
                {!isBooking && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
                  Your care schedule
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Your appointments</h2>
              </div>
              <span className="text-sm text-slate-500">
                {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {appointments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <p className="mt-4 font-semibold text-slate-900">No appointments yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Your upcoming visits will appear here after booking.
                  </p>
                </div>
              ) : (
                appointments.map((appointment) => {
                  const isCompleted = appointment.status === 'completed';
                  const isFirstInQueue = appointment.status === 'pending' && appointment.turnNumber === 1;

                  return (
                    <article
                      key={appointment._id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/20 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-teal-50 text-teal-700'
                          }`}
                        >
                          {isCompleted ? (
                            <Calendar className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            Dr. {appointment.doctor?.name || 'Doctor'}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {new Date(appointment.date).toLocaleString()}
                          </p>
                          {appointment.status === 'pending' && (
                            <p className={`mt-2 text-sm font-medium ${isFirstInQueue ? 'text-amber-700' : 'text-slate-600'}`}>
                              {isFirstInQueue
                                ? 'You’re first in the queue'
                                : `Turn number: ${appointment.turnNumber}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {appointment.status === 'pending' && appointment.turnNumber > 1 && (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                            {appointment.turnNumber} in queue
                          </span>
                        )}
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700'
                              : isFirstInQueue
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-teal-50 text-teal-700'
                          }`}
                        >
                          {isCompleted ? 'Completed' : isFirstInQueue ? 'First in queue' : 'Pending'}
                        </span>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default UserDashboard;