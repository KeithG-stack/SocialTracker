// app/api/sentiment-analysis/route.js
import { auth } from '@/auth';
import { Pool } from 'pg';
import OpenAI from 'openai';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { platform, content } = await req.json();

    if (!platform || !content || !Array.isArray(content) || content.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), { status: 400 });
    }

    const prompt = `Analyze the sentiment of the following social media content for <span class="math-inline">\{platform\}\. Return the overall sentiment as 'positive', 'negative', or 'neutral' and provide a brief explanation for each item\:\\n\\n</span>{content.map(item => `- "${item}"`).join('\n')}\n\nSentiment analysis:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or gpt-4 if you have access
      messages: [{ role: 'user', content: prompt }],
    });

    const sentimentResult = completion.choices[0]?.message?.content;

    return new Response(JSON.stringify({ sentiment: sentimentResult }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error during sentiment analysis:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze sentiment' }), { status: 500 });
  }
}