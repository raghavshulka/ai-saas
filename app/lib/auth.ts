import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { getSession } from 'next-auth/react';

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

export const isAdmin = async (session: any) => {
  if (!session || !session.user) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return user?.role === 'ADMIN';
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
    jwt: async ({ user, token }) => {
      if (user) {
        return {
          ...token,
          uid: user.id,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.uid,
          },
        };
      }
      return session;
    },
  },
};

export default NEXT_AUTH_CONFIG;