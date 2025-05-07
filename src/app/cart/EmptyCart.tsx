import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="rounded-full bg-gray-100 p-6 mb-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Your coffee cart is empty</h2>
            <p className="text-gray-500 text-center max-w-md mb-8">
                It seems like you haven't added any coffee to your cart yet. Explore our selection of premium brews and find your perfect cup.
            </p>
            <Link
                href="/products"
                className="px-6 py-3 bg-yellow-primary text-black rounded-lg font-bold hover:bg-yellow-500 transition-colors"
            >
                Go to Product
            </Link>
        </div>
    )
}
