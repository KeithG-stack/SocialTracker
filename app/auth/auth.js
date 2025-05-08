// app/auth.js
import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import InstagramProvider from 'next-auth/providers/instagram';
import FacebookProvider from 'next-auth/providers/facebook';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const createUser = async ({ email, name }) => {
  const result = await pool.query(
    'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id',
    [email, name]
  );
  return result.rows[0].id;
};

export const findUserByEmail = async (email) => {
  if (!email) return null;
  const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  return result.rows[0]?.id;
};

export const linkSocialAccount = async ({
  userId,
  provider,
  providerAccountId,
  accessToken,
  refreshToken,
  expiresAt,
}) => {
  // Check if account already exists
  const existingAccount = await pool.query(
    'SELECT id FROM social_accounts WHERE provider = $1 AND provider_account_id = $2',
    [provider, providerAccountId]
  );

  if (existingAccount.rows.length > 0) {
    // Update existing account
    await pool.query(
      'UPDATE social_accounts SET access_token = $1, refresh_token = $2, expires_at = $3 WHERE provider = $4 AND provider_account_id = $5',
      [accessToken, refreshToken, expiresAt, provider, providerAccountId]
    );
  } else {
    // Create new account
    await pool.query(
      'INSERT INTO social_accounts (user_id, provider, provider_account_id, access_token, refresh_token, expires_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, provider, providerAccountId, accessToken, refreshToken, expiresAt]
    );
  }
};

export const getUserSocialAccounts = async (userId) => {
  const result = await pool.query(
    'SELECT provider, provider_account_id FROM social_accounts WHERE user_id = $1',
    [userId]
  );
  return result.rows;
};

export const auth = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0", // Use OAuth 2.0
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
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
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});