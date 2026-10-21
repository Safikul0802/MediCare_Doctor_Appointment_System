import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowRight, Heart, Lock, Mail, ShieldCheck, Stethoscope } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const getTokenUser = (token) => {
  const payload = token.split('.')[1];
  if (!payload) return null;

  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='));
  const claims = JSON.parse(decodedPayload);
  return claims.user || null;
};

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token } = response.data || {};

      if (!token) {
        throw new Error('The login response did not include an authentication token');
      }

      let user = response.data?.user?.user || response.data?.user;
      if (!user || !['doctor', 'patient'].includes(user.role)) {
        try {
          const verifiedUserResponse = await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          user = verifiedUserResponse.data?.user || verifiedUserResponse.data;
        } catch (verificationError) {
          console.error('Could not verify login response:', verificationError);
        }
      }

      if (!user || !['doctor', 'patient'].includes(user.role)) {
        const tokenUser = getTokenUser(token);
        user = { ...user, ...tokenUser };
      }

      if (!user || !['doctor', 'patient'].includes(user.role)) {
        const doctorsResponse = await api.get('/doctors');
        const userId = user?.id || user?._id;
        const isDoctor = doctorsResponse.data.some(
          (doctor) =>
            (userId && String(doctor._id) === String(userId)) ||
            (user?.email && doctor.email === user.email)
        );

        user = {
          ...user,
          role: isDoctor ? 'doctor' : 'patient',
        };
      }

      setAuth(token, user);
      toast.success('Login successful!');

      if (user.role === 'doctor') {
        navigate('/dashboard/doctor');
      } else {
        navigate('/dashboard/patient');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50/70 px-6 pb-12 pt-28 sm:px-8 sm:pb-16 lg:px-10">
      <div
        className="absolute -left-24 top-24 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-teal-800 p-10 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Stethoscope className="h-6 w-6 text-teal-100" />
            </div>
            <p className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-teal-200">
              Welcome to MediCare
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
              Your health journey, all in one place.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-teal-50/80">
              Sign in to manage appointments and stay connected with the care
              that matters to you.
            </p>
          </div>
          <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Heart className="h-5 w-5 text-teal-200" />
            </div>
            <p className="text-sm font-medium text-teal-50">
              Thoughtful care, made simple.
            </p>
          </div>
        </section>

        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Stethoscope className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Your care, one step away
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sign in to continue to your MediCare account.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              Your information is protected and secure
            </div>

            <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-teal-700 hover:text-teal-800"
              >
                Sign up
              </Link>
            </div>
            <div className="mt-3 text-center text-sm">
              <Link
                to="/register/doctor"
                className="font-semibold text-slate-500 transition hover:text-teal-700"
              >
                Register as a doctor
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
