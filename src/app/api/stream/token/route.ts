/**
 * Stream Chat token generation endpoint
 * Generates authentication tokens for Stream Chat users
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { streamChat } from '@/lib/stream-chat';

export async function POST(req: NextRequest) {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = await req.json();

    // Verify the requested userId matches the authenticated user
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: User ID mismatch' },
        { status: 403 }
      );
    }

    // Generate Stream Chat token for the user
    const token = streamChat.createToken(userId);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Failed to generate Stream Chat token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
