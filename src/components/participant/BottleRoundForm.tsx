import { useState } from 'react';
import { useParticipantStore } from '../../store/participantStore';
import { generateOrdinals } from '../../utils/labels';

export default function BottleRoundForm() {
  const { bottleLabels, wineCount, bottleAnswers, submitBottleAnswers } = useParticipantStore();
  const [answers, setAnswers] = useState<Record<string, number>>(bottleAnswers || {});
  const [submitted, setSubmitted] = useState(Object.keys(bottleAnswers || {}).length > 0);

  const ordinals = generateOrdinals(wineCount);

  const handleChange = (label: string, tastingOrder: number) => {
    setAnswers({ ...answers, [label]: tastingOrder });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < bottleLabels.length) {
      alert('Please answer for all bottles');
      return;
    }

    submitBottleAnswers(answers);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-pink-900 mb-2">
          Bottle Label Round
        </h2>
        <p className="text-gray-600">
          Match each bottle label to the order you tasted them in
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <h3 className="text-lg font-semibold text-green-800">Answers Submitted!</h3>
          <p className="text-green-600 mt-2">Waiting for other participants...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {bottleLabels.map((label) => (
            <div key={label} className="bg-gray-50 p-4 rounded-lg">
              <label className="block font-medium text-gray-800 mb-3">
                Bottle {label} was the...
              </label>
              <select
                value={answers[label] ?? ''}
                onChange={(e) => handleChange(label, parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="">Select order</option>
                {ordinals.map((ord, index) => (
                  <option key={index} value={index}>
                    {ord} wine I tasted
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          >
            Submit Answers
          </button>
        </form>
      )}
    </div>
  );
}
