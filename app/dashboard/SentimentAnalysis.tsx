// components/dashboard/SentimentAnalysis.js
'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';

const fetcher = (url: string, body: any) => fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
}).then(res => res.json());

export default function SentimentAnalysis() {
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [contentToAnalyze, setContentToAnalyze] = useState([]);
  const { data, error, isLoading, mutate } = useSWR(
    '/api/sentiment-analysis',
    (url) => fetcher(url, { platform: selectedPlatform, content: contentToAnalyze }),
    { refreshInterval: 60000 }
  );

  // Fetch recent content based on the selected platform
  const { data: twitterData } = useSWR(selectedPlatform === 'twitter' ? '/api/twitter-engagement' : null, fetcher);
  const { data: instagramData } = useSWR(selectedPlatform === 'instagram' ? '/api/instagram-engagement' : null, fetcher);
  const { data: facebookData } = useSWR(selectedPlatform === 'facebook' ? '/api/facebook-engagement' : null, fetcher);

  useEffect(() => {
    if (selectedPlatform === 'twitter' && twitterData?.engagement) {
      setContentToAnalyze(twitterData.engagement.map((tweet: { text: string }) => tweet.text));
    } else if (selectedPlatform === 'instagram' && instagramData?.engagement) {
      setContentToAnalyze(instagramData.engagement.map((post: { caption: string }) => post.caption));
    } else if (selectedPlatform === 'facebook' && facebookData?.engagement) {
      setContentToAnalyze(facebookData.engagement.map((post: { message: string }) => post.message));
    } else {
      setContentToAnalyze([]);
    }
  }, [selectedPlatform, twitterData?.engagement, instagramData?.engagement, facebookData?.engagement]);

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value);
  };

  const handleRefresh = () => {
    mutate();
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
      {isLoading ? (
        <p className="text-gray-500">Analyzing sentiment for {selectedPlatform}...</p>
      ) : error ? (
        <p className="text-red-500">Error analyzing sentiment</p>
      ) : data?.sentiment ? (
        <p className="text-gray-800">{data.sentiment}</p>
      ) : (
        <p className="text-gray-500">No sentiment data available for {selectedPlatform}.</p>
      )}
      <button onClick={handleRefresh} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md">
        Refresh Sentiment
      </button>
    </div>
  );
}