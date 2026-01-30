// frontend/src/components/VoterDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [voter, setVoter] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const voterData = localStorage.getItem('voter');

    if (!token || !voterData) {
      navigate('/login');
      return;
    }

    try {
      const parsed = JSON.parse(voterData);
      setVoter(parsed);
      setHasVoted(parsed.hasVoted || false);
    } catch (e) {
      console.error('Failed to parse voter data', e);
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!voter) return null;

  const eligibilityBadge = (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      voter.eligibility === 'barangay' 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {voter.eligibility === 'barangay' ? 'Barangay Voter' : 'SK Voter'}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-4">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-blue-900 overflow-hidden">
              <img
                src="/logo.png"
                alt="Barangay Mayombo"
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
              <h1 className="text-lg font-bold text-gray-900">Barangay Mayombo</h1>
              <p className="text-xs text-gray-600">AI-Assisted Voting System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('voter');
                navigate('/login');
              }}
              className="text-gray-700 hover:text-blue-800 font-medium flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">
            <h2 className="text-2xl font-bold">Welcome, Voter!</h2>
            <p className="opacity-90 mt-2">
              You are eligible to participate in the {voter.eligibility === 'barangay' ? 'Barangay' : 'Sangguniang Kabataan'} election.
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900">Voter ID</h3>
                <p className="text-gray-600 font-mono">{voter.voterId}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Eligibility</h3>
                {eligibilityBadge}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Status</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  hasVoted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {hasVoted ? 'Already Voted' : 'Ready to Vote'}
                </span>
              </div>
            </div>

            {/* Vote Button */}
            <div className="mt-8 text-center">
              <button
                disabled={hasVoted}
                onClick={() => navigate('/vote')}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition ${
                  hasVoted
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {hasVoted ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vote Confirmed
                  </>
) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Cast Your Vote
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Voter Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Voting Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Date of Birth</h4>
              <p className="text-gray-600">
                {new Date(voter.dob).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Age</h4>
              <p className="text-gray-600">{voter.age} years old</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Election Type</h4>
              <p className="text-gray-600 capitalize">
                {voter.eligibility === 'barangay' ? 'Barangay Election' : 'SK Election'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Voting Status</h4>
              <p className={`font-medium ${
                hasVoted ? 'text-green-600' : 'text-blue-600'
              }`}>
                {hasVoted ? '✅ Verified & Recorded' : '⏳ Ready to Cast'}
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Your Vote Is Secured</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Every vote is recorded as an immutable transaction on the blockchain, ensuring complete transparency and tamper-proof records.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Barangay Mayombo Election Commission. All Rights Reserved.</p>
          <p className="mt-1">Secure Connection Established.</p>
        </div>
      </footer>
    </div>
  );
};

export default VoterDashboard;