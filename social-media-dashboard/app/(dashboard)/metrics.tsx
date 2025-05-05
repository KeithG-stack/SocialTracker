// In components/dashboard/metrics.tsx
import { type ComponentPropsWithoutRef } from "react";
import { type AnalyticsComponentProps } from "@/components/analytics/engagment-chart";

interface MetricsProps extends ComponentPropsWithoutRef<"div"> {
  accounts: AnalyticsComponentProps["accounts"];
}

export function DashboardMetrics({ accounts, ...props }: MetricsProps) {
  return (
    <div {...props} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Add your metrics components here */}
    </div>
  );
}