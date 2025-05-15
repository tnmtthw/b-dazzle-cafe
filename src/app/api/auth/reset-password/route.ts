import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Find the password reset record
    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token: token,
        expiresAt: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      }
    });

    // Delete all reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 