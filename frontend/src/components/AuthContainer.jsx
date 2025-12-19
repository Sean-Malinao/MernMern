import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import OTPVerification from './components/OTPVerification'

export default function App() {
  const [currentView, setCurrentView] = useState('login') // 'login', 'signup', 'otp'
  const [signupEmail, setSignupEmail] = useState('')

  return (
    <>
      {currentView === 'login' && (
        <LoginForm onSwitchToSignup={() => setCurrentView('signup')} />
      )}
      
      {currentView === 'signup' && (
        <SignupForm
          onSwitchToLogin={() => setCurrentView('login')}
          onShowOTPVerification={(email) => {
            setSignupEmail(email)
            setCurrentView('otp')
          }}
        />
      )}
      
      {currentView === 'otp' && (
        <OTPVerification
          email={signupEmail}
          onBackToSignup={() => setCurrentView('signup')}
          onVerified={() => {
            alert('Successfully verified!')
            // Redirect to dashboard or main app
          }}
        />
      )}
    </>
  )
}