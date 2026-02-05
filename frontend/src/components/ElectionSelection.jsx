import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ElectionSelection = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElection, setSelectedElection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableElections();
  }, []);

  const fetchAvailableElections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/elections/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElections(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching elections:', error);
      setError('Failed to load elections. Please try again.');
      setLoading(false);
    }
  };

  const handleElectionSelect = (electionId) => {
    setSelectedElection(electionId);
  };

  const handleProceedToBallot = () => {
    if (selectedElection) {
      navigate(`/ballot/${selectedElection}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading available elections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="Barangay Mayombo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold">BM</div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Barangay Mayombo Voting System</h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-sm text-gray-600 hover:text-gray-900">Home</button>
            <button className="text-sm text-gray-600 hover:text-gray-900">Help</button>
            <button className="text-sm text-gray-600 hover:text-gray-900">Language</button>
            <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Progress and Title */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Election Selection</h2>
              <div className="w-32 h-1 bg-blue-600 rounded-full"></div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">STEP 1 OF 4</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">Identification & Selection Stage</p>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Election Type</h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Please choose which election you are participating in today. This ensures you receive the correct ballot.
          </p>
        </div>

        {/* Election Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
          {/* Barangay Election Card */}
          <div
            onClick={() => handleElectionSelect('barangay')}
            className={`
              bg-white rounded-xl p-8 cursor-pointer transition-all duration-300
              hover:shadow-xl relative
              ${selectedElection === 'barangay'
                ? 'border-2 border-green-600 shadow-lg shadow-green-600/20' 
                : 'border-2 border-gray-200 hover:border-gray-300'
              }
            `}
          >
            {/* Card Image */}
            <div className="mb-6 rounded-lg overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
              <img 
                src="/barangay-seal.png" 
                alt="Barangay Seal" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-6xl">🏛️</div>';
                }}
              />
            </div>

            {/* Card Icon */}
            <div className="mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Card Content */}
            <div className="text-gray-800">
              <h3 className="text-xl font-bold mb-3">Barangay Election</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Open to all registered voters of Barangay Mayombo who are <strong>18 years old and above</strong>
              </p>

              {/* Ballot Type Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  ADULT BALLOT
                  <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>

              {/* Selected checkmark for Barangay */}
            {selectedElection === 'barangay' && (
              <div className="absolute top-4 right-4 bg-green-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            </div>
          </div>

          {/* SK Election Card */}
          <div
            onClick={() => handleElectionSelect('sk')}
            className={`
              bg-white rounded-xl p-8 cursor-pointer transition-all duration-300
              hover:shadow-xl relative
              ${selectedElection === 'sk'
                ? 'border-2 border-green-600 shadow-lg shadow-green-600/20' 
                : 'border-2 border-gray-200 hover:border-green-300'
              }
            `}
          >
            {/* Card Image */}
            <div className="mb-6 rounded-lg overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
              <img 
                src="/sk-youth.png" 
                alt="SK Youth" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-6xl">👥</div>';
                }}
              />
            </div>

            {/* Card Icon */}
            <div className="mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Card Content */}
            <div className="text-gray-800">
              <h3 className="text-xl font-bold mb-3">Sangguniang Kabataan (SK)</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Open to registered youth voters of Barangay Mayombo aged <strong className="text-amber-600">15 to 30 years old</strong>
              </p>

              {/* Ballot Type Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                  YOUTH BALLOT
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Checkmark for selected card */}
            {selectedElection === 'sk' && (
              <div className="absolute top-4 right-4 bg-green-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Proceed Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleProceedToBallot}
            disabled={!selectedElection}
            className={`
              px-12 py-4 rounded-lg font-bold text-base transition-all duration-300
              ${selectedElection
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg hover:shadow-xl cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            PROCEED TO BALLOT →
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Need assistance? Please approach the nearest Poll Clerk for help.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              © 2025 Barangay Mayombo Digital Election Commission. Supported by AI-Voter Intelligence.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <a href="/election-rules" className="text-gray-500 hover:text-gray-700">
                Election Rules
              </a>
              <a href="/privacy" className="text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="/security" className="text-gray-500 hover:text-gray-700">
                Security Protocols
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElectionSelection;