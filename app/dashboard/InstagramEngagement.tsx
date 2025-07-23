'use client';

type EngagementPost = {
  id: string;
  caption: string;
  likes: number;
  comments: number;
};

type EngagementData = {
  engagement: EngagementPost[];
};

const dummyData: EngagementData = {
  engagement: [
    { id: '1', caption: 'First Instagram post', likes: 25, comments: 5 },
    { id: '2', caption: 'Another great photo!', likes: 40, comments: 8 },
  ],
};

export default function InstagramEngagement() {
  const data = dummyData;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Instagram Engagement</h3>
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
    </div>
  );
}