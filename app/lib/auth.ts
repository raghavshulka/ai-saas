import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;  // Add the id field here
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Optionally add the role field
    };
  }
}

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

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
};

// Update isAdmin to use the defined SessionType
export const isAdmin = async () => {
  const response = await fetch('/api/check-admin');
  const data = await response.json();
  
  return data.isAdmin;
};


export const NEXT_AUTH_CONFIG: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || '' },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email || '',
            role: 'USER',
            credits: 10,
          },
        });
      }
      return true;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || '' },
        });
        token.uid = existingUser?.id || token.uid;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.uid as string;
      return session;
    },
  },
};

export default NEXT_AUTH_CONFIG;
