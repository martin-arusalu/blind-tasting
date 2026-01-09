import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHostStore } from '../../store/hostStore';
import { generateId } from '../../utils/id';
import type { Wine, PriceRange } from '../../types';

export default function EventSetup() {
  const navigate = useNavigate();
  const createEvent = useHostStore((state) => state.createEvent);
  
  const [wines, setWines] = useState<Wine[]>([
    { id: generateId(), name: '', year: '', price: 0 },
  ]);
  
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([
    { id: generateId(), label: '€0-10', min: 0, max: 10 },
    { id: generateId(), label: '€10-20', min: 10, max: 20 },
    { id: generateId(), label: '€20-30', min: 20, max: 30 },
    { id: generateId(), label: '€30-50', min: 30, max: 50 },
    { id: generateId(), label: '€50+', min: 50, max: 999999 },
  ]);
  
  const [loading, setLoading] = useState(false);

  const addWine = () => {
    setWines([...wines, { id: generateId(), name: '', year: '', price: 0 }]);
  };

  const removeWine = (id: string) => {
    if (wines.length > 1) {
      setWines(wines.filter((w) => w.id !== id));
    }
  };

  const updateWine = (id: string, field: keyof Wine, value: string | number) => {
    setWines(wines.map((w) => (w.id === id ? { ...w, [field]: value } : w)));
  };

  const addPriceRange = () => {
    setPriceRanges([
      ...priceRanges,
      { id: generateId(), label: '', min: 0, max: 0 },
    ]);
  };

  const removePriceRange = (id: string) => {
    if (priceRanges.length > 1) {
      setPriceRanges(priceRanges.filter((r) => r.id !== id));
    }
  };

  const updatePriceRange = (id: string, field: keyof PriceRange, value: string | number) => {
    setPriceRanges(priceRanges.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validWines = wines.filter((w) => w.name && w.price > 0);
    if (validWines.length < 3) {
      alert('Please add at least 3 wines with names and prices');
      return;
    }
    
    const validRanges = priceRanges.filter((r) => r.label && r.min >= 0 && r.max > r.min);
    if (validRanges.length < 3) {
      alert('Please add at least 3 valid price ranges');
      return;
    }

    setLoading(true);
    try {
      await createEvent(validWines, validRanges);
      navigate('/host/dashboard');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-purple-900 mb-6">
          Setup Blind Tasting Event
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Wines Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Wines</h2>
              <button
                type="button"
                onClick={addWine}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg"
              >
                + Add Wine
              </button>
            </div>

            <div className="space-y-4">
              {wines.map((wine) => (
                <div
                  key={wine.id}
                  className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Wine Name *
                      </label>
                      <input
                        type="text"
                        value={wine.name}
                        onChange={(e) => updateWine(wine.id, 'name', e.target.value)}
                        placeholder="e.g., Château Margaux"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year (optional)
                      </label>
                      <input
                        type="text"
                        value={wine.year}
                        onChange={(e) => updateWine(wine.id, 'year', e.target.value)}
                        placeholder="e.g., 2018"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (€) *
                      </label>
                      <input
                        type="number"
                        value={wine.price || ''}
                        onChange={(e) => updateWine(wine.id, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 45"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  {wines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWine(wine.id)}
                      className="mt-7 text-red-500 hover:text-red-700 p-2"
                      title="Remove wine"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price Ranges Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Price Ranges</h2>
              <button
                type="button"
                onClick={addPriceRange}
                className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-lg"
              >
                + Add Range
              </button>
            </div>

            <div className="space-y-3">
              {priceRanges.map((range) => (
                <div
                  key={range.id}
                  className="flex gap-3 items-end bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label *
                      </label>
                      <input
                        type="text"
                        value={range.label}
                        onChange={(e) => updatePriceRange(range.id, 'label', e.target.value)}
                        placeholder="e.g., €20-30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min (€) *
                      </label>
                      <input
                        type="number"
                        value={range.min}
                        onChange={(e) => updatePriceRange(range.id, 'min', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max (€) *
                      </label>
                      <input
                        type="number"
                        value={range.max}
                        onChange={(e) => updatePriceRange(range.id, 'max', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  {priceRanges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePriceRange(range.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove range"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50"
            >
              {loading ? 'Creating Event...' : 'Create Event & Start'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
