import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  interface QueryResult {
    rows: Array<{
      id: number;
      email: string;
      name: string;
    }>;
  }
  return NextResponse.json({ message: 'User registered!' });
}