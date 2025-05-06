import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const cartItemId = searchParams.get('cartItemId');

    if (!userId || !cartItemId) {
      return NextResponse.json({ message: "Missing userId or cartItemId" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.userId !== userId) {
      return NextResponse.json({ message: "Cart item not found or mismatch" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ message: "Removed from cart" }, { status: 200 });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
