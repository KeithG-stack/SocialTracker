import { NextResponse } from 'next/server';
import { getUserSocialAccounts } from '@/lib/data/account';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  try {
    const accounts = await getUserSocialAccounts(userId);
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
