// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

// Auth Components
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ForgotPassword from './components/ForgotPassword';
import OTPVerification from './components/OTPVerification';

// Page Components
import LandingPage from './components/LandingPage';      // NEW
import HomePage from './components/HomePage';          // Your current authenticated dashboard
import VoterDashboard from './components/VoterDashboard'; // NEW
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        

        {/* Protected Voter Dashboard */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <VoterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Optional: Public Election Dashboard (read-only) */}
        {/* We'll build this later if needed */}
        {/* <Route path="/dashboard" element={<PublicDashboard />} /> */}

        {/* Fallback: redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;