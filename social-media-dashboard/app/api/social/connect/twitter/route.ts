import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { connectSocialAccount } from "@/lib/api/social-connect";

// In app/api/social/connect/twitter/route.ts
export async function POST(request: Request) {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      
      const requestData = await request.json().catch(error => {
        throw new Error("Invalid JSON payload");
      });
      
      const { 
        teamId, 
        platformAccountId, 
        accountName, 
        profileUrl, 
        accessToken, 
        refreshToken, 
        expiresAt 
      } = requestData;
      
      // Validate required fields
      if (!platformAccountId || !accountName || !accessToken) {
        return new NextResponse("Missing required fields", { status: 400 });
      }
      
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
    } catch (error: any) {
      console.error("Error connecting Twitter account:", error);
      return new NextResponse(error.message || "Internal Error", { 
        status: error.status || 500 
      });
    }
  }