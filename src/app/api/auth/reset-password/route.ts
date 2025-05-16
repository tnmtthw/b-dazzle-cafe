import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resetToken = searchParams.get('resetToken');

    if (!resetToken) {
      return NextResponse.json({ error: 'Reset token is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { resetToken },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 404 });
    }

    const { password } = await request.json();

    const hashedPassword = await hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
      },
    });

    return NextResponse.json({ message: 'Reset password success' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
