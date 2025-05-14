import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [users, orders, deliveredOrders, deliveredTotal] = await Promise.all([
            prisma.user.count(),
            prisma.order.count(),
            prisma.order.count({
                where: { status: 'delivered' },
            }),
            prisma.order.aggregate({
                where: { status: 'delivered' },
                _sum: { total: true },
            }),
        ]);

        return NextResponse.json({
            users,
            orders,
            productsSold: deliveredOrders,
            revenue: deliveredTotal._sum.total || 0,
        });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
