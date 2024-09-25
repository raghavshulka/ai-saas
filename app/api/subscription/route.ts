import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

interface DecodedToken {
  id: string;
  [key: string]: any; // Adjust based on what your token contains
}

export async function POST(req: NextRequest) {
  // Type for request body
  let body: { token: string; subscriptionId: string };
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { token, subscriptionId } = body;

  if (!token || !subscriptionId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const decoded = verifyToken(token) as DecodedToken | null;

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user already has a subscription
    if (user.subscriptionId) {
      return NextResponse.json({ message: 'User already has a subscription' }, { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionId: subscription.id },
    });

    return NextResponse.json({ message: 'Subscription updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}