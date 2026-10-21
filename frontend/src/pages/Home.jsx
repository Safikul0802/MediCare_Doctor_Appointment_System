import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Shield,
  Stethoscope,
  UserPlus,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: UserPlus,
    title: 'Care that starts simply',
    description: 'Create your account in minutes and find the right care for you.',
  },
  {
    icon: Calendar,
    title: 'Appointments on your time',
    description: 'Choose a doctor and book a time that works with your schedule.',
  },
  {
    icon: Activity,
    title: 'Your care, all in one place',
    description: 'Keep track of appointments and stay connected to your health journey.',
  },
];

const Home = () => {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative isolate bg-gradient-to-br from-sky-50 via-white to-teal-50/70">
        <div
          className="absolute -left-24 top-24 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-6 pb-20 pt-28 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-24 lg:pt-32">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm">
              <Heart className="h-4 w-4 fill-teal-600 text-teal-600" />
              Thoughtful care, made simple
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              A healthier you
              <span className="mt-1 block text-teal-700">starts with the</span>
              right care.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Find trusted doctors, book appointments with ease, and make your
              health a priority — all in one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-white hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              >
                Discover MediCare
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-700" />
                Private and secure
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-700" />
                Book anytime
              </span>
              <span className="inline-flex items-center gap-2">
                <Award className="h-4 w-4 text-teal-700" />
                Trusted professionals
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-200/60 to-sky-200/60 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/70 bg-white p-3 shadow-2xl shadow-slate-900/10">
              <img
                src="https://cdn.pixabay.com/photo/2024/07/08/16/28/ai-generated-8881542_1280.jpg"
                alt="Illustration of a doctor ready to help a patient"
                className="h-[360px] w-full rounded-[1.25rem] object-cover object-center sm:h-[440px]"
              />
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:bottom-9 sm:left-9 sm:right-auto sm:min-w-64">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                    <Stethoscope className="h-5 w-5 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Care you can count on</p>
                    <p className="mt-0.5 text-base font-bold text-slate-900">Expert doctors, closer</p>
                  </div>
                </div>
              </div>
              <div className="absolute right-7 top-7 hidden items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Here for your health
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Healthcare, made easier
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to feel your best
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              A simpler way to connect with care and stay on top of your health.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-10 shadow-sm sm:px-10 lg:px-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
                  Care that puts you first
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  A community built around your wellbeing.
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  We make it easier to get connected to the care you deserve.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
                {[
                  ['50+', 'Active doctors'],
                  ['99%', 'Patient satisfaction'],
                  ['10k+', 'Appointments'],
                  ['24/7', 'Book online'],
                ].map(([value, label]) => (
                  <div key={label} className="border-l-2 border-teal-100 pl-4">
                    <dd className="text-3xl font-bold tracking-tight text-slate-900">
                      {value}
                    </dd>
                    <dt className="mt-1 text-sm font-medium text-slate-500">{label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-7 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div
            className="absolute -right-16 -top-28 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-300">
                Your next step starts here
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Make time for your health.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
                Create your account and take the first step toward a more
                connected healthcare experience.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <CheckCircle className="h-5 w-5 text-teal-300" />
                </div>
                <h3 className="mt-5 font-semibold text-white">Experienced doctors</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Connect with healthcare professionals who put your needs first.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Users className="h-5 w-5 text-teal-300" />
                </div>
                <h3 className="mt-5 font-semibold text-white">Care around you</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Keep your appointments and healthcare journey in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
