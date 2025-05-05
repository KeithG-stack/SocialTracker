// app/api/twitter-engagement/route.js
import { auth } from '@/auth';
import { getUserSocialAccounts } from '@/lib/data/accounts';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const userId = session.user.id;
    const twitterAccount = (await pool.query('SELECT access_token, provider_account_id FROM social_accounts WHERE user_id = $1 AND provider = $2', [userId, 'twitter'])).rows[0];

    if (!twitterAccount?.access_token || !twitterAccount?.provider_account_id) {
      return new Response(JSON.stringify({ error: 'No connected Twitter account' }), { status: 400 });
    }

    const accessToken = twitterAccount.access_token;
    const twitterUserId = twitterAccount.provider_account_id;

    // Fetch recent tweets
    const tweetsResponse = await fetch(`https://api.twitter.com/2/users/${twitterUserId}/tweets?max_results=5`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const tweetsData = await tweetsResponse.json();

    if (!tweetsData?.data) {
      return new Response(JSON.stringify({ engagement: [] }), { headers: { 'Content-Type': 'application/json' } });
    }

    const tweetIds = tweetsData.data.map((tweet) => tweet.id).join(',');

    // Fetch engagement metrics for these tweets
    const engagementResponse = await fetch(`https://api.twitter.com/2/tweets?ids=${tweetIds}&fields=public_metrics`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const engagementData = await engagementResponse.json();

    const engagement = tweetsData.data.map((tweet) => {
      const metrics = engagementData?.data?.find((e) => e.id === tweet.id)?.public_metrics || { like_count: 0, retweet_count: 0, reply_count: 0 };
      return {
        text: tweet.text,
        likes: metrics.like_count,
        retweets: metrics.retweet_count,
        replies: metrics.reply_count,
      };
    });

    return new Response(JSON.stringify({ engagement }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching Twitter engagement:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Twitter engagement' }), { status: 500 });
  }
}