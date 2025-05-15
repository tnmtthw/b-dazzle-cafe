import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

// Send password reset email using an email service API
async function sendPasswordResetEmail(name: string, email: string, resetUrl: string) {
  try {
    // Prepare email content with proper formatting and structure to reduce spam likelihood
    const htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B5A2B;">Hello ${name},</h2>
      <p>You requested to reset your password for your B'Dazzle Cafe account.</p>
      <p>Please click the button below to reset your password:</p>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="background-color: #F5C518; color: #8B5A2B; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
      </p>
      <p><small>This link will expire in 30 minutes.</small></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you,<br>B'Dazzle Cafe Team</p>
    </div>`;

    // Use a more reliable email sending approach
    // Option 1: Email service API (recommended)
    const response = await fetch(process.env.EMAIL_API_ENDPOINT || 'https://api.youremailservice.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        to: email,
        from: {
          email: process.env.EMAIL_FROM || 'no-reply@bdazzlecafe.com',
          name: 'B-Dazzle Cafe'
        },
        subject: "Reset Your Password - B'Dazzle Cafe",
        text: `Hello ${name},\n\nYou requested to reset your password. Please click the link below to reset it:\n\n${resetUrl}\n\nThis link will expire in 30 minutes.\n\nIf you did not request this, please ignore this email.\n\nThank you,\nB'Dazzle Cafe Team`,
        html: htmlContent
      })
    });

    if (!response.ok) {
      console.error('Password reset email sending failed:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // If no user is found, we still return a 200 response for security reasons
    // This prevents attackers from determining which emails exist in our system
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If your email exists in our system, you will receive a password reset link.' 
      });
    }

    // Generate a reset token (32 random bytes as hex string - 64 chars)
    const token = randomBytes(32).toString('hex');
    
    // Set token expiration (30 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Save the reset token in the database
    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: {
        token,
        expiresAt
      },
      create: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // Generate the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Send password reset email
    await sendPasswordResetEmail(user.name, email, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 