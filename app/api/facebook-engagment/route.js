// app/api/facebook-engagement/route.js
import { auth } from '@/auth';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const userId = session.user.id;
    const facebookAccount = (await pool.query('SELECT access_token, provider_account_id FROM social_accounts WHERE user_id = $1 AND provider = $2', [userId, 'facebook'])).rows[0];

    if (!facebookAccount?.access_token || !facebookAccount?.provider_account_id) {
      return new Response(JSON.stringify({ error: 'No connected Facebook account' }), { status: 400 });
    }

    const accessToken = facebookAccount.access_token;
    const facebookAccountId = facebookAccount.provider_account_id; // Could be user ID or Page ID

    // Fetch recent posts (adjust fields and limit as needed)
    const postsResponse = await fetch(`https://graph.facebook.com/v19.0/<span class="math-inline">\{facebookAccountId\}/posts?fields\=message,created\_time&access\_token\=</span>{accessToken}&limit=5`);
    const postsData = await postsResponse.json();

    if (!postsData?.data) {
      return new Response(JSON.stringify({ engagement: [] }), { headers: { 'Content-Type': 'application/json' } });
    }

    const engagementPromises = postsData.data.map(async (post) => {
      const engagementResponse = await fetch(`https://graph.facebook.com/v19.0/<span class="math-inline">\{post\.id\}?fields\=likes\.summary\(true\),comments\.summary\(true\),shares&access\_token\=</span>{accessToken}`);
      const engagementData = await engagementResponse.json();
      return {
        message: post.message || 'No message',
        likes: engagementData?.likes?.summary?.total_count || 0,
        comments: engagementData?.comments?.summary?.total_count || 0,
        shares: engagementData?.shares?.count || 0,
        created_time: post.created_time,
      };
    });

    const engagement = await Promise.all(engagementPromises);

    return new Response(JSON.stringify({ engagement }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching Facebook engagement:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Facebook engagement' }), { status: 500 });
  }
}