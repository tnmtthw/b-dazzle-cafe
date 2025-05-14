import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    const body = await request.json();
    const { status } = body;
  
    await prisma.order.update({
      where: { id },
      data: { status },
    });
  
    return NextResponse.json(200);
  }