import { useState } from 'react';
import { useParticipantStore } from '../../store/participantStore';
import { generateOrdinals } from '../../utils/labels';

export default function PriceRoundForm() {
  const { wineCount, priceRanges, priceAnswers, submitPriceAnswers } = useParticipantStore();
  const [answers, setAnswers] = useState<Record<number, string>>(priceAnswers || {});
  const [submitted, setSubmitted] = useState(Object.keys(priceAnswers || {}).length > 0);

  const ordinals = generateOrdinals(wineCount);

  const handleChange = (wineIndex: number, rangeId: string) => {
    setAnswers({ ...answers, [wineIndex]: rangeId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < wineCount) {
      alert('Please select price range for all wines');
      return;
    }

    submitPriceAnswers(answers);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">
          Price Range Round
        </h2>
        <p className="text-gray-600">
          Guess the price range for each wine you tasted
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <h3 className="text-lg font-semibold text-green-800">Answers Submitted!</h3>
          <p className="text-green-600 mt-2">Waiting for results...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {Array.from({ length: wineCount }, (_, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <label className="block font-medium text-gray-800 mb-3">
                The {ordinals[index]} wine I tasted costs...
              </label>
              <select
                value={answers[index] ?? ''}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select price range</option>
                {priceRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          >
            Submit Answers
          </button>
        </form>
      )}
    </div>
  );
}
