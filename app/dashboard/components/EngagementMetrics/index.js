export default function EngagementMetrics({ accounts }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Total Likes</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div>
            <p className="text-gray-500">Comments</p>
            <p className="text-2xl font-bold">567</p>
          </div>
        </div>
      </div>
    );
  }