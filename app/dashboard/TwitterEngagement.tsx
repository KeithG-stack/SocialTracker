// components/dashboard/TwitterEngagement.js
'use client';

interface Tweet {
  text: string;
  likes: number;
  retweets: number;
  replies: number;
}

interface TwitterEngagementResponse {
  engagement: Tweet[];
}

const dummyData: TwitterEngagementResponse = {
  engagement: [
    { text: 'First tweet!', likes: 15, retweets: 3, replies: 1 },
    { text: 'Another tweet about our product.', likes: 22, retweets: 5, replies: 2 },
  ],
};

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