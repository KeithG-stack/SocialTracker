// app/dashboard/page.js
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';

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