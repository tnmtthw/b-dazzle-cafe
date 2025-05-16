import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resetToken = searchParams.get('resetToken');

  try {
    if (!resetToken) {
      return NextResponse.json({ message: 'Missing reset token' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { resetToken },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found or token invalid' }, { status: 404 });
    }

    return NextResponse.json(200);
  } catch (error) {
    console.error('Error validating reset token:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}