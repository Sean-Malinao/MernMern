import React, { useState } from 'react'
import './App.css'
import './index.css'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ForgotPassword from './components/ForgotPassword'

function App() {
  const [view, setView] = useState('login')

  return (
    <div className="App">
      {view === 'login' && (
        <LoginForm onSwitchToSignup={() => setView('signup')} onSwitchToForgot={() => setView('forgot')} />
      )}
      {view === 'signup' && <SignupForm onSwitchToLogin={() => setView('login')} />}
      {view === 'forgot' && <ForgotPassword onBack={() => setView('login')} />}
    </div>
  )
}

export default App
