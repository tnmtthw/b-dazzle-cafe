import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { render } from '@react-email/render';

import { prisma } from '@/lib/prisma';
import { SignupConfirmationEmail } from "@/emails/signup-confirmation-email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password and create user
    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Send verification email using fetch API to avoid spam filters
    const emailHtml = await render(
      SignupConfirmationEmail({ name: name, email })
    );

    try {
      // Send email using your server's API endpoint or a service like SendGrid
      // You can use either your own configured mail server or a third-party service
      // This example uses a simple fetch to an external API that you would need to set up
      const emailResult = await fetch(process.env.EMAIL_API_ENDPOINT || 'https://api.youremailservice.com/send', {
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
          subject: 'Please verify your account',
          html: emailHtml,
        })
      });

      if (!emailResult.ok) {
        console.error('Failed to send email:', await emailResult.text());
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Still create the user but log the email error
    }

    return NextResponse.json({ message: 'User created, verification email sent', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || undefined;

  await prisma.user.update({
    where: { email },
    data: { role: "User" },
  });

  return NextResponse.json(200);
}
