// components/dashboard/TwitterEngagement.js
'use client';

import useSWR from 'swr';

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

interface Tweet {
  text: string;
  likes: number;
  retweets: number;
  replies: number;
}

interface TwitterEngagementResponse {
  engagement: Tweet[];
}

export default function TwitterEngagement() {
  const { data, error, isLoading } = useSWR<TwitterEngagementResponse>('/api/twitter-engagement', fetcher, {
    refreshInterval: 60000,
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Twitter Engagement</h3>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching engagement</p>
      ) : data?.engagement ? (
        <ul>
          {data.engagement.map((tweet) => (
            <li key={tweet.text} className="mb-4 border-b pb-2 last:border-b-0">
              <p className="text-gray-800">{tweet.text.substring(0, 50)}...</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                <span>Likes: {tweet.likes}</span>
                <span>Retweets: {tweet.retweets}</span>
                <span>Replies: {tweet.replies}</span>
              </div>
            </li>
          ))}
          {data.engagement.length === 0 && <p className="text-gray-500 italic">No recent tweets found.</p>}
        </ul>
      ) : (
        <p className="text-gray-500">No engagement data available.</p>
      )}
    </div>
  );
}