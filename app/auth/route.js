// app/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import InstagramProvider from 'next-auth/providers/instagram';
import FacebookProvider from 'next-auth/providers/facebook';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { createUser, findUserByEmail, linkSocialAccount } from '@/lib/data/accounts'; // Import your database functions

export const authOptions = {
  providers: [
    // ... your provider configurations ...
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // Create or find user in your database based on email
        let userId = await findUserByEmail(profile.email);
        if (!userId) {
          userId = await createUser({ email: profile.email, name: profile.name });
        }
        token.sub = userId; // Set the user ID in the JWT

        // Link the social media account
        await linkSocialAccount({
          userId: userId,
          provider: account.provider,
          providerAccountId: profile.id?.toString() || profile.sub?.toString(), // Handle different ID formats
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        });

        token.socialTokens = token.socialTokens || {};
        token.socialTokens[account.provider] = {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expires: account.expires_at,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      session.user.socialTokens = token.socialTokens || {};
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };