// app/dashboard/page.tsx (no 'use client' at the top)
import { getData } from '@/lib/db/connection';

export default async function DashboardPage() {
  const data = await getData();
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}