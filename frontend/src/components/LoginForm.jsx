// frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Fixed import
import axios from 'axios';

export default function LoginForm() {
  const navigate = useNavigate(); // ✅ Correct hook usage
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(''); // ✅ DOB instead of password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (dobString) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const age = calculateAge(dob);
    if (age < 15) {
      setError('You must be at least 15 years old to vote.');
      setIsLoading(false);
      return;
    }

    try {
      // ⚠️ Update this endpoint to match your voter login route
      const response = await axios.post('http://localhost:5000/api/auth/voter-login', {
        email,
        dob,
        age // optional: send for convenience
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-3xl p-8 space-y-6 shadow-lg border border-gray-100">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Voter Login</h1>
            <p className="text-gray-500">Enter your registered email and date of birth</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 text-white py-3 rounded-xl font-medium hover:bg-blue-800 active:scale-[0.98] transition disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>

          {/* Eligibility Info */}
          <div className="text-center text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
            <p className="font-medium">Eligibility Rules:</p>
            <p>• Barangay Election: 18+ years old</p>
            <p>• SK Election: 15–17 years old</p>
          </div>

          {/* Sign Up (if needed) */}
          <p className="text-center text-sm text-gray-600">
            Not registered?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-medium text-blue-700 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}