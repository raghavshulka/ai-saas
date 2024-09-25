import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

interface DecodedToken {
  id: string;
  [key: string]: any; // Adjust based on what your token contains
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }

  // Type for request body
  let body: { token: string; subscriptionId: string };
  try {
    body = await req.json();
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Invalid JSON' }), { status: 400 });
  }

  const { token, subscriptionId } = body;

  if (!token || !subscriptionId) {
    return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  try {
    const decoded = verifyToken(token) as DecodedToken | null;

    if (!decoded) {
      return new NextResponse(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Check if user already has a subscription
    if (user.subscriptionId) {
      return new NextResponse(JSON.stringify({ message: 'User already has a subscription' }), { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return new NextResponse(JSON.stringify({ message: 'Subscription not found' }), { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionId: subscription.id },
    });

    return new NextResponse(JSON.stringify({ message: 'Subscription updated' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
