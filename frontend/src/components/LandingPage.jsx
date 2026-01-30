// frontend/src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Official Logo - Replace with actual image path later */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-900">
              <img 
                src="/logo.png" 
                alt="Barangay Mayombo Seal" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.classList.remove('hidden');
                }}
              />
              {/* Fallback: SVG if image fails */}
              <div className="hidden w-full h-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold">
                BM
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BARANGAY MAYOMBO</h1>
              <p className="text-sm text-gray-600">AI-Assisted Voting System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-800 font-medium">Home</Link>
            <Link to="/admin" className="border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-4 py-2 rounded-lg font-medium transition">
              Admin Portal
            </Link>
            <Link to="/login" className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition">
              Voter Login
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Secure • Transparent • Reliable
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI-Assisted Voting System for<br />
            <span className="text-blue-700">Barangay Mayombo</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
            A modern, secure web-based voting platform that leverages AI and blockchain technology to ensure fair and transparent Barangay and SK elections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-[1.02] shadow-lg"
            >
              Cast Your Vote →
            </Link>
            <Link
              to="/dashboard"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition"
            >
              View Election Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Supported Elections */}
      <div className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Supported Elections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Barangay Election */}
            <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Barangay
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">18 years old and above</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>1 Barangay Chairman (Captain)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>7 Barangay Kagawads</span>
                </li>
              </ul>
            </div>

            {/* SK Election */}
            <div className="border border-red-200 rounded-xl p-6 bg-red-50">
              <div className="flex items-center mb-4">
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  SK Election
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">15 to 30 years old</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>1 SK Chairman</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>7 SK Kagawads</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Key Features</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Built with cutting-edge technology to ensure election security, transparency, and public trust.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Blockchain Security</h3>
              <p className="text-gray-600 text-sm">
                Every vote is stored as an immutable transaction on the blockchain, ensuring complete transparency and tamper-proof records.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">AI Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI algorithms monitor voting patterns in real-time to detect and flag any anomalous activities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.35l-4 4m0 0l-4-4m4 4v11m0 0h8m-8 0v-8m8 8l4-4m0 0l-4-4m4 4v-11m0 0H8" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Age-Based Eligibility</h3>
              <p className="text-gray-600 text-sm">
                Automatic voter validation ensures only eligible residents participate in Barangay (18+) and SK (15–30) elections.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Real-Time Analytics</h3>
              <p className="text-gray-600 text-sm">
                Live voter turnout tracking and trend analysis provide instant insights into election participation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Vote Privacy</h3>
              <p className="text-gray-600 text-sm">
                Cryptographic hashing anonymizes voter identity while maintaining vote integrity and verifiability.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Complete Audit Trail</h3>
              <p className="text-gray-600 text-sm">
                Every action is logged with timestamps, enabling full transparency and post-election verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Simple, secure, and straightforward voting process.
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Register</h3>
                <p className="text-gray-600 text-sm">
                  Visit barangay office with valid ID
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Login</h3>
                <p className="text-gray-600 text-sm">
                  Access the system with your credentials
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Vote</h3>
                <p className="text-gray-600 text-sm">
                  Select your preferred candidates
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Confirm</h3>
                <p className="text-gray-600 text-sm">
                  Receive blockchain confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Election Day Banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-8 text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Election Day: October 28, 2025</h3>
            <p className="max-w-2xl mx-auto mb-6 opacity-90">
              Make your voice heard! Register at the barangay office and participate in shaping the future of Barangay Mayombo.
            </p>
            <Link
              to="/login"
              className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg inline-flex items-center transition"
            >
              Login to Vote
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">BM</span>
                </div>
                <h3 className="text-lg font-bold text-white">Barangay Mayombo</h3>
              </div>
              <p className="text-sm">
                A secure, transparent, and efficient web-based voting system designed for Barangay and Sangguniang Kabataan elections in Barangay Mayombo.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Security Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Blockchain Storage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Voter Encryption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Audit Trail</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Barangay Mayombo Hall</li>
                <li>Municipal District</li>
                <li className="mt-2">
                  <a href="mailto:support@mayombo.gov.ph" className="text-blue-400 hover:text-blue-300">
                    support@mayombo.gov.ph
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            <p>© {new Date().getFullYear()} Barangay Mayombo. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Election Guidelines</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;