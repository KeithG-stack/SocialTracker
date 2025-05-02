import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Navbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Spinner } from "@/components/ui/spinner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
        <Suspense fallback={<Spinner />}>
          <Sidebar />
        </Suspense>
      </div>
      <main className="md:pl-72">
        <Navbar />
        <div className="p-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
