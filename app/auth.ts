// auth.ts (create this file in your project root)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

const authConfig = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Credentials Provider
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
    async signIn({ user, account, profile }: { user: any, account: any, profile?: any }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUsers = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `;

          if (existingUsers.length === 0) {
            // Create new user for Google OAuth
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

    async jwt({ token, user, account }: { token: any, user?: any, account?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }: { session: any, token: any }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt" as const,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Export handlers for the route
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Export the auth function for use in components/middleware
export { auth as getServerSession };