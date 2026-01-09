import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParticipantStore } from '../../store/participantStore';
import DisplayRoundForm from './DisplayRoundForm.tsx';
import BottleRoundForm from './BottleRoundForm.tsx';
import PriceRoundForm from './PriceRoundForm.tsx';
import ParticipantResults from './ParticipantResults.tsx';

export default function ParticipantView() {
  const navigate = useNavigate();
  const { connected, name, currentRound, reset } = useParticipantStore();

  useEffect(() => {
    if (!connected) {
      navigate('/join');
    }
  }, [connected, navigate]);

  if (!connected) return null;

  const handleLeave = () => {
    if (confirm('Are you sure you want to leave the event?')) {
      reset();
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-purple-900">
              Welcome, {name}!
            </h1>
            <p className="text-sm text-gray-600 mt-1 capitalize">
              {currentRound.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
          <button
            onClick={handleLeave}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Leave Event
          </button>
        </div>

        {/* Round Content */}
        <div>
          {currentRound === 'waiting' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Waiting for Host
              </h2>
              <p className="text-gray-600">
                The event will begin shortly. Get ready to taste!
              </p>
            </div>
          )}

          {currentRound === 'displayRound' && <DisplayRoundForm />}
          {currentRound === 'bottleRound' && <BottleRoundForm />}
          {currentRound === 'priceRound' && <PriceRoundForm />}
          {currentRound === 'results' && <ParticipantResults />}
        </div>
      </div>
    </div>
  );
}
