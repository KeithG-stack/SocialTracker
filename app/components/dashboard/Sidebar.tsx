import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-8">Social Dashboard</h2>
        <nav className="space-y-2">
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 hover:bg-gray-700 rounded"
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/analytics" 
            className="block px-4 py-2 hover:bg-gray-700 rounded"
          >
            Analytics
          </Link>
          <Link 
            href="/dashboard/scheduling" 
            className="block px-4 py-2 hover:bg-gray-700 rounded"
          >
            Scheduling
          </Link>
          <Link 
            href="/dashboard/followers" 
            className="block px-4 py-2 hover:bg-gray-700 rounded"
          >
            Followers
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
