import React, { useState } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const contactDetails = [
  {
    icon: Mail,
    title: 'Email us',
    detail: 'support@medicare.com',
  },
  {
    icon: Phone,
    title: 'Call us',
    detail: '+91 123-456-7890',
  },
  {
    icon: MapPin,
    title: 'Visit us',
    detail: (
      <>
        123 Healthcare Avenue
        <br />
        Malda District, West Bengal, India, 732101
      </>
    ),
  },
];

const hours = [
  ['Monday - Friday', '9:00 AM - 6:00 PM'],
  ['Saturday', '10:00 AM - 4:00 PM'],
  ['Sunday', 'Closed'],
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`MediCare contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    toast('Your email app will open so you can send this message.');
    window.location.href = `mailto:support@medicare.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative isolate bg-gradient-to-br from-sky-50 via-white to-teal-50/70">
        <div
          className="absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-32 text-center sm:px-8 sm:pb-16 lg:px-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm">
            <MessageCircle className="h-4 w-4" />
            We’re here to help
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Let’s talk about
            <span className="block text-teal-700">your care.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Questions, feedback, or need a hand? Send us a message and we’ll be
            happy to help.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
                Send us a message
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Get in touch
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Fill out the form below. Your email app will open with your
                message ready to send.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="block w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                  placeholder="Tell us a little about what you need..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                Open email app
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-300">
                Contact information
              </p>
              <h2 className="mt-2 text-2xl font-bold">We’d love to hear from you.</h2>
              <div className="mt-7 space-y-6">
                {contactDetails.map(({ icon: Icon, title, detail }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-300 ring-1 ring-white/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Operating hours</h2>
              </div>
              <dl className="mt-6 space-y-4">
                {hours.map(([day, time]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-slate-600">{day}</dt>
                    <dd className="text-right text-sm font-semibold text-slate-900">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Contact;
