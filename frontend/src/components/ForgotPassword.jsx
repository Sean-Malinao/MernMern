import React, { useState } from 'react'

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setTimeout(() => {
      setIsLoading(false)
      setMessage('If that email exists, a reset link was sent (demo).')
    }, 900)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-3xl p-8 space-y-8 shadow-lg border border-gray-100">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Reset password</h1>
            <p className="text-sm text-gray-500">Enter your email and we'll send a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 outline-none"
                placeholder="you@example.com"
              />
            </div>

            {message && <div className="text-sm text-slate-600">{message}</div>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </button>
              <button type="button" onClick={onBack} className="flex-1 border border-gray-200 rounded-xl py-3">
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
