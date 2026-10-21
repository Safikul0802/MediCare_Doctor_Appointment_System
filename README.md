# 🏥 MediCare — Doctor Appointment System

A full-stack appointment scheduling application for patients and doctors. Patients can find doctors, book appointments, and follow their queue position. Doctors can view patient bookings, mark visits complete, and review appointment statistics. Built with the **MERN** stack with real-time updates using Socket.IO.

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=flat-square&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?style=flat-square&logo=socket.io)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Real-time Features](#real-time-features)
- [Contributing](#contributing)

## ✨ Features

### User Features
- **User Registration & Login**: Secure authentication with JWT
- **Profile Management**: Update name and profile picture
- **Browse Doctors**: View registered doctors and their specializations
- **Book Appointments**: Choose a doctor and schedule a future date and time
- **Appointment Schedule**: View booked visits and their status
- **Queue Tracking**: Follow your turn number as appointments are completed

### Doctor Features
- **Doctor Registration**: Registration protected by a server-side secret key
- **Appointment Dashboard**: View all appointments with patient names and dates
- **Appointment Management**: Mark pending appointments as completed
- **Analytics Dashboard**: View appointment counts, status, and trends
- **Live Updates**: Receive appointment and queue changes over Socket.IO

## 🛠️ Tech Stack

### Frontend
- **React** 18.2 - UI library
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Chart.js & React Chart.js 2** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image hosting and optimization
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
Doctor Appointment System/
├── backend/
│   ├── index.js                 # Server entry point
│   ├── package.json
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Appointment.js       # Appointment schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── appointments.js      # Appointment endpoints
│   │   └── doctors.js           # Doctor endpoints
│   ├── middleware/
│   │   └── auth.js              # Auth middleware
│   └── utils/
│       └── cloudinary.js        # Image upload utility
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # Entry point
│   │   ├── App.jsx              # Main component
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ImageUpload.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── DoctorRegister.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Settings.jsx
│   │   ├── store/
│   │   │   └── authStore.js     # Zustand state management
│   │   └── services/
│   │       └── api.js           # API client and auth header
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
```

The project has separate frontend and backend packages. There is no root `package.json`; use the frontend's `start` script to launch both services together.

## 📦 Prerequisites

- **Node.js** v18+ (required by Vite 5)
- **npm** or **yarn** package manager
- **MongoDB** database (local or MongoDB Atlas)
- **Cloudinary account** (optional; required only if you upload profile images)

## 🚀 Installation

### Step 1: Open the project directory

If you cloned the repository, change into the project directory:

```bash
git clone <repository-url>
cd "Doctor Appointment System"
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Step 3: Configure environment variables

Create `backend/.env` with the following values:

```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/doctor-appointments
JWT_SECRET=your_secret_key_here_make_it_very_secure
DOCTOR_SECRET_KEY=choose_a_separate_registration_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

Use a long, private value for `JWT_SECRET` and a separate secret for doctor registration. `PORT` and `FRONTEND_URL` are optional for local use; the backend defaults to port `5002` and the frontend origin `http://localhost:5173`.

Cloudinary credentials are needed only when registering or updating a profile with an image. Without them, register and update profiles without uploading images.

For local development, the Vite proxy forwards `/api` requests to `http://localhost:5002`, and the frontend's Socket.IO client connects to that same backend by default. To override these defaults, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5002/api
VITE_SOCKET_URL=http://localhost:5002
```

Do not commit `.env` files. JWTs expire after 24 hours. Doctor registration is protected by `DOCTOR_SECRET_KEY`.
For deployment, set `VITE_API_URL` to the deployed API base ending in `/api`, `VITE_SOCKET_URL` to the backend origin, and `FRONTEND_URL` to the exact frontend origin allowed to connect to the backend.

## ⚙️ Configuration

### Cloudinary setup (optional)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Add them to your backend `.env` file

### MongoDB Atlas setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database
3. Get your connection string
4. Add to `.env` file

## ▶️ Running the Application

### Option 1: Run both services concurrently

From the project directory:

```bash
npm --prefix frontend start
```

This runs the Vite development server and the backend together. The frontend is available at `http://localhost:5173`; the API and Socket.IO server use `http://localhost:5002`.

### Option 2: Run services separately

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
# Run from the project directory
npm --prefix frontend run build
```

The generated frontend bundle is written to `frontend/dist`. Deploy the backend separately with its environment variables configured.

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a patient
- `POST /register/doctor` - Register a doctor (requires `DOCTOR_SECRET_KEY`)
- `POST /login` - Log in as a patient or doctor
- `GET /verify` - Return the authenticated user's profile
- `PATCH /profile` - Update the authenticated user's name, doctor specialization, or profile image

### Appointment Routes (`/api/appointments`)
- `GET /` - List appointments belonging to the authenticated doctor or patient
- `POST /` - Book an appointment as a patient
- `GET /doctor/stats` - Get appointment statistics for the authenticated doctor
- `PATCH /:id/complete` - Mark a pending appointment as complete (appointment's doctor only)

### Doctor Routes (`/api/doctors`)
- `GET /` - List registered doctors (public)
- `GET /stats` - Get appointment statistics for the authenticated doctor

Except for the public doctor listing and registration/login endpoints, these routes require a valid bearer token.

## 💾 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (patient/doctor),
  specialization: String (required for doctors),
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: User),
  date: Date,
  turnNumber: Number (pending queue position for that UTC day),
  status: String (pending/completed/cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## 💡 Usage Guide

### For Patients
1. **Sign Up**: Click "Register" and fill in your details
2. **Browse Doctors**: View registered doctors and specializations
3. **Book Appointment**: Select a doctor and choose a future date and time
4. **Track Appointments**: View appointments, status, and queue position

### For Doctors
1. **Register**: Complete doctor registration with the configured doctor registration secret
2. **Manage Appointments**: View all appointments, including patient names and appointment times
3. **Complete Visits**: Mark a pending appointment complete after the checkup
4. **Dashboard**: Review appointment totals, status, and analytics

## 🔄 Real-time Features

The application uses **Socket.IO** for real-time updates:

- **Appointment Notifications**: Doctor dashboards refresh when patients book appointments
- **Status Updates**: Queue positions update after an appointment is completed
- **Live Dashboard**: Connected doctor and patient dashboards receive appointment changes
- **Automatic Refresh**: No need to manually refresh pages

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Made with ❤️ using MERN Stack**
