import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth, update } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/sign-in`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
      
        if (!res.ok) return null;
      
        const user = await res.json();
      
        if (user.role === "Unverified") {
          throw new Error("Unverified");
        }
        
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: credentials.email,
            role: user.role,
            address: user.address,
            bio: user.bio,
            phone: user.phone
          };
        }
      
        return null;
      }      
    }),
  ],
  pages: {
    signIn: "/account/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.address = user.address;
        token.bio = user.bio;
        token.phone = user.phone;
      }
      
      // Update token if session was updated
      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.address = session.user.address;
        token.bio = session.user.bio;
        token.phone = session.user.phone;
      }
      
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.address = token.address;
      session.user.bio = token.bio;
      session.user.phone = token.phone;
      return session;
    },
  },
});