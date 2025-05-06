// /app/api/cart/add/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');
    const quantity = parseInt(searchParams.get('quantity') || '0');

    if (!userId || !productId || isNaN(quantity) || quantity <= 0) {
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
