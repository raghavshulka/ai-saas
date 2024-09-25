// app/api/admin/feedbacks/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; // Prisma client

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: true, // Include the user details (e.g., email)
      },
    });

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ error: 'Error fetching feedbacks' }, { status: 500 });
  }
}