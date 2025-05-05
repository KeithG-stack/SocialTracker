// In components/dashboard/welcome.tsx
import { type ComponentPropsWithoutRef } from "react";

interface WelcomeProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
}

export function DashboardWelcome({ name, ...props }: WelcomeProps) {
  return (
    <div {...props} className="flex items-center gap-4">
      <h1 className="text-2xl font-bold">Welcome back, {name}!</h1>
    </div>
  );
}