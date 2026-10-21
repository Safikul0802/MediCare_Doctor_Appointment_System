import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  Briefcase,
  HeartPulse,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    secretKey: '',
    profileImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (imageData) => {
    setFormData({ ...formData, profileImage: imageData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register/doctor', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        secretKey: formData.secretKey,
        profileImage: formData.profileImage,
      });

      const { token, user } = response.data;
      if (!token || user?.role !== 'doctor') {
        throw new Error('The server returned an invalid doctor account response');
      }

      setAuth(token, user);
      toast.success('Registration successful!');
      navigate('/dashboard/doctor');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50/70 px-6 pb-14 pt-28 sm:px-8 sm:pb-16 lg:px-10">
      <div
        className="absolute -left-24 top-24 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-slate-900/10">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
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
                Join our care community
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
                Care starts with people like you.
              </h1>
              <p className="mt-5 leading-7 text-teal-50/80">
                Create your professional account to connect with patients and
                manage your care journey with MediCare.
              </p>
            </div>
            <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <HeartPulse className="h-5 w-5 text-teal-200" />
              </div>
              <p className="text-sm font-medium text-teal-50">
                Thoughtful care, made simple.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-9 lg:p-10">
            <div className="mb-7 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Stethoscope className="h-6 w-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
                Doctor registration
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add your professional details to get started.
              </p>
            </div>

            <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Profile photo <span className="font-normal text-slate-400">· optional</span>
                </label>
                <p className="mb-3 text-xs leading-5 text-slate-500">
                  Help patients recognize you with a clear, professional photo.
                </p>
                <div className="rounded-2xl bg-slate-50/70">
                  <ImageUpload onImageSelect={handleImageSelect} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                    Full name
                  </label>
                  <div className="relative">
                    <UserRound
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                      placeholder="Dr. Jordan Lee"
                    />
                  </div>
                </div>

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
                      placeholder="doctor@example.com"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="specialization"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Specialization
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                      placeholder="e.g. Cardiology"
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
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                      placeholder="Enter it again"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="secretKey"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Doctor secret key
                  </label>
                  <div className="relative">
                    <KeyRound
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="secretKey"
                      name="secretKey"
                      type="password"
                      autoComplete="off"
                      required
                      value={formData.secretKey}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                      placeholder="Enter the doctor registration key"
                    />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    This key is required to verify doctor registration.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Creating account...' : 'Register as a doctor'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              Your information is protected and secure
            </div>
            <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
                Sign in
              </Link>
            </div>
            <div className="mt-3 text-center text-sm">
              <Link
                to="/register"
                className="font-semibold text-slate-500 transition hover:text-teal-700"
              >
                Register as a patient instead
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DoctorRegister;
