import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VoterDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user data from localStorage or fetch from API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    } else {
      setError('User not found');
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
            <p className="text-gray-600 mt-1">You are successfully logged in</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-[0.98]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
                <p className="text-lg text-gray-900 bg-gray-50 p-4 rounded-xl">{user?.firstName || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
                <p className="text-lg text-gray-900 bg-gray-50 p-4 rounded-xl">{user?.lastName || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                <p className="text-lg text-gray-900 bg-gray-50 p-4 rounded-xl break-all">{user?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 flex flex-col justify-center border border-blue-100">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Welcome, {user?.firstName}! 👋</h3>
              <p className="text-blue-700 mb-4">
                Your email has been verified and your account is now fully active.
              </p>
              <p className="text-blue-600 text-sm">
                You can now access all features of our application. Make sure to keep your password safe and never share it with anyone.
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">🔒 Security Notice</h3>
          <ul className="space-y-2 text-amber-800 text-sm">
            <li>• Keep your password confidential</li>
            <li>• Log out from shared devices</li>
            <li>• Report any suspicious activity immediately</li>
            <li>• Never click links in unexpected emails</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>&copy; 2024 Auth App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
