/**
 * SentimentAnalysis.tsx
 * 
 * Dashboard widget for displaying sentiment analysis of social media content.
 * Allows platform selection and displays dummy sentiment results.
 */

'use client';

import { useState } from 'react';

const dummySentiment: Record<string, string> = {
  twitter: 'Overall positive sentiment detected in recent tweets.',
  instagram: 'Instagram posts show a neutral sentiment.',
  facebook: 'Facebook engagement is mostly positive.',
};

/**
 * SentimentAnalysis component displays sentiment for selected platform.
 */
export default function SentimentAnalysis() {
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value);
  };

  const handleRefresh = () => {
    // No-op for dummy data, but you could randomize or update sentiment here if desired
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Sentiment Analysis</h3>
      <div className="mb-4">
        <label htmlFor="platform" className="block text-gray-700 text-sm font-bold mb-2">
          Platform:
        </label>
        <select
          id="platform"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedPlatform}
          onChange={handlePlatformChange}
        >
          <option value="twitter">Twitter</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
        </select>
      </div>
      <p className="text-gray-800">{dummySentiment[selectedPlatform]}</p>
      <button
        onClick={handleRefresh}
        className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
      >
        Refresh Sentiment
      </button>
    </div>
  );
}