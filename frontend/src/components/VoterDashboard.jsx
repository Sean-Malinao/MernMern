// frontend/src/components/VoterDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [voter, setVoter] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== CHATBOT STATE =====
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock live data (replace with API later)
  const [liveData] = useState({
    timeRemaining: '08h 45m 12s',
    totalTurnout: 64.2,
    barangayCandidates: [
      { name: 'Roberto "Beto" Santos', votes: 558, percent: 45 },
      { name: 'Elena Rodriguez-Cruz', votes: 496, percent: 40 },
      { name: 'Manuel "Manny" Garcia', votes: 186, percent: 15 },
    ],
    skCandidates: [
      { name: 'Mark "Kid" David', votes: 510, percent: 60 },
      { name: 'Sophia Hernandez', votes: 255, percent: 30 },
      { name: 'Independent: Kyle Sy', votes: 85, percent: 10 },
    ],
    lastUpdated: '2:45 PM'
  });

  // ===== CHATBOT FUNCTION =====
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Sorry, I\m offline right now. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

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

  // ===== HANDLE CAST VOTE BUTTON =====
  const handleCastVote = () => {
    // Navigate to election selection page (use existing protected route '/elections')
    // pass the voter's eligibility so ElectionSelection can pre-filter available ballots
    navigate('/elections', { state: { eligibility: voter?.eligibility } });
  };

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

  // Format user name (fallback if not available)
  const userName = voter.name?.trim() || voter.voterId.slice(0, 8) + '...';
  const userRole = voter.eligibility === 'barangay' ? 'Barangay Voter' : 'SK Voter';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-4">
      <header className="bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
              <h1 className="text-xl font-bold text-gray-900">Mayombo Voting Portal</h1>
              <p className="text-xs text-gray-600">Official Election Dashboard</p>
            </div>
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-600">{userRole}</p>
            </div>
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

      {/* ===== BLUE BANNER ===== */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-30"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full opacity-20"></div>
          <div className="absolute bottom-6 left-6 w-3 h-3 bg-white rounded-full opacity-40"></div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Your Vote Shapes the Future of Mayombo.
              </h1>
              <p className="mt-3 text-blue-100 max-w-2xl">
                Secure, AI-assisted voting is now open. Verify your identity and cast your ballot for the Barangay and SK councils.
              </p>
              <div className="mt-6">
                <button
                  disabled={hasVoted}
                  onClick={handleCastVote}
                  className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] ${
                    hasVoted
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>CAST YOUR VOTE</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Verified Identity Badge */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-[240px] text-center">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">VERIFIED IDENTITY</h3>
              <p className="text-sm opacity-90">Face Recognition Enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATUS CARDS ===== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Voter Status */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">VOTER STATUS</h3>
              <p className={`text-xl font-bold mt-1 ${
                hasVoted ? 'text-green-600' : 'text-blue-600'
              }`}>
                {hasVoted ? 'Verified' : 'Eligible'}
              </p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                hasVoted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {hasVoted ? 'Voted' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">TIME REMAINING</h3>
              <p className="text-xl font-bold mt-1 text-orange-600">{liveData.timeRemaining}</p>
            </div>
          </div>
        </div>

        {/* Total Turnout */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">TOTAL TURNOUT</h3>
              <p className="text-xl font-bold mt-1 text-blue-600">{liveData.totalTurnout}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${liveData.totalTurnout}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LIVE ELECTION PROGRESS ===== */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Live Election Progress</h2>
          <div className="text-xs text-gray-500">
            📅 Last updated: {liveData.lastUpdated}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Barangay Chairman */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Executive Position</h3>
                <h2 className="text-xl font-bold mt-1">Barangay Chairman</h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">{liveData.barangayCandidates.reduce((sum, c) => sum + c.votes, 0)}</div>
                <div className="text-xs text-gray-500">TOTAL VOTES CAST</div>
              </div>
            </div>
            <div className="space-y-4">
              {liveData.barangayCandidates.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">{c.name}</span>
                    <span className="font-semibold text-gray-900">{c.votes} Votes ({c.percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${c.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SK Chairman */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative">
            <div className="absolute top-3 right-3">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10.586 10.586 11.707 9.464V7z" clipRule="evenodd" />
                </svg>
                1
              </span>
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Youth Council</h3>
                <h2 className="text-xl font-bold mt-1">SK Chairman</h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-900">{liveData.skCandidates.reduce((sum, c) => sum + c.votes, 0)}</div>
                <div className="text-xs text-gray-500">TOTAL VOTES CAST</div>
              </div>
            </div>
            <div className="space-y-4">
              {liveData.skCandidates.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">{c.name}</span>
                    <span className="font-semibold text-gray-900">{c.votes} Votes ({c.percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-600 h-3 rounded-full" 
                      style={{ width: `${c.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== VOTER PROFILE CARD ===== */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Voting Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Date of Birth</h4>
            <p className="text-gray-600">
              {new Date(voter.dob).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) || 'Invalid Date'}
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

      {/* ===== SECURITY NOTE ===== */}
      <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-6 text-center mb-12">
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

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Barangay Mayombo Election Commission. All Rights Reserved.</p>
          <p className="mt-1">Secure Connection Established.</p>
        </div>
      </footer>

      {/* ===== FLOATING CHATBOT BUTTON ===== */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-105 transition-transform"
        aria-label="Open AI Assistant"
      >
        {/* Robot Icon (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4"></path>
          <path d="M20 8V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4"></path>
          <rect x="4" y="8" width="16" height="12" rx="2"></rect>
          <circle cx="9" cy="14" r="1"></circle>
          <circle cx="15" cy="14" r="1"></circle>
          <path d="M10 17h4"></path>
        </svg>
      </button>

      {/* ===== CHAT WINDOW ===== */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Mayombo AI Assistant</h3>
                <p className="text-xs opacity-80 mt-1">Ask about voting or predictions</p>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 text-xl"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                Hello! 👋 Ask me anything about the election.
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-3 py-2 rounded-2xl max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'bg-blue-900 text-white rounded-br-md' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block bg-gray-200 text-gray-800 rounded-2xl rounded-bl-md px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="bg-blue-900 text-white px-3 rounded-r-lg hover:bg-blue-800 disabled:opacity-50"
              >
                ↵
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterDashboard;