// frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();
  const [voterId, setVoterId] = useState('');
  const [secretPassword, setSecretPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/voter/login', {
        voterId,
        secretPassword // expected: YYYYMMDD (8 digits)
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('voter', JSON.stringify(response.data.voter));
      navigate('/home');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your Voter ID and Secret Password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 relative overflow-hidden">
      {/* === CORNER DECORATIONS (SVG Patterns) === */}
      {/* Top-left corner */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="#f9f6f0" />
          <path d="M20,20 L60,20 L60,60 L20,60 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M40,40 L80,40 L80,80 L40,80 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M60,60 L100,60 L100,100 L60,100 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M80,80 L120,80 L120,120 L80,120 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M100,100 L140,100 L140,140 L100,140 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M120,120 L160,120 L160,160 L12160 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M140,140 L180,140 L180,180 L140,180 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
        </svg>
      </div>

      {/* Bottom-right corner */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-180">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="#f9f6f0" />
          <path d="M20,20 L60,20 L60,60 L20,60 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M40,40 L80,40 L80,80 L40,80 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M60,60 L100,60 L100,100 L60,100 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M80,80 L120,80 L120,120 L80,120 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M100,100 L140,100 L140,140 L100,140 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M120,120 L160,120 L160,160 L120,160 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
          <path d="M140,140 L180,140 L180,180 L140,180 Z" fill="none" stroke="#e5dfd5" strokeWidth="2" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 z-10 relative">
        {/* Left Image */}
        <div className="hidden lg:block absolute left-0 top-0 w-96 h-full">
          <img src="/image 19.png" alt="Left design" className="w-full h-full object-cover" />
        </div>

        {/* Right Image */}
        <div className="hidden lg:block absolute right-0 top-0 w-96 h-full">
          <img src="/image 20.png" alt="Right design" className="w-full h-full object-cover" />
        </div>

        <div className="w-full max-w-md">
          {/* Portal Header (Full Width) */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-full border-2 border-blue-900 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Barangay Mayombo Seal"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold">
                  BM
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BARANGAY MAYOMBO</h1>
                <p className="text-xs text-gray-600">AI-Assisted Voting System</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              SECURE ELECTION PORTAL
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              AI-Assisted & Blockchain Secured Voting for Barangay and SK Elections
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-white px-6 py-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-blue-900 text-center">Voter Secure Login</h3>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <p className="text-xs text-gray-700 leading-relaxed text-center">
                Welcome! Please enter your official Voter ID and Secret Password provided by the admin.  
                Sangguniang Kabataan (SK) voters are ages <span className="font-medium">15–30</span>, while Barangay voters are <span className="font-medium">18 and above</span>.  
                Ensure your eligibility before logging in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Voter ID */}
              <div>
                <label htmlFor="voterId" className="block text-sm font-medium text-gray-700 mb-2">
                  Voter ID / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="voterId"
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value.replace(/\D/g, '').substring(0, 12))}
                    placeholder="Enter your 12-digit Voter ID"
                    maxLength="12"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Secret Password */}
              <div>
                <label htmlFor="secretPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="secretPassword"
                    type="password"
                    value={secretPassword}
                    onChange={(e) => setSecretPassword(e.target.value.replace(/\D/g, '').substring(0, 8))}
                    placeholder="Enter your unique secret password (e.g., 20000101)"
                    maxLength="8"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-xs text-gray-500">YYYYMMDD</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Hint: Your Secret Password is your Date of Birth in <span className="font-mono">YYYYMMDD</span> format.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg flex items-center justify-center transition ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" />
                    </svg>
                    Secure Login
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-600 mb-2">
                Your vote is secured by blockchain technology.
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <a href="#" className="text-gray-600 hover:text-blue-700">Need Help?</a>
                <a href="#" className="text-gray-600 hover:text-blue-700">Privacy Policy</a>
                <a href="#" className="text-gray-600 hover:text-blue-700">Terms of Service</a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center text-xs text-gray-500">
            © 2024 Barangay Mayombo Election Commission. All Rights Reserved.  
            <br />
            Secure Connection Established.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;