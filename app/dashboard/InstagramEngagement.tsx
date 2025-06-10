'use client';

import useSWR from 'swr';

type EngagementPost = {
  id: string; // Change to number if your id is numeric
  caption: string;
  likes: number;
  comments: number;
};

type EngagementData = {
  engagement: EngagementPost[];
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function InstagramEngagement() {
  const { data, error, isLoading } = useSWR<EngagementData>('/api/instagram-engagement', fetcher, {
    refreshInterval: 60000,
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Instagram Engagement</h3>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching engagement</p>
      ) : data?.engagement ? (
        <ul>
          {data.engagement.map((post, idx) => (
            <li key={post.id ?? idx} className="mb-4 border-b pb-2 last:border-b-0">
              <p className="text-gray-800">
                {post.caption.length > 50
                  ? `${post.caption.substring(0, 50)}...`
                  : post.caption}
              </p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                <span>Likes: {post.likes}</span>
                <span>Comments: {post.comments}</span>
              </div>
            </li>
          ))}
          {data.engagement.length === 0 && <p className="text-gray-500 italic">No recent posts found.</p>}
        </ul>
      ) : (
        <p className="text-gray-500">No engagement data available.</p>
      )}
    </div>
  );
}