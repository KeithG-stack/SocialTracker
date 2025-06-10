// app/api/instagram-engagement/route.ts
import { auth } from '../../../auth';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

interface InstagramMedia {
  id: string;
  caption?: string;
  timestamp: string;
  media_type: string;
}

interface InstagramMetrics {
  like_count?: number;
  comments_count?: number;
}

interface InstagramMediaResponse {
  data?: InstagramMedia[];
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    
    const result = await sql`
      SELECT access_token 
      FROM social_accounts 
      WHERE user_id = ${userId} AND provider = 'instagram'
    `;
    
    const instagramAccount = result[0];

    if (!instagramAccount?.access_token) {
      return NextResponse.json({ error: 'No connected Instagram account' }, { status: 400 });
    }

    const accessToken = instagramAccount.access_token;

    // Fetch recent media
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,timestamp,media_type&access_token=${accessToken}&limit=5`
    );

    if (!mediaResponse.ok) {
      const errorData = await mediaResponse.json();
      console.error('Instagram API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to fetch Instagram media' 
      }, { status: mediaResponse.status });
    }

    const mediaData: InstagramMediaResponse = await mediaResponse.json();

    if (!mediaData?.data || mediaData.data.length === 0) {
      return NextResponse.json({ engagement: [] });
    }

    const engagementPromises = mediaData.data.map(async (media) => {
      try {
        const engagementResponse = await fetch(
          `https://graph.instagram.com/${media.id}?fields=like_count,comments_count&access_token=${accessToken}`
        );

        if (!engagementResponse.ok) {
          console.error(`Failed to fetch engagement for media ${media.id}`);
          return {
            id: media.id,
            caption: media.caption || 'No caption',
            media_type: media.media_type,
            timestamp: media.timestamp,
            likes: 0,
            comments: 0,
          };
        }

        const engagementData: InstagramMetrics = await engagementResponse.json();
        
        return {
          id: media.id,
          caption: media.caption || 'No caption',
          media_type: media.media_type,
          timestamp: media.timestamp,
          likes: engagementData?.like_count || 0,
          comments: engagementData?.comments_count || 0,
        };
      } catch (error) {
        console.error(`Error fetching engagement for media ${media.id}:`, error);
        return {
          id: media.id,
          caption: media.caption || 'No caption',
          media_type: media.media_type,
          timestamp: media.timestamp,
          likes: 0,
          comments: 0,
        };
      }
    });

    const engagement = await Promise.all(engagementPromises);

    return NextResponse.json({ engagement });
  } catch (error) {
    console.error('Error fetching Instagram engagement:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Instagram engagement' 
    }, { status: 500 });
  }
}