// components/dashboard/FacebookEngagement.tsx
'use client';
import useSWR from 'swr';

// Type definitions
interface Post {
  message: string;
  likes: number;
  comments: number;
  shares: number;
  created_time: string;
}

interface EngagementData {
  engagement: Post[];
  error?: string;
}

// Define the fetcher function with proper type annotations
const fetcher = <T,>(...args: Parameters<typeof fetch>): Promise<T> => 
  fetch(...args).then(res => res.json());

export default function FacebookEngagement(): JSX.Element {
  const { data, error, isLoading } = useSWR<EngagementData, Error>(
    '/api/facebook-engagement', 
    fetcher, 
    {
      refreshInterval: 60000,
    }
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Facebook Engagement</h3>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching engagement</p>
      ) : data?.engagement ? (
        <ul>
          {data.engagement.map((post) => (
            <li key={post.created_time} className="mb-4 border-b pb-2 last:border-b-0">
              <p className="text-gray-800">{post.message.substring(0, 50)}...</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                <span>Likes: {post.likes}</span>
                <span>Comments: {post.comments}</span>
                <span>Shares: {post.shares}</span>
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