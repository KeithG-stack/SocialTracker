import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "your-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "your-client-secret",
    }),
    // Add more providers here
  ],
  // Add more NextAuth options here as needed
});

export { handler as GET, handler as POST };