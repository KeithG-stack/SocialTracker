// In components/dashboard/connect-account-card.tsx
import { type ComponentPropsWithoutRef } from "react";

export function ConnectAccountCard({ ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Connect Your Social Accounts</h2>
      {/* Add your connect account UI here */}
    </div>
  );
}