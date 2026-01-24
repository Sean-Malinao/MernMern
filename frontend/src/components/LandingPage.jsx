// frontend/src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V7m2 13a2 2 0 002-2V7m2 13a2 2 0 002-2V7m2 13a2 2 0 002-2V7" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Barangay Mayombo</h1>
              <p className="text-xs text-gray-600">AI-Assisted Voting System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-medium px-4 py-2 rounded-md transition">
              Home
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-blue-800 font-medium flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a4 4 0 014-4h4M12 14a4 4 0 01-4-4H4M12 14a4 4 0 01-4-4H4M12 14a4 4 0 014-4h4" />
              </svg>
              Admin
            </Link>
            <Link to="/login" className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded-md transition">
              Voter Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI-Assisted Voting System for Barangay Mayombo
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Empowering secure and transparent elections through blockchain technology and artificial intelligence to safeguard voter trust and strengthen democratic processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-md transition">
              Start Voting
            </Link>
            <Link to="/dashboard" className="bg-transparent border border-white hover:bg-white hover:text-blue-900 font-bold py-3 px-6 rounded-md transition">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
            <p className="text-gray-600">Every vote is recorded on an immutable blockchain ensuring tamper-proof results.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Monitoring</h3>
            <p className="text-gray-600">Real-time anomaly detection and voting pattern analysis to prevent fraud.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Up-to-Date Visibility</h3>
            <p className="text-gray-600">Transparent, real-time updates for Barangay Mayombo residents to monitor election progress.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="font-semibold">Register/Login</h3>
              <p className="text-sm text-gray-600 mt-2">Verify your identity and register to vote.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="font-semibold">Select Elections</h3>
              <p className="text-sm text-gray-600 mt-2">Choose which election you want to participate in.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="font-semibold">Cast Your Vote</h3>
              <p className="text-sm text-gray-600 mt-2">Securely submit your vote via encrypted channel.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">4</div>
              <h3 className="font-semibold">Confirmation</h3>
              <p className="text-sm text-gray-600 mt-2">Receive verification receipt and view live results.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Elections */}
      <div className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Supported Elections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-4">🗳️</div>
              <h3 className="text-xl font-semibold mb-2">Barangay Election</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Barangay Chairman (Captain)</li>
                <li>• 7 Barangay Kagawads</li>
                <li>• Eligible: 18 years old and above</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">SK Election</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• SK Chairman</li>
                <li>• 7 SK Kagawads</li>
                <li>• Eligible: 15 to 18 years old</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-4">Barangay Mayombo</h4>
            <p className="text-sm opacity-80">A secure online voting system powered by blockchain and AI to ensure fair, transparent, and tamper-resistant elections.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Security Features</h4>
            <ul className="text-sm space-y-1 opacity-80">
              <li>• Encrypted data storage</li>
              <li>• Blockchain immutability</li>
              <li>• AI-powered fraud detection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Election Info</h4>
            <ul className="text-sm space-y-1 opacity-80">
              <li>• Barangay Election: 18+ years old</li>
              <li>• SK Election: 15–18 years old</li>
              <li>• Voting Hours: 6AM–6PM</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm opacity-70">
          © 2026 Barangay Mayombo AI-Assisted Voting System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;