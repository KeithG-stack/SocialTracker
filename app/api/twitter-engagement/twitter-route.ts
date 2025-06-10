// app/api/twitter-engagement/route.ts
import { auth } from '../../auth';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

interface TwitterMetrics {
  like_count: number;
  retweet_count: number;
  reply_count: number;
  quote_count: number;
}

interface TwitterTweet {
  id: string;
  text: string;
  public_metrics?: TwitterMetrics;
}

interface TwitterResponse {
  data?: TwitterTweet[];
  error?: {
    message: string;
    type: string;
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
      SELECT access_token, provider_account_id 
      FROM social_accounts 
      WHERE user_id = ${userId} AND provider = 'twitter'
    `;
    
    const twitterAccount = result[0];

    if (!twitterAccount?.access_token || !twitterAccount?.provider_account_id) {
      return NextResponse.json({ error: 'No connected Twitter account' }, { status: 400 });
    }

    const accessToken = twitterAccount.access_token;
    const twitterUserId = twitterAccount.provider_account_id;

    // Fetch recent tweets with public metrics
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${twitterUserId}/tweets?max_results=5&tweet.fields=public_metrics,created_at`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!tweetsResponse.ok) {
      const errorData = await tweetsResponse.json();
      console.error('Twitter API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to fetch tweets from Twitter API' 
      }, { status: tweetsResponse.status });
    }

    const tweetsData: TwitterResponse = await tweetsResponse.json();

    if (!tweetsData?.data || tweetsData.data.length === 0) {
      return NextResponse.json({ engagement: [] });
    }

    const engagement = tweetsData.data.map((tweet) => {
      const metrics = tweet.public_metrics || { 
        like_count: 0, 
        retweet_count: 0, 
        reply_count: 0,
        quote_count: 0 
      };
      
      return {
        id: tweet.id,
        text: tweet.text,
        likes: metrics.like_count,
        retweets: metrics.retweet_count,
        replies: metrics.reply_count,
        quotes: metrics.quote_count,
        total_engagement: metrics.like_count + metrics.retweet_count + metrics.reply_count + metrics.quote_count,
      };
    });

    return NextResponse.json({ engagement });
  } catch (error) {
    console.error('Error fetching Twitter engagement:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Twitter engagement' 
    }, { status: 500 });
  }
}