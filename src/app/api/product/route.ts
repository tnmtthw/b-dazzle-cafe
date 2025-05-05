import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        if (id) {
            const product = await prisma.product.findUnique({
                where: { id },
                select: {
                    id: true,
                    image: true,
                    name: true,
                    description: true,
                    price: true,
                    sold: true,
                    createdAt: true,
                },
            });

            if (!product) {
                return NextResponse.json({ message: 'Product not found' }, { status: 404 });
            }

            return NextResponse.json(product);
        }

        const products = await prisma.product.findMany({
            orderBy: {
                id: 'asc',
            },
            select: {
                id: true,
                image: true,
                name: true,
                description: true,
                price: true,
                sold: true,
                createdAt: true,
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
