import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const usersWithSubscription = await prisma.user.findMany({
      where: { subscriptionId: { not: null } },
      include: { subscription: true },
    });

    const usersWithoutSubscription = await prisma.user.findMany({
      where: { subscriptionId: null },
    });

    return res.status(200).json({ 
      usersWithSubscription, 
      usersWithoutSubscription 
    });

  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
