// app/api/instagram-engagement/route.js
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
    const instagramAccount = (await pool.query('SELECT access_token FROM social_accounts WHERE user_id = $1 AND provider = $2', [userId, 'instagram'])).rows[0];

    if (!instagramAccount?.access_token) {
      return new Response(JSON.stringify({ error: 'No connected Instagram account' }), { status: 400 });
    }

    const accessToken = instagramAccount.access_token;

    // Fetch recent media
    const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption&access_token=${accessToken}&limit=5`);
    const mediaData = await mediaResponse.json();

    if (!mediaData?.data) {
      return new Response(JSON.stringify({ engagement: [] }), { headers: { 'Content-Type': 'application/json' } });
    }

    const engagementPromises = mediaData.data.map(async (media) => {
      const engagementResponse = await fetch(`https://graph.instagram.com/<span class="math-inline">\{media\.id\}?fields\=like\_count,comments\_count&access\_token\=</span>{accessToken}`);
      const engagementData = await engagementResponse.json();
      return {
        caption: media.caption || 'No caption',
        likes: engagementData?.like_count || 0,
        comments: engagementData?.comments_count || 0,
      };
    });

    const engagement = await Promise.all(engagementPromises);

    return new Response(JSON.stringify({ engagement }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching Instagram engagement:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Instagram engagement' }), { status: 500 });
  }
}