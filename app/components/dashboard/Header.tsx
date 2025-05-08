import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Link 
          href="/dashboard/settings" 
          className="text-gray-300 hover:text-white"
        >
          Settings
        </Link>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
