import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { connectSocialAccount } from "@/lib/api/social-connect";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  try {
    const { 
      teamId, 
      platformAccountId, 
      accountName, 
      profileUrl, 
      accessToken, 
      refreshToken, 
      expiresAt 
    } = await request.json();
    
    const account = await connectSocialAccount(
      session.user.id,
      teamId,
      "twitter",
      platformAccountId,
      accountName,
      profileUrl,
      accessToken,
      refreshToken,
      expiresAt ? new Date(expiresAt) : null
    );
    
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error connecting Twitter account:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}