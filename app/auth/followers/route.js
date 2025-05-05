// app/api/followers/route.js
import { auth } from '@/auth'; // Assuming you've configured NextAuth
import { getUserSocialAccounts } from '@/lib/data/accounts'; // To get connected accounts

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const userId = session.user.id;
    const accounts = await getUserSocialAccounts(userId);
    let totalFollowers = 0;

    // Function to fetch followers for a specific platform
    async function fetchFollowers(provider, accessToken, providerAccountId) {
      try {
        switch (provider) {
          case 'twitter':
            // Replace with actual Twitter API call using accessToken and providerAccountId
            const twitterResponse = await fetch(`https://api.twitter.com/2/users/${providerAccountId}?fields=public_metrics`, {
              headers: {
                Authorization: `Bearer ${accessToken}`, // Twitter uses Bearer tokens
              },
            });
            const twitterData = await twitterResponse.json();
            return twitterData?.data?.public_metrics?.followers_count || 0;
          case 'instagram':
            // Replace with actual Instagram Graph API call using accessToken
            const instagramResponse = await fetch(`https://graph.instagram.com/me?fields=followers_count&access_token=${accessToken}`);
            const instagramData = await instagramResponse.json();
            return instagramData?.followers_count || 0;
          case 'facebook':
            // Replace with actual Facebook Graph API call using accessToken and providerAccountId
            const facebookResponse = await fetch(`https://graph.facebook.com/<span class="math-inline">\{providerAccountId\}?fields\=followers\_count&access\_token\=</span>{accessToken}`);
            const facebookData = await facebookResponse.json();
            return facebookData?.followers_count || 0;
          case 'linkedin':
            // Replace with actual LinkedIn API call using accessToken
            const linkedinResponse = await fetch('https://api.linkedin.com/v2/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            const linkedinUserData = await linkedinResponse.json();
            // You might need to make a subsequent call to get follower counts for profiles or pages
            console.log('LinkedIn User Data:', linkedinUserData); // Log to inspect the structure
            return 0; // Placeholder - LinkedIn API for followers is more complex
          default:
            return 0;
        }
      } catch (error) {
        console.error(`Error fetching ${provider} followers:`, error);
        return 0;
      }
    }

    // Fetch followers for each connected account
    const followerPromises = accounts.map(async (account) => {
      // You'll need to retrieve the access token from your database based on account.provider and userId
      // For simplicity here, I'm assuming you can fetch it within this function or pass it along.
      // A better approach might be to fetch all tokens upfront.
      const socialAccountDetails = await pool.query('SELECT access_token, provider_account_id FROM social_accounts WHERE user_id = $1 AND provider = $2', [userId, account.provider]);
      const { access_token, provider_account_id } = socialAccountDetails.rows[0] || {};

      if (access_token && provider_account_id) {
        return await fetchFollowers(account.provider, access_token, provider_account_id);
      }
      return 0;
    });

    const followers = await Promise.all(followerPromises);
    totalFollowers = followers.reduce((sum, count) => sum + count, 0);

    return new Response(JSON.stringify({ totalFollowers }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching total followers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch followers' }), { status: 500 });
  }
}

// Import your database connection pool
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});