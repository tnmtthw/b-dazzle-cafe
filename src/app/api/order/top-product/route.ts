import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Fetch all delivered, shipped, or completed orders
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ["delivered", "shipped", "completed"], // exclude pending/cancelled
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Aggregate product sales
    const productStats: Record<
      string,
      { name: string; sold: number; revenue: number }
    > = {};

    for (const order of orders) {
      for (const item of order.items) {
        const productName = item.product.name;
        const soldQty = item.quantity;
        const revenue = item.quantity * item.price;

        if (!productStats[productName]) {
          productStats[productName] = {
            name: productName,
            sold: 0,
            revenue: 0,
          };
        }

        productStats[productName].sold += soldQty;
        productStats[productName].revenue += revenue;
      }
    }

    // Convert to array & sort by most sold
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.sold - a.sold)
      .map((p) => ({
        name: p.name,
        sold: p.sold,
        revenue: `₱${p.revenue.toLocaleString()}`,
      }));

    return NextResponse.json(topProducts);
  } catch (error) {
    console.error("Failed to fetch top products:", error);
    return NextResponse.json(
      { error: "Failed to fetch top products" },
      { status: 500 }
    );
  }
}
