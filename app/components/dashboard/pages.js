// app/dashboard/page.js
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import MainContent from '@/components/dashboard/MainContent';

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:ml-64 flex flex-col flex-1">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}