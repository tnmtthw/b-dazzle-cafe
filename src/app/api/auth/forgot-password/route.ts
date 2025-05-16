// src\app\api\auth\forgot-password\route.ts

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

import { prisma } from '@/lib/prisma';
import { ResetPasswordEmail } from '@/emails/reset-password-email';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const emailHtml = await render(
      ResetPasswordEmail({
        email,
        resetToken
      })
    );

    // Update user with reset token
    await prisma.user.update({
      where: { email },
      data: { resetToken },
    });

    // Ensure required env vars exist
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASSWORD;

    if (!gmailUser || !gmailPass) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: gmailUser,
      to: email,
      subject: 'Reset your B-Dazzle Cafe password',
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Reset password email sent:', info.messageId);

    return NextResponse.json({ message: 'Reset token sent to email' }, { status: 200 });
  } catch (error) {
    console.error('Error in forgot-password PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
