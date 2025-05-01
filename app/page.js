import DashboardShell from "./components/DashboardShell";
import EngagementMetrics from "./components/EngagementMetrics";
import FollowerGrowth from "./components/FollowerGrowth";
import DashboardCustomizer from "./components/DashboardCustomizer";
import { Suspense } from "react";

export default async function DashboardPage() {
  const session = await getServerSession();
  const accounts = await fetchUserAccounts(session.user.id);
  
  return (
    <DashboardShell>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading metrics...</div>}>
          <EngagementMetrics accounts={accounts} />
        </Suspense>
        
        <Suspense fallback={<div>Loading growth data...</div>}>
          <FollowerGrowth accounts={accounts} />
        </Suspense>
      </div>
      
      <DashboardCustomizer />
    </DashboardShell>
  );
}