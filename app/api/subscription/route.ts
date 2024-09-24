import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token, subscriptionId } = req.body;

  if (!token || !subscriptionId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has a subscription
    if (user.subscriptionId) {
      return res.status(400).json({ message: 'User already has a subscription' });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionId: subscription.id },
    });

    return res.status(200).json({ message: 'Subscription updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}