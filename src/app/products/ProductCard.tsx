"use client";

import React from "react";
import { useSession } from 'next-auth/react';
import { toast } from "react-hot-toast";

import { useProduct } from "@/data/product";
import { Product } from "@/lib/type";
import EspressoSpinner from '@/component/EspressoSpinner';

const ProductCard = () => {
    const { data: products, error, isLoading } = useProduct();
    const { data: session } = useSession();

    const userId = session?.user?.id;

    const handleAddToCart = async (productId: string) => {
        const payload = {
            userId: userId,
            productId,
            quantity: 1,
        };

        console.log(payload);

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session?.user?.id, productId, quantity: 1 }),
            });

            if (!res.ok) throw new Error("Failed to add to cart");
            toast.success("Added to cart!");
        } catch (err) {
            toast.error("Something went wrong.");
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">
        <EspressoSpinner />
    </div>;
    if (error) return <p className="text-center text-red-500">Error loading products.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products?.map((product: Product) => (
                <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition-shadow"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-52 object-cover rounded"
                    />
                    <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                    <div className="flex justify-between">
                        <p className="mt-2 font-bold text-black">₱{product.price}</p>
                        {session ? (
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                className="bg-brown-primary hover:bg-brown-primary-hover p-2 rounded-lg text-white">
                                Add to cart
                            </button>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductCard;