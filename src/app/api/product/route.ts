import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const { image, name, category, description, price, sales, stock, status } = await request.json();
  
    const faq = await prisma.product.create({
      data: { image, name, category, description, price, sales, stock, status },
    });
  
    return NextResponse.json(faq);
}
  
export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    const body = await request.json();
    const { image, name, category, description, price, sales, stock, status } = body;
  
    await prisma.product.update({
      where: { id },
      data: { image, name, category, description, price, sales, stock, status },
    });
  
    return NextResponse.json(200);
  }
  
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    try {
        if (id) {
            const product = await prisma.product.findUnique({
                where: { id },
                select: {
                    id: true,
                    image: true,
                    name: true,
                    category: true,
                    description: true,
                    price: true,
                    sales: true,
                    stock: true,
                    status: true,
                    createdAt: true,
                },
            });

            if (!product) {
                return NextResponse.json({ message: 'Product not found' }, { status: 404 });
            }

            return NextResponse.json(product);
        }

        // Build the where clause for filtering
        const whereClause: any = {};
        
        // Add category filter if provided
        if (category) {
            whereClause.category = category;
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: {
                id: 'asc',
            },
            select: {
                id: true,
                image: true,
                name: true,
                category: true,
                description: true,
                price: true,
                sales: true,
                stock: true,
                status: true,
                createdAt: true,
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
  
    if (id) {
        await prisma.product.delete({
                where: { id },
        });

        return NextResponse.json(200);
    }
}