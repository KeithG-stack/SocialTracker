import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Extend NextAuth types to include 'id' on user and session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const sql = neon(process.env.DATABASE_URL!);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `;

          if (users.length === 0) {
            return null;
          }

          const user = users[0];
          
          if (!user.password) {
            throw new Error("Please sign in with Google for this account");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUsers = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `;

          if (existingUsers.length === 0) {
            const newUsers = await sql`
              INSERT INTO users (name, email, email_verified, provider)
              VALUES (${user.name}, ${user.email}, ${new Date()}, 'google')
              RETURNING id, name, email
            `;
            
            const newUser = newUsers[0];
            user.id = newUser.id.toString();
          } else {
            user.id = existingUsers[0].id.toString();
          }
          
          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      
      if (token.id) {
        if (session.user) {
          session.user.id = token.id as string;
        }
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };