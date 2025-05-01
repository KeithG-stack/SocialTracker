import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const accounts = await prisma.socialAccount.findMany();
  return NextResponse.json(accounts);
}

export async function POST(request) {
  const { platform, accountId, accessToken } = await request.json();
  const account = await prisma.socialAccount.create({
    data: {
      platform,
      accountId,
      accessToken
    }
  });
  return NextResponse.json(account);
}