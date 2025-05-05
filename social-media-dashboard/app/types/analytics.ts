// Create types/analytics.ts
export interface SocialAccount {
    id: string;
    platform: "twitter" | "instagram" | "facebook" | "linkedin";
    platformAccountId: string;
    accountName: string;
    profileUrl: string | null;
    accessToken: string;
    refreshToken: string | null;
    tokenExpiresAt: Date | null;
    userId: string;
    teamId: string | null;
    createdAt: Date;
  }
  
  export interface AnalyticsComponentProps {
    accounts: SocialAccount[];
    platform: string;
    timeframe: string;
  }