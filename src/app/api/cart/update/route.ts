import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const cartItemId = searchParams.get('cartItemId');
    const quantityParam = searchParams.get('quantity');

    if (!userId || !cartItemId || !quantityParam) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const quantity = parseInt(quantityParam);

    if (isNaN(quantity) || quantity < 1) {
      return NextResponse.json({ message: "Quantity must be a positive number" }, { status: 400 });
    }

    // First check if the cart item exists and belongs to the user
    const existingItem = await prisma.cartItem.findFirst({
      where: { 
        id: cartItemId,
        userId: userId
      },
    });

    if (!existingItem) {
      return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    }

    // Update the cart item with the new quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 