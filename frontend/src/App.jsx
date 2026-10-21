import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorRegister from './pages/DoctorRegister';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import useAuthStore from './store/authStore';

const PrivateRoute = ({ children, role }) => {
  const { user, token } = useAuthStore();

  if (!token || !user || !['doctor', 'patient'].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'} replace />;
  }

  return children;
};

const DashboardRoute = () => {
  const { user, token } = useAuthStore();

  if (!token || !user || !['doctor', 'patient'].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}
      replace
    />
  );
};

const InvalidDashboardRoute = () => {
  const { user, token } = useAuthStore();

  if (!token || !user || !['doctor', 'patient'].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}
      replace
    />
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardRoute />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/patient" 
            element={
              <PrivateRoute role="patient">
                <UserDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/doctor" 
            element={
              <PrivateRoute role="doctor">
                <DoctorDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/dashboard/:role" element={<InvalidDashboardRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;