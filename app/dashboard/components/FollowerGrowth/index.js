export default function FollowerGrowth({ accounts }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Follower Growth</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">New Followers</p>
            <p className="text-2xl font-bold">+123</p>
          </div>
          <div>
            <p className="text-gray-500">Total Followers</p>
            <p className="text-2xl font-bold">10,000</p>
          </div>
        </div>
      </div>
    );
  }