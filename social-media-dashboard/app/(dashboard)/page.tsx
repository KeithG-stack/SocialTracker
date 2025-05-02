import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import DashboardWelcome from "@/components/dashboard/welcome";
import DashboardMetrics from "@/components/dashboard/metrics";
import RecentPosts from "@/components/dashboard/recent-posts";
import ConnectAccountCard from "@/components/dashboard/connect-account-card";
import { Spinner } from "@/components/ui/spinner";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accounts = await db.query.socialAccounts.findMany({
    where: eq(socialAccounts.userId, session.user.id)
  });

  return (
    <div className="space-y-8">
      <DashboardWelcome name={session.user.name || "there"} />
      
      {accounts.length === 0 ? (
        <ConnectAccountCard />
      ) : (
        <>
          <Suspense fallback={<Spinner />}>
            <DashboardMetrics accounts={accounts} />
          </Suspense>
          
          <Suspense fallback={<Spinner />}>
            <RecentPosts accounts={accounts} />
          </Suspense>
        </>
      )}
    </div>
  );
}