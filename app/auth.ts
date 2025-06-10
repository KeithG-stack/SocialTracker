// auth.ts (create this file in your project root)
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

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
            SELECT id, email, name, password
            FROM users
            WHERE email = ${credentials.email}
          `;

          const user = result[0];

          if (!user) {
            return null;
          }

          // Verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
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
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: { token: any; user?: any; account?: any; profile?: any; isNewUser?: boolean }) {
      if (user && user.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);