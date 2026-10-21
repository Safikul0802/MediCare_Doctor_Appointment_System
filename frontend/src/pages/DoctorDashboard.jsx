import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import io from 'socket.io-client';
import api, { socketUrl } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DoctorDashboard = () => {
  const { user, token } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    monthlyData: [],
    weeklyData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingAppointmentId, setCompletingAppointmentId] = useState(null);

  useEffect(() => {
    if (!token || !user) return;

    const newSocket = io(socketUrl, { auth: { token } });

    newSocket.on('appointmentUpdated', (update) => {
      if (update.stats) {
        setStats(prevStats => ({
          ...prevStats,
          ...update.stats
        }));
      }

      if (update.refreshAppointments) {
      api.get('/appointments')
        .then((response) => setAppointments(response.data || []))
        .catch((error) => {
          console.error('Failed to refresh appointments:', error);
          toast.error('Failed to refresh appointments');
        });
      }
      
      setAppointments(prevAppointments => {
        const updatedAppointments = prevAppointments.map((appointment) => {
          if (appointment.doctor?._id !== update.doctorId) return appointment;
          return {
            ...appointment,
            turnNumber: update.newTurnNumbers?.[appointment._id] ?? appointment.turnNumber,
            status: update.completedAppointmentId === appointment._id
              ? 'completed'
              : appointment.status
          };
        });

        return updatedAppointments;
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Appointment updates connection failed:', error);
    });

    return () => newSocket.disconnect();
  }, [token, user]);

  const fetchData = async () => {
    if (!token || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/appointments/doctor/stats')
      ]);

      setAppointments(appointmentsRes.data || []);
      
      // Process and set stats with detailed logging
      const statsData = statsRes.data || {};
      console.log('Raw stats data:', statsData);
      
      const processedStats = {
        totalAppointments: parseInt(statsData.totalAppointments) || 0,
        completedAppointments: parseInt(statsData.completedAppointments) || 0,
        pendingAppointments: parseInt(statsData.pendingAppointments) || 0,
        monthlyData: Array.isArray(statsData.monthlyData) ? statsData.monthlyData : [],
        weeklyData: Array.isArray(statsData.weeklyData) ? statsData.weeklyData : []
      };
      
      console.log('Processed stats:', processedStats);
      setStats(processedStats);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user]);

  const handleCompleteAppointment = async (appointmentId) => {
    setCompletingAppointmentId(appointmentId);
    try {
      const response = await api.patch(`/appointments/${appointmentId}/complete`);
      
      // Update local state with new turn numbers and stats
      setAppointments(prevAppointments => {
        return prevAppointments.map(apt => {
          const newTurnNumber = response.data.newTurnNumbers?.[apt._id];
          if (apt._id === appointmentId) {
            return { ...apt, status: 'completed' };
          }
          if (newTurnNumber !== undefined) {
            return { ...apt, turnNumber: newTurnNumber };
          }
          return apt;
        });
      });

      if (response.data.stats) {
        setStats(prevStats => ({
          ...prevStats,
          ...response.data.stats
        }));
      }

      toast.success('Appointment marked as completed');
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to complete appointment');
    } finally {
      setCompletingAppointmentId(null);
    }
  };

  // Chart data
  const getChartData = () => {
    try {
      console.log('Current stats in getChartData:', stats);

      // Ensure we have valid numbers for pie chart
      const completed = parseInt(stats.completedAppointments) || 0;
      const pending = parseInt(stats.pendingAppointments) || 0;

      // Pie Data
      const pieData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [completed, pending],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(234, 179, 8, 0.8)'
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(234, 179, 8)'
          ],
          borderWidth: 1
        }]
      };

      // Monthly Data
      const monthlyData = {
        labels: [],
        datasets: [{
          label: 'Monthly Appointments',
          data: [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
          fill: true
        }]
      };

      // Weekly Data
      const weeklyData = {
        labels: [],
        datasets: [{
          label: 'Weekly Appointments',
          data: [],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
          fill: true
        }]
      };

      // Process monthly data if available
      if (Array.isArray(stats.monthlyData) && stats.monthlyData.length > 0) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthlyData.labels = stats.monthlyData.map(item => {
          const monthIndex = (item._id?.month || item.month) - 1;
          return monthNames[monthIndex] || `Month ${monthIndex + 1}`;
        });
        monthlyData.datasets[0].data = stats.monthlyData.map(item => parseInt(item.count) || 0);
      }

      // Process weekly data if available
      if (Array.isArray(stats.weeklyData) && stats.weeklyData.length > 0) {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        // Debug the incoming data
        console.log('Weekly Data from server:', stats.weeklyData);

        // Map the data directly since it's already in the correct order (Monday=1 to Sunday=7)
        weeklyData.labels = dayNames;
        weeklyData.datasets[0] = {
          label: 'Weekly Appointments',
          data: stats.weeklyData.map(day => parseInt(day.count) || 0),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgb(34, 197, 94)'
        };

        // Debug the processed data
        console.log('Processed weekly data:', {
          labels: weeklyData.labels,
          data: weeklyData.datasets[0].data
        });
      } else {
        console.warn('No weekly data available:', stats.weeklyData);
        weeklyData.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        weeklyData.datasets[0] = {
          label: 'Weekly Appointments',
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgb(34, 197, 94)'
        };
      }

      // Add debug logging
      console.log('Processed chart data:', {
        pieData,
        monthlyData,
        weeklyData
      });

      return {
        monthlyData,
        weeklyData,
        pieData
      };
    } catch (error) {
      console.error('Error in getChartData:', error);
      // Return empty datasets with proper structure
      return {
        monthlyData: {
          labels: [],
          datasets: [{
            label: 'Monthly Appointments',
            data: [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.4,
            fill: true
          }]
        },
        weeklyData: {
          labels: [],
          datasets: [{
            label: 'Weekly Appointments',
            data: [],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            tension: 0.4,
            fill: true
          }]
        },
        pieData: {
          labels: ['Completed', 'Pending'],
          datasets: [{
            data: [0, 0],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(234, 179, 8, 0.8)'
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(234, 179, 8)'
            ],
            borderWidth: 1
          }]
        }
      };
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
          <p className="text-sm font-medium text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-6 pt-16">
        <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Activity className="h-6 w-6" />
          </div>
          <p className="mt-4 text-xl font-bold text-slate-900">Unable to load dashboard</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const todayAppointments = appointments
    .filter(apt => new Date(apt.date).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.turnNumber - b.turnNumber);
  const scheduledAppointments = [...appointments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="min-h-screen bg-slate-50 pb-16 pt-20">
      <div className="mx-auto max-w-7xl space-y-8 px-6 pt-8 sm:px-8 lg:px-10">
        <section className="relative isolate overflow-hidden rounded-3xl bg-teal-800 px-6 py-9 text-white shadow-xl shadow-teal-900/10 sm:px-10 sm:py-11">
          <div
            className="absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-48 right-36 -z-10 h-96 w-96 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-200">
                Doctor dashboard
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, Dr. {user?.name || ''}
              </h1>
              <p className="mt-3 max-w-xl leading-7 text-teal-50/80">
                Here’s an overview of your practice and today’s patient schedule.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Stethoscope className="h-5 w-5 text-teal-100" />
              </div>
              <div>
                <p className="text-xs text-teal-100/80">Today’s appointments</p>
                <p className="text-lg font-bold">{todayAppointments.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Appointment statistics" className="grid gap-5 sm:grid-cols-3">
          {[
            {
              label: 'Total appointments',
              value: stats.totalAppointments,
              icon: Users,
              style: 'bg-sky-50 text-sky-700',
            },
            {
              label: 'Completed',
              value: stats.completedAppointments,
              icon: CheckCircle,
              style: 'bg-emerald-50 text-emerald-700',
            },
            {
              label: 'Pending',
              value: stats.pendingAppointments,
              icon: Clock,
              style: 'bg-amber-50 text-amber-700',
            },
          ].map(({ label, value, icon: Icon, style }) => (
            <article
              key={label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${style}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section aria-label="Appointment analytics" className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Monthly trend</h2>
                <p className="text-xs text-slate-500">Appointments over time</p>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <Line data={chartData.monthlyData} options={chartOptions} />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Appointment status</h2>
                <p className="text-xs text-slate-500">Completed vs pending</p>
              </div>
            </div>
            <div className="flex h-[260px] w-full items-center justify-center">
              <Doughnut data={chartData.pieData} options={pieOptions} />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Weekly distribution</h2>
                <p className="text-xs text-slate-500">Appointments by weekday</p>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <Line data={chartData.weeklyData} options={chartOptions} />
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
                Patient schedule
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">All appointments</h2>
            </div>
            <span className="text-sm text-slate-500">
              {scheduledAppointments.length} {scheduledAppointments.length === 1 ? 'appointment' : 'appointments'}
            </span>
          </div>

          <div className="mt-5 max-h-[440px] space-y-3 overflow-y-auto">
            {scheduledAppointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <Calendar className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold text-slate-900">No appointments yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Patients who book an appointment will appear here.
                </p>
              </div>
            ) : (
              scheduledAppointments.map((appointment) => {
                const isCompleted = appointment.status === 'completed';
                const isCancelled = appointment.status === 'cancelled';
                const isNext = appointment.status === 'pending' && appointment.turnNumber === 1;

                return (
                  <article
                    key={appointment._id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 p-4 transition hover:border-teal-200 hover:bg-teal-50/20 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-teal-50 text-teal-700'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {appointment.patient?.name || 'Patient'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(appointment.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700'
                            : isCancelled
                            ? 'bg-slate-100 text-slate-600'
                            : isNext
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-sky-50 text-sky-700'
                        }`}
                      >
                        {isCompleted
                          ? 'Completed'
                          : isCancelled
                          ? 'Cancelled'
                          : isNext
                          ? 'Next in line'
                          : `Turn ${appointment.turnNumber}`}
                      </span>
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleCompleteAppointment(appointment._id)}
                          disabled={completingAppointmentId === appointment._id}
                          className="rounded-full bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                        >
                          {completingAppointmentId === appointment._id ? 'Updating...' : 'Mark complete'}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default DoctorDashboard;