import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import nodemailer from 'nodemailer';
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

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const emailHtml = await render(
      SignupConfirmationEmail({ name: name, email })
    );

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Please verify your account',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

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