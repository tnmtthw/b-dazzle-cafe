"use client";

import React from "react";
import { useProduct } from "@/data/product";
import { Product } from "@/lib/type";
import EspressoSpinner from '@/component/EspressoSpinner';

const ProductCard = () => {
    const { data: products, error, isLoading } = useProduct();

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">
        <EspressoSpinner />
    </div>;
    if (error) return <p className="text-center text-red-500">Error loading products.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products?.map((product: Product) => (
                <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition-shadow"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-52 object-cover rounded"
                    />
                    <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                    <p className="mt-2 font-bold text-black">₱{product.price}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductCard;