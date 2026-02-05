import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Ballot = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [ballot, setBallot] = useState([]);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchElectionDetails();
  }, [electionId]);

  const fetchElectionDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/elections/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElection(response.data.election);
      setBallot(response.data.ballot);
      
      // Initialize selections
      const initialSelections = {};
      response.data.ballot.forEach(item => {
        initialSelections[item.position._id] = [];
      });
      setSelections(initialSelections);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching election details:', error);
      setError('Failed to load ballot. Please try again.');
      setLoading(false);
    }
  };

  const handleCandidateSelect = (positionId, candidateId, maxSelections) => {
    setSelections(prev => {
      const currentSelections = prev[positionId] || [];
      
      if (currentSelections.includes(candidateId)) {
        // Deselect
        return {
          ...prev,
          [positionId]: currentSelections.filter(id => id !== candidateId)
        };
      } else {
        // Select (if within limit)
        if (currentSelections.length < maxSelections) {
          return {
            ...prev,
            [positionId]: [...currentSelections, candidateId]
          };
        } else {
          // Show alert if trying to select more than allowed
          alert(`You can only select up to ${maxSelections} candidate(s) for this position.`);
          return prev;
        }
      }
    });
  };

  const handleSubmit = async () => {
    // Validate that all positions have at least one selection
    const incompletePositions = ballot.filter(item => {
      return !selections[item.position._id] || selections[item.position._id].length === 0;
    });

    if (incompletePositions.length > 0) {
      const confirmed = window.confirm(
        `You haven't made selections for ${incompletePositions.length} position(s). Do you want to proceed anyway?`
      );
      if (!confirmed) return;
    }

    const finalConfirm = window.confirm(
      'Are you sure you want to submit your ballot? This action cannot be undone.'
    );
    if (!finalConfirm) return;

    setSubmitting(true);

    try {
      // Format votes
      const votes = [];
      Object.keys(selections).forEach(positionId => {
        selections[positionId].forEach(candidateId => {
          votes.push({ positionId, candidateId });
        });
      });

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/votes/submit', {
        electionId,
        votes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Navigate to confirmation page
      navigate('/vote-confirmation', { 
        state: { 
          voteId: response.data.voteId,
          encryptedVote: response.data.encryptedVote 
        } 
      });
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert(error.response?.data?.message || 'Error submitting vote. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading ballot...</div>
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
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-6 py-8 rounded-b-xl shadow-lg mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{election?.title}</h1>
          <p className="text-blue-200 mb-4">{election?.description}</p>
          
          {/* Blockchain Status */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <span>Secure Blockchain Connection: Active</span>
            <span className="ml-4 bg-blue-700 px-3 py-1 rounded-full text-xs">
              ID Verified
            </span>
          </div>
        </div>
      </header>

      {/* Ballot Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {ballot.map((item, index) => {
          const selectedCount = selections[item.position._id]?.length || 0;
          const maxSelections = item.position.maxSelections;
          
          return (
            <div key={item.position._id} className="bg-white rounded-xl shadow-md p-6 mb-6">
              {/* Position Header */}
              <div className="mb-6 pb-4 border-b-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {index + 1}. Select {maxSelections === 1 ? 'One (1)' : `up to ${maxSelections}`} {item.position.title}
                </h2>
                {item.position.description && (
                  <p className="text-gray-600">{item.position.description}</p>
                )}
                
                {/* Selection Counter */}
                <div className="mt-3">
                  <span className={`text-sm font-semibold ${
                    selectedCount === maxSelections 
                      ? 'text-green-600' 
                      : selectedCount > 0 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                  }`}>
                    {selectedCount} of {maxSelections} selected
                  </span>
                </div>
              </div>

              {/* Candidates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.candidates.map(candidate => {
                  const isSelected = selections[item.position._id]?.includes(candidate._id);
                  
                  return (
                    <div
                      key={candidate._id}
                      onClick={() => handleCandidateSelect(
                        item.position._id,
                        candidate._id,
                        maxSelections
                      )}
                      className={`
                        border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                        flex items-center space-x-4
                        ${isSelected 
                          ? 'border-green-500 bg-green-50 shadow-lg' 
                          : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
                        }
                      `}
                    >
                      {/* Candidate Photo */}
                      <div className="flex-shrink-0">
                        <img
                          src={candidate.photo || '/default-avatar.png'}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>

                      {/* Candidate Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {candidate.party || 'Independent'}
                        </p>
                      </div>

                      {/* Checkbox */}
                      <div className="flex-shrink-0">
                        <div className={`
                          w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                          ${isSelected 
                            ? 'bg-green-500 border-green-500' 
                            : 'bg-white border-gray-400'
                          }
                        `}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* No Candidates Message */}
              {item.candidates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No candidates available for this position.
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Section */}
        <div className="bg-white rounded-xl shadow-md p-8 text-center sticky bottom-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Review Your Selections
            </h3>
            <p className="text-gray-600 mb-6">
              Please review your choices carefully. Once submitted, your vote cannot be changed.
            </p>
            
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`
                px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200
                ${submitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                }
                text-white
              `}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'SUBMIT BALLOT'
              )}
            </button>

            <p className="text-sm text-gray-500 mt-4">
              🔒 Your vote is encrypted and secured with blockchain technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ballot;