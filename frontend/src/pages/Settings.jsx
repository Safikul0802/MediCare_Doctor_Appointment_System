import React, { useState } from 'react';
import { Camera, Check, LockKeyhole, Save, UserRound } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const Settings = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        name,
        profileImage: profileImage || undefined,
      };

      const response = await api.patch('/auth/profile', updateData);

      if (response.data) {
        setUser(response.data);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-6 pb-16 pt-24 sm:px-8 lg:px-10">
      <div
        className="absolute -right-24 top-12 -z-10 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
            Your account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Profile settings
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Keep your account details up to date so your MediCare profile feels like you.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm"
        >
          <section className="border-b border-slate-100 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative mx-auto shrink-0 sm:mx-0">
                <img
                  src={
                    previewUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=e6f5f2&color=0f766e`
                  }
                  alt="Profile"
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-teal-50"
                />
                <label
                  htmlFor="profile-image"
                  className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-teal-700 text-white shadow-md transition hover:bg-teal-800 focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2"
                  aria-label="Change profile picture"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-bold text-slate-900">Profile photo</h2>
                <p className="mt-1 max-w-lg text-sm leading-6 text-slate-600">
                  Choose a clear photo so your profile is easy to recognize.
                  Recommended size: 400 × 400 px; maximum file size: 2 MB.
                </p>
                <label
                  htmlFor="profile-image"
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
                >
                  <Camera className="h-4 w-4" />
                  Upload a new photo
                </label>
              </div>
            </div>
          </section>

          <section className="space-y-6 p-6 sm:p-8">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <UserRound className="h-4 w-4 text-teal-700" />
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                  Full name
                </label>
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-slate-400" />
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email address
                </label>
              </div>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
              />
              <p className="mt-2 text-xs text-slate-500">
                Your email address is linked to your account and can’t be changed here.
              </p>
            </div>
          </section>

          <footer className="flex flex-col-reverse gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="flex items-center justify-center gap-2 text-xs text-slate-500 sm:justify-start">
              <Check className="h-4 w-4 text-teal-700" />
              Your profile details are kept secure
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving changes...' : 'Save changes'}
            </button>
          </footer>
        </form>
      </div>
    </main>
  );
};

export default Settings;
