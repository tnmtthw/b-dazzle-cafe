import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("Fetch cart error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
      
    const body = await req.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId || !quantity) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ message: "Added to cart" }, { status: 200 });

  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
