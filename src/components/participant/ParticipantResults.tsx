import { useParticipantStore } from '../../store/participantStore';

export default function ParticipantResults() {
  const { name, results } = useParticipantStore();

  if (!results) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Calculating results...</p>
      </div>
    );
  }

  const yourRank = results.leaderboard.findIndex((p) => p.name === name) + 1;
  const isWinner = yourRank === 1;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{isWinner ? '🏆' : '🎉'}</div>
        <h2 className="text-3xl font-bold text-purple-900 mb-2">
          {isWinner ? 'Congratulations!' : 'Results Are In!'}
        </h2>
        {isWinner && (
          <p className="text-xl text-purple-600 font-semibold">
            You are the winner!
          </p>
        )}
      </div>

      {/* Your Score */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">Your Score</div>
          <div className="text-5xl font-bold text-purple-900 mb-4">
            {results.points}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-800">{results.displayCorrect}</div>
              <div className="text-gray-600">Display</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">{results.bottleCorrect}</div>
              <div className="text-gray-600">Bottle</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">{results.priceCorrect}</div>
              <div className="text-gray-600">Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Leaderboard</h3>
        <div className="space-y-2">
          {results.leaderboard.map((participant, index) => (
            <div
              key={participant.name}
              className={`p-4 rounded-lg flex justify-between items-center ${
                participant.name === name
                  ? 'bg-purple-100 border-2 border-purple-400'
                  : index === 0
                  ? 'bg-yellow-100'
                  : index === 1
                  ? 'bg-gray-100'
                  : index === 2
                  ? 'bg-orange-50'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-400">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div>
                  <div className={`font-semibold ${participant.name === name ? 'text-purple-900' : 'text-gray-800'}`}>
                    {participant.name}
                    {participant.name === name && ' (You)'}
                  </div>
                  <div className="text-xs text-gray-600">
                    D: {participant.displayCorrect} • B: {participant.bottleCorrect} • P: {participant.priceCorrect}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {participant.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
