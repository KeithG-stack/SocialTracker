'use server';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { neon } from '@neondatabase/serverless';
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const sql = neon(databaseUrl);

interface User {
  id: string;
  email: string;
  name: string;
}

interface QueryResult {
  rows: Array<{ id: number; email: string; name: string }>;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          const result = await sql`
            SELECT id, email, name
            FROM users
            WHERE email = ${credentials.email}
          `;

          // Type assertion for the query result
          const queryResult = result as unknown as QueryResult;
          const user = queryResult.rows[0];

          if (!user) {
            return null;
          }

          // In a real application, you would verify the password here
          // For now, we'll just check if the password matches
          if (credentials.password !== 'password') {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
    // Add other providers here...
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
