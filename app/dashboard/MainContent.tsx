'use client';

import React from 'react';

const MainContent = () => {
  return (
    <div className="ml-64 p-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overview Cards */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h3 className="text-indigo-600 font-semibold">Total Followers</h3>
            <p className="text-3xl font-bold text-indigo-600">12,345</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-green-600 font-semibold">Engagement Rate</h3>
            <p className="text-3xl font-bold text-green-600">12.5%</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-blue-600 font-semibold">Posts This Week</h3>
            <p className="text-3xl font-bold text-blue-600">7</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-gray-600">Posted on Instagram</p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">Scheduled Facebook post</p>
              <p className="text-sm text-gray-500">3 hours ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">Twitter engagement spike</p>
              <p className="text-sm text-gray-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
