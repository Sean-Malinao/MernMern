import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './index.css'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ForgotPassword from './components/ForgotPassword'
import OTPVerification from './components/OTPVerification'
import HomePage from './components/HomePage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [view, setView] = useState('login')
  const [signupEmail, setSignupEmail] = useState('')

  const handleShowOTPVerification = (email) => {
    setSignupEmail(email)
    setView('otp')
  }

  const handleVerificationSuccess = (data) => {
    setView('home')
  }

  const handleResendOTP = () => {
    // OTP was resent
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <LoginForm
              onSwitchToSignup={() => setView('signup')}
              onSwitchToForgot={() => setView('forgot')}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupForm
              onSwitchToLogin={() => setView('login')}
              onShowOTPVerification={handleShowOTPVerification}
            />
          }
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword onBack={() => setView('login')} />}
        />
        <Route
          path="/verify-otp"
          element={
            <OTPVerification
              email={signupEmail}
              onVerificationSuccess={handleVerificationSuccess}
              onResendOTP={handleResendOTP}
            />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
