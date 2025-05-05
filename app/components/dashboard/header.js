// components/dashboard/Header.js
'use client';

import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow py-4 px-6 md:px-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        {session?.user?.name && (
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">{session.user.name}</span>
            {/* Optional: User profile image */}
          </div>
        )}
      </div>
    </header>
  );
}