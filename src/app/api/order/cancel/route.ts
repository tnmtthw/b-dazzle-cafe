import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get request data
    const body = await req.json();
    const { orderId, reason, additionalInfo, userId } = body;

    // Validate required fields
    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }
    
    if (!reason) {
      return new NextResponse("Cancellation reason is required", { status: 400 });
    }

    // Check if the user is authorized to cancel this order
    // This is an additional security check to ensure users can only cancel their own orders
    if (userId && userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Find order in database
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    });

    // Check if order exists
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Check if order belongs to user
    if (order.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Check if order can be cancelled
    // Only pending or processing orders can be cancelled
    if (order.status !== 'pending' && order.status !== 'processing') {
      return new NextResponse("Order cannot be cancelled", { status: 400 });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: 'cancelled'
      }
    });

    // Log the cancellation details in the console
    console.log(`Order ${orderId} cancelled by user ${session.user.id}`);
    console.log(`Cancellation reason: ${reason}`);
    if (additionalInfo) {
      console.log(`Additional details: ${additionalInfo}`);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDER_CANCEL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 