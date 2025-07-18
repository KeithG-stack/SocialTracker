// app/api/followers/route.ts
// Update the path below to the correct relative path if 'auth' is a local file, e.g.:
import { auth } from '../../../auth';
// Or, if 'auth' is from a package, install it using npm or yarn.
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

interface SocialAccount {
  provider: string;
  access_token: string;
  provider_account_id: string;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Function to fetch followers for a specific platform
  async function fetchFollowers(provider: string, accessToken: string, providerAccountId: string): Promise<number> {
    try {
      switch (provider) {
        case 'twitter':
          const twitterResponse = await fetch(`https://api.twitter.com/2/users/${providerAccountId}?user.fields=public_metrics`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          if (!twitterResponse.ok) {
            console.error(`Twitter API error: ${twitterResponse.status}`);
            return 0;
          }
          
          const twitterData = await twitterResponse.json();
          return twitterData?.data?.public_metrics?.followers_count || 0;

        case 'instagram':
          const instagramResponse = await fetch(`https://graph.instagram.com/me?fields=followers_count&access_token=${accessToken}`);
          
          if (!instagramResponse.ok) {
            console.error(`Instagram API error: ${instagramResponse.status}`);
            return 0;
          }
          
          const instagramData = await instagramResponse.json();
          return instagramData?.followers_count || 0;

        case 'facebook':
          const facebookResponse = await fetch(`https://graph.facebook.com/${providerAccountId}?fields=followers_count&access_token=${accessToken}`);
          
          if (!facebookResponse.ok) {
            console.error(`Facebook API error: ${facebookResponse.status}`);
            return 0;
          }
          
          const facebookData = await facebookResponse.json();
          return facebookData?.followers_count || 0;

        case 'linkedin':
          // LinkedIn follower count requires special permissions
          // This is a placeholder implementation
          const linkedinResponse = await fetch('https://api.linkedin.com/v2/people/(id:me)', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          if (!linkedinResponse.ok) {
            console.error(`LinkedIn API error: ${linkedinResponse.status}`);
            return 0;
          }
          
          // LinkedIn doesn't provide follower count in basic API
          return 0;

        default:
          return 0;
      }
    } catch (error) {
      console.error(`Error fetching ${provider} followers:`, error);
      return 0;
    }
  }

  try {
    const userId = session.user.id;
    
    // Get all social accounts for the user
    const accounts = await sql`
      SELECT provider, access_token, provider_account_id 
      FROM social_accounts 
      WHERE user_id = ${userId}
    ` as SocialAccount[];

    let totalFollowers = 0;

    // Fetch followers for each connected account
    const followerPromises = accounts.map(async (account) => {
      if (account.access_token && account.provider_account_id) {
        return await fetchFollowers(account.provider, account.access_token, account.provider_account_id);
      }
      return 0;
    });

    const followers = await Promise.all(followerPromises);
    totalFollowers = followers.reduce((sum, count) => sum + count, 0);

    return NextResponse.json({ totalFollowers });
  } catch (error) {
    console.error('Error fetching total followers:', error);
    return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 });
  }
}