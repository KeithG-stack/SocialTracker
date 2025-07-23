/**
 * TwitterEngagement.tsx
 * 
 * Dashboard widget displaying recent Twitter engagement using dummy data.
 * Shows tweet text and engagement metrics (likes, retweets, replies).
 */

'use client';

/**
 * Represents a single tweet's engagement metrics.
 */
interface Tweet {
  text: string;
  likes: number;
  retweets: number;
  replies: number;
}

/**
 * Response structure for Twitter engagement data.
 */
interface TwitterEngagementResponse {
  engagement: Tweet[];
}

const dummyData: TwitterEngagementResponse = {
  engagement: [
    { text: 'First tweet!', likes: 15, retweets: 3, replies: 1 },
    { text: 'Another tweet about our product.', likes: 22, retweets: 5, replies: 2 },
  ],
};

/**
 * TwitterEngagement component displays a list of recent tweets and their engagement.
 */
export default function TwitterEngagement() {
  const data = dummyData;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Twitter Engagement</h3>
      <ul>
        {data.engagement.map((tweet, idx) => (
          <li key={tweet.text + idx} className="mb-4 border-b pb-2 last:border-b-0">
            <p className="text-gray-800">
              {tweet.text.length > 50 ? `${tweet.text.substring(0, 50)}...` : tweet.text}
            </p>
            <div className="flex space-x-4 mt-2 text-sm text-gray-600">
              <span>Likes: {tweet.likes}</span>
              <span>Retweets: {tweet.retweets}</span>
              <span>Replies: {tweet.replies}</span>
            </div>
          </li>
        ))}
        {data.engagement.length === 0 && <p className="text-gray-500 italic">No recent tweets found.</p>}
      </ul>
    </div>
  );
}