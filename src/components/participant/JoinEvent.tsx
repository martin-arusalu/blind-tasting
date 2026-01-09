import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useParticipantStore } from '../../store/participantStore';

export default function JoinEvent() {
  const navigate = useNavigate();
  const { hostPeerId: urlPeerId } = useParams();
  const joinEvent = useParticipantStore((state) => state.joinEvent);
  
  const [name, setName] = useState('');
  const [hostPeerId, setHostPeerId] = useState(urlPeerId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!hostPeerId.trim()) {
      setError('Please enter the event code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await joinEvent(hostPeerId.trim(), name.trim());
      navigate('/participate');
    } catch (error: unknown) {
      console.error('Failed to join event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to join event. Please check the code and make sure you are on the same network as the host.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥂</div>
          <h1 className="text-3xl font-bold text-purple-900 mb-2">
            Join Tasting Event
          </h1>
          <p className="text-gray-600">
            Enter your name and the event code to participate
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Code *
            </label>
            <input
              type="text"
              value={hostPeerId}
              onChange={(e) => setHostPeerId(e.target.value)}
              placeholder="Scan QR or enter code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join Event'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 hover:bg-gray-50 py-3 px-6 rounded-lg"
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}
