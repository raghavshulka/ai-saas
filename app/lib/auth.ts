import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH_CONFIG = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  // Ensure the secret is placed at the top level
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // JWT Callback to add user information to token
    jwt: async ({ user, token }: { user?: any; token: any }) => {
      if (user) {
        token.uid = user.id;  // Add user ID to token
      }
      return token;
    },
    
    // Session callback to expose token data in the session
    session: ({ session, token }: { session: any; token: any }) => {
      if (session.user) {
        session.user.id = token.uid;  // Add token uid to session user
      }
      return session;
    },
  },
};

export default NEXT_AUTH_CONFIG;
