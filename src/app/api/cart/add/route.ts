// /app/api/cart/add/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Get parameters either from query string or request body
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get('userId');
    let productId = searchParams.get('productId');
    let quantity = parseInt(searchParams.get('quantity') || '0');

    // Check if we need to parse the request body
    if (!userId || !productId || isNaN(quantity) || quantity <= 0) {
      try {
        const body = await req.json();
        userId = body.userId || userId;
        productId = body.productId || productId;
        quantity = body.quantity || quantity;
      } catch (e) {
        // If req.json() fails, continue with query params
      }
    }

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
