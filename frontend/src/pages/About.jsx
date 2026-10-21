import React from 'react';
import {
  Check,
  Clock,
  Heart,
  Shield,
  Sparkles,
  Stethoscope,
  UserCheck,
} from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Quality care',
    description: 'Access to trusted healthcare professionals for your needs.',
  },
  {
    icon: Clock,
    title: 'Convenient booking',
    description: 'Find and book appointments whenever it works for you.',
  },
  {
    icon: UserCheck,
    title: 'Expert doctors',
    description: 'Connect with qualified and experienced medical professionals.',
  },
  {
    icon: Shield,
    title: 'Privacy first',
    description: 'Your health information deserves care and protection.',
  },
];

const benefits = {
  Patients: [
    'Easy online appointment booking',
    'Real-time appointment tracking',
    'Automated turn management',
    'Secure personal health information',
  ],
  Doctors: [
    'Efficient patient management',
    'Appointment analytics',
    'Automated scheduling',
    'Secure communication channel',
  ],
};

const About = () => {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative isolate bg-gradient-to-br from-sky-50 via-white to-teal-50/70">
        <div
          className="absolute -right-24 -top-20 -z-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 text-center sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm">
            <Sparkles className="h-4 w-4" />
            About MediCare
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Better connections.
            <span className="block text-teal-700">Better healthcare.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            We’re making healthcare more accessible and convenient by bringing
            patients and trusted doctors together in one simple place.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-lg font-bold text-slate-900">{title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-teal-800 p-10">
              <div
                className="absolute -left-16 -top-20 h-64 w-64 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-28 -right-14 h-72 w-72 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-teal-100 ring-1 ring-white/20">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">
                  Our mission
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  Care should feel connected.
                </p>
              </div>
            </div>
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
                Why we’re here
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Making the path to care a little easier.
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                At MediCare, we believe everyone deserves easy access to quality
                healthcare. Our mission is to bridge the gap between patients
                and healthcare providers through technology, making it easier
                to find care and book medical appointments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Designed for everyone
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A better experience, on both sides of care
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {Object.entries(benefits).map(([group, items]) => (
              <article
                key={group}
                className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    {group === 'Patients' ? (
                      <Heart className="h-5 w-5" />
                    ) : (
                      <Stethoscope className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">For {group}</h3>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
