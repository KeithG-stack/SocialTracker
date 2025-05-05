export interface AnalyticsComponentProps {
    accounts: Array<{
      id: string;
      platform: string;
      platformAccountId: string;
      accountName: string;
      profileUrl: string;
      accessToken: string;
      refreshToken?: string;
      expiresAt?: Date;
    }>;
    platform: string;
    timeframe: string;
}

export default function EngagementChart({ 
  accounts, 
  platform, 
  timeframe 
}: AnalyticsComponentProps) {
    // Your component implementation here
}