import { NextResponse } from 'next/server';
import { OpenAIStream } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

export async function POST(request) {
  const { accountId, contentHistory } = await request.json();
  
  const performanceData = await prisma.analytics.findMany({
    where: { accountId }
  });
  
  const prompt = generateRecommendationPrompt(contentHistory, performanceData);
  
  const stream = await OpenAIStream({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    stream: true,
  });
  
  return new Response(stream);
}