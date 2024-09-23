import GoogleProvider from "next-auth/providers/google";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: any) => {
  return jwt.verify(token, JWT_SECRET);
};

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
