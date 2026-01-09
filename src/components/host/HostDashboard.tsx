import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHostStore } from '../../store/hostStore';
import { QRCodeSVG } from 'qrcode.react';
import { generateLabels, generateOrdinals } from '../../utils/labels';

export default function HostDashboard() {
  const navigate = useNavigate();
  const { event, participants, changeRound, calculateResults, resetEvent } = useHostStore();

  useEffect(() => {
    if (!event) {
      navigate('/host/setup');
    }
  }, [event, navigate]);

  if (!event) return null;

  const displayLabels = generateLabels(event.wines.length);
  const bottleLabels = generateLabels(event.wines.length);
  const ordinals = generateOrdinals(event.wines.length);

  const joinUrl = `${window.location.origin}/blind-tasting/join/${event.peerId}`;

  const handleRoundChange = (round: typeof event.status) => {
    changeRound(round);
  };

  const handleCalculateResults = () => {
    if (confirm('Calculate and show results to all participants?')) {
      calculateResults();
    }
  };

  const handleResetEvent = () => {
    if (confirm('Are you sure you want to end this event? This cannot be undone.')) {
      resetEvent();
      navigate('/');
    }
  };

  const getSubmissionCount = (round: 'display' | 'bottle' | 'price') => {
    return participants.filter(p => {
      if (round === 'display') return Object.keys(p.displayAnswers).length > 0;
      if (round === 'bottle') return Object.keys(p.bottleAnswers).length > 0;
      if (round === 'price') return Object.keys(p.priceAnswers).length > 0;
      return false;
    }).length;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Host Dashboard</h1>
            <p className="text-gray-600 mt-1">Managing your blind tasting event</p>
          </div>
          <button
            onClick={handleResetEvent}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg"
          >
            End Event
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: QR Code & Status */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Join Event</h2>
              
              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCodeSVG value={joinUrl} size={200} className="mx-auto" />
              </div>
              
              <div className="text-center text-sm text-gray-600 mb-2">
                Or visit: <code className="bg-white px-2 py-1 rounded text-xs">{joinUrl}</code>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Current Round:</div>
                <div className="text-xl font-bold text-purple-700 capitalize">
                  {event.status.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Participants:</div>
                <div className="text-2xl font-bold text-pink-700">
                  {participants.length}
                </div>
              </div>
            </div>

            {/* Round Controls */}
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-gray-800 mb-3">Round Controls</h3>
              
              <button
                onClick={() => handleRoundChange('waiting')}
                disabled={event.status === 'waiting'}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg text-left"
              >
                Waiting Room
              </button>
              
              <button
                onClick={() => handleRoundChange('displayRound')}
                disabled={event.status === 'displayRound'}
                className="w-full py-2 px-4 bg-purple-100 hover:bg-purple-200 disabled:bg-purple-300 disabled:cursor-not-allowed rounded-lg text-left"
              >
                Start Display Round
                {event.status === 'displayRound' && (
                  <span className="ml-2 text-xs">({getSubmissionCount('display')}/{participants.length})</span>
                )}
              </button>
              
              <button
                onClick={() => handleRoundChange('bottleRound')}
                disabled={event.status === 'bottleRound'}
                className="w-full py-2 px-4 bg-pink-100 hover:bg-pink-200 disabled:bg-pink-300 disabled:cursor-not-allowed rounded-lg text-left"
              >
                Start Bottle Round
                {event.status === 'bottleRound' && (
                  <span className="ml-2 text-xs">({getSubmissionCount('bottle')}/{participants.length})</span>
                )}
              </button>
              
              <button
                onClick={() => handleRoundChange('priceRound')}
                disabled={event.status === 'priceRound'}
                className="w-full py-2 px-4 bg-indigo-100 hover:bg-indigo-200 disabled:bg-indigo-300 disabled:cursor-not-allowed rounded-lg text-left"
              >
                Start Price Round
                {event.status === 'priceRound' && (
                  <span className="ml-2 text-xs">({getSubmissionCount('price')}/{participants.length})</span>
                )}
              </button>
              
              <button
                onClick={handleCalculateResults}
                disabled={event.status === 'results'}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg"
              >
                Calculate Results
              </button>
            </div>
          </div>

          {/* Right Column: Event Info & Participants */}
          <div className="lg:col-span-2">
            {/* Wine List */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wines</h2>
              <div className="space-y-3">
                {event.wines.map((wine, index) => (
                  <div key={wine.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {ordinals[index]}: {wine.name} {wine.year && `(${wine.year})`}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Display: Glass {displayLabels[event.displayOrder.indexOf(index)]} • 
                          Bottle: Label {bottleLabels[event.bottleOrder.indexOf(index)]}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-purple-700">
                        €{wine.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participants List */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Participants</h2>
              
              {participants.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No participants yet</p>
                  <p className="text-sm text-gray-400 mt-2">Share the QR code to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {participants.map((p) => (
                    <div key={p.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-800">{p.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Display: {Object.keys(p.displayAnswers).length > 0 ? '✓' : '—'} • 
                          Bottle: {Object.keys(p.bottleAnswers).length > 0 ? '✓' : '—'} • 
                          Price: {Object.keys(p.priceAnswers).length > 0 ? '✓' : '—'}
                        </div>
                      </div>
                      {event.status === 'results' && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-700">{p.points}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Results Section */}
            {event.status === 'results' && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">🏆 Final Results</h2>
                <div className="space-y-2">
                  {participants
                    .sort((a, b) => b.points - a.points)
                    .map((p, index) => (
                      <div
                        key={p.id}
                        className={`p-4 rounded-lg flex justify-between items-center ${
                          index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' :
                          index === 1 ? 'bg-gray-100' :
                          index === 2 ? 'bg-orange-50' :
                          'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                          <div>
                            <div className="font-bold text-gray-800">{p.name}</div>
                            <div className="text-sm text-gray-600">
                              Display: {p.displayCorrect} • Bottle: {p.bottleCorrect} • Price: {p.priceCorrect}
                            </div>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-purple-700">{p.points}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
