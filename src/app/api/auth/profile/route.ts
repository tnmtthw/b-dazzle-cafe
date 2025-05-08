import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    const body = await request.json();
    const { name, address, bio, phone } = body;
  
    await prisma.user.update({
      where: { id },
      data: { name, address, bio, phone  },
    });
  
    return NextResponse.json(200);
  }
  