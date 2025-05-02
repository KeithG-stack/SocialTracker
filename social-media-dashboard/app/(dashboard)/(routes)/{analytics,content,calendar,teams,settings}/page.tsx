import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import AnalyticsHeader from "@/components/analytics/header";
import PlatformSelector from "@/components/analytics/platform-selector";
import EngagementChart from "@/components/analytics/engagement-chart";
import FollowerGrowth from "@/components/analytics/follower-growth";
import ContentPerformance from "@/components/analytics/content-performance";
import { Spinner } from "@/components/ui/spinner";

export default async function AnalyticsPage({
  searchParams
}: {
  searchParams: { platform?: string; timeframe?: string }
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accounts = await db.query.socialAccounts.findMany({
    where: eq(socialAccounts.userId, session.user.id)
  });

  if (accounts.length === 0) {
    redirect("/dashboard");
  }

  const platform = searchParams.platform || "all";
  const timeframe = searchParams.timeframe || "7d";

  return (
    <div className="space-y-8">
      <AnalyticsHeader />
      
      <PlatformSelector 
        platforms={accounts.map(a => a.platform)} 
        selectedPlatform={platform} 
        timeframe={timeframe}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<Spinner />}>
          <EngagementChart 
            accounts={accounts} 
            platform={platform} 
            timeframe={timeframe}
          />
        </Suspense>
        
        <Suspense fallback={<Spinner />}>
          <FollowerGrowth 
            accounts={accounts} 
            platform={platform} 
            timeframe={timeframe}
          />
        </Suspense>
        
        <Suspense fallback={<Spinner />}>
          <ContentPerformance 
            accounts={accounts} 
            platform={platform} 
            timeframe={timeframe}
          />
        </Suspense>
      </div>
    </div>
  );