// components/dashboard/MainContent.js
'use client';

import useSWR from 'swr';
import TwitterEngagement from './TwitterEngagement';
import InstagramEngagement from './InstagramEngagement'; // Import the new widget

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function MainContent() {
  const { data: followersData, error: followersError, isLoading: followersLoading } = useSWR('/api/followers', fetcher, {
    refreshInterval: 60000,
  });

  return (
    <main className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Total Followers Widget */}
        </div>

        <TwitterEngagement />
        <InstagramEngagement /> {/* Include the Instagram widget */}

        {/* Add more widgets here */}
      </div>
    </main>
  );
}