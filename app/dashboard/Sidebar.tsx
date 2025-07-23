/**
 * Sidebar.tsx
 * 
 * Dashboard sidebar navigation component.
 * Displays navigation links, connected social accounts, and sign out button.
 */

'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Represents a connected social account.
 */
interface SocialAccount {
  id: string;
  provider: string;
  provider_account_id: string;
}

/**
 * Sidebar component for dashboard navigation and account info.
 */
export default function Sidebar() {
  const { data: session } = useSession();
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchAccounts() {
      const user = session?.user as { id?: string; sub?: string };
      const userId = user?.id || user?.sub;
      if (userId) {
        try {
          const res = await fetch(`/api/social-accounts?userId=${userId}`);
          const accounts = await res.json();
          setConnectedAccounts(accounts);
        } catch (error) {
          console.error("Error fetching social accounts:", error);
        }
      }
    }
    fetchAccounts();
  }, [session?.user]);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/content-calendar', label: 'Content Calendar' },
    // Add more links as needed
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-md z-10">
      <div className="p-6">
        <Link href="/dashboard" className="text-2xl font-semibold text-indigo-600 block mb-4">
          Social Dashboard
        </Link>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block py-2 px-4 rounded transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-6 mt-auto">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Connected Accounts</h3>
        <ul>
          {connectedAccounts.map((account) => (
            <li key={account.provider} className="py-1 px-4 text-gray-600">
              {account.provider} ({account.provider_account_id.substring(0, 8)}...)
            </li>
          ))}
          {connectedAccounts.length === 0 && (
            <li className="py-1 px-4 text-gray-500 italic">No accounts connected</li>
          )}
        </ul>
        <button onClick={() => signOut()} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md w-full">
          Sign Out
        </button>
      </div>
    </aside>
  );
}