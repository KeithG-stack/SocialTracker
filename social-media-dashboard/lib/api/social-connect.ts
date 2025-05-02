import { db } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function connectSocialAccount(
  userId: string,
  teamId: string | null,
  platform: "twitter" | "instagram" | "facebook" | "linkedin",
  platformAccountId: string,
  accountName: string,
  profileUrl: string | null,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: Date | null
) {
  try {
    const newAccount = await db.insert(socialAccounts).values({
      id: uuidv4(),
      userId,
      teamId,
      platform,
      platformAccountId,
      accountName,
      profileUrl,
      accessToken,
      refreshToken,
      tokenExpiresAt: expiresAt,
    }).returning();
    
    return newAccount[0];
  } catch (error) {
    console.error("Error connecting social account:", error);
    throw error;
  }
}

export async function refreshSocialToken(
  accountId: string,
  platform: string,
  newAccessToken: string, 
  newRefreshToken: string | null,
  newExpiresAt: Date | null
) {
  try {
    const updated = await db.update(socialAccounts)
      .set({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenExpiresAt: newExpiresAt
      })
      .where(eq(socialAccounts.id, accountId))
      .returning();
      
    return updated[0];
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}