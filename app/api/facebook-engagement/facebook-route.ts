// facebook-route.ts

import auth from 'next-auth';
// Correctly import authOptions from the root auth.ts file
import { authOptions } from '../../auth';
import { Pool, QueryResult } from 'pg';
import { NextResponse } from 'next/server';



// Type definitions
interface Session {
  user?: {
    id?: string;
  };
}

interface SocialAccount {
  access_token: string;
  provider_account_id: string;
}

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
}

interface FacebookPostsResponse {
  data?: FacebookPost[];
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

interface FacebookEngagementResponse {
  likes?: {
    summary: {
      total_count: number;
    };
  };
  comments?: {
    summary: {
      total_count: number;
    };
  };
  shares?: {
    count: number;
  };
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

interface PostEngagement {
  message: string;
  likes: number;
  comments: number;
  shares: number;
  created_time: string;
}

// Initialize database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const session = await auth(authOptions) as Session | null;
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const userId = session.user.id;
    const result: QueryResult<SocialAccount> = await pool.query(
      'SELECT access_token, provider_account_id FROM social_accounts WHERE user_id = $1 AND provider = $2', 
      [userId, 'facebook']
    );
    
    const facebookAccount = result.rows[0];
    
    if (!facebookAccount?.access_token || !facebookAccount?.provider_account_id) {
      return NextResponse.json({ error: 'No connected Facebook account' }, { status: 400 });
    }
    
    const accessToken = facebookAccount.access_token;
    const facebookAccountId = facebookAccount.provider_account_id; // Could be user ID or Page ID
    
    // Fetch recent posts (adjust fields and limit as needed)
    const postsResponse = await fetch(
      `https://graph.facebook.com/v19.0/${facebookAccountId}/posts?fields=message,created_time&access_token=${accessToken}&limit=5`
    );
    
    const postsData: FacebookPostsResponse = await postsResponse.json();
    
    if (!postsData?.data) {
      return NextResponse.json({ engagement: [] });
    }
    
    const engagementPromises = postsData.data.map(async (post) => {
      const engagementResponse = await fetch(
        `https://graph.facebook.com/v19.0/${post.id}?fields=likes.summary(true),comments.summary(true),shares&access_token=${accessToken}`
      );
      
      const engagementData: FacebookEngagementResponse = await engagementResponse.json();
      
      return {
        message: post.message || 'No message',
        likes: engagementData?.likes?.summary?.total_count || 0,
        comments: engagementData?.comments?.summary?.total_count || 0,
        shares: engagementData?.shares?.count || 0,
        created_time: post.created_time,
      };
    });
    
    const engagement: PostEngagement[] = await Promise.all(engagementPromises);
    
    return NextResponse.json({ engagement });
    
  } catch (error) {
    console.error('Error fetching Facebook engagement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Facebook engagement' }, 
      { status: 500 }
    );
  }
}
