// app/api/sentiment-analysis/route.ts
import { auth } from '@/auth';
import { Pool } from 'pg';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Type definitions
interface Session {
  user?: {
    id?: string;
  };
}

interface RequestBody {
  platform: string;
  content: string[];
}

interface OpenAIResponse {
  choices: {
    message?: {
      content?: string;
    };
  }[];
}

// Initialize database connection and OpenAI client
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth() as Session | null;
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { platform, content }: RequestBody = await req.json();
    
    if (!platform || !content || !Array.isArray(content) || content.length === 0) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    
    const prompt = `Analyze the sentiment of the following social media content for ${platform}. Return the overall sentiment as 'positive', 'negative', or 'neutral' and provide a brief explanation for each item:\n\n${content.map(item => `- "${item}"`).join('\n')}\n\nSentiment analysis:`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or gpt-4 if you have access
      messages: [{ role: 'user', content: prompt }],
    });
    
    const sentimentResult = completion.choices[0]?.message?.content;
    
    return NextResponse.json({ sentiment: sentimentResult });
    
  } catch (error) {
    console.error('Error during sentiment analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' }, 
      { status: 500 }
    );
  }
}