import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
  
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
  
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      return NextResponse.json(orders);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
  }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // Fetch cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Clear the cart
    await prisma.cartItem.deleteMany({ where: { userId } });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
