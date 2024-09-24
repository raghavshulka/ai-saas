import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the Bearer scheme

    // Verifying the token
    const decodedToken = verifyToken(token);

    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Extract user ID from the decoded token
    const userId = decodedToken.id as string; // Cast to string since we're sure it's a valid ID

    const { content } = await req.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Feedback content cannot be empty' }, { status: 400 });
    }

    // Save feedback in the database
    await prisma.feedback.create({
      data: {
        content: content,
        userId: userId, // Attach the user ID from the decoded token
      },
    });

    return NextResponse.json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    return NextResponse.json({ error: 'Error submitting feedback' }, { status: 500 });
  }
}
