// In components/dashboard/recent-posts.tsx
import { type ComponentPropsWithoutRef } from "react";
import { type AnalyticsComponentProps } from "@/components/analytics/engagment-chart";

interface RecentPostsProps extends ComponentPropsWithoutRef<"div"> {
  accounts: AnalyticsComponentProps["accounts"];
}

export function RecentPosts({ accounts, ...props }: RecentPostsProps) {
  return (
    <div {...props} className="space-y-4">
      {/* Add your recent posts component here */}
    </div>
  );
}