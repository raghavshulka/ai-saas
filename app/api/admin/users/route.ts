import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const usersWithSubscription = await prisma.user.findMany({
      where: { subscriptionId: { not: null } },
      include: { subscription: true },
    });

    const usersWithoutSubscription = await prisma.user.findMany({
      where: { subscriptionId: null },
    });

    console.log('Users with subscription:', usersWithSubscription);
    console.log('Users without subscription:', usersWithoutSubscription);

    return NextResponse.json({ 
      usersWithSubscription, 
      usersWithoutSubscription 
    });

  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}