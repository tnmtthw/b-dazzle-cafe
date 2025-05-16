"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import useSWR from 'swr';

import { Product } from "@/lib/type"
import { EspressoSpinner } from '@/components';

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

const BestSeller = () => {
  // Use SWR to fetch best seller products
  const { data: products, error, isLoading } = useSWR<Product[]>(
    '/api/product/best-seller',
    fetcher
  );

  if (isLoading) {
    return (
      <section className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <EspressoSpinner />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <EspressoSpinner />
        </div>
      </section>
    );
  }

  // Ensure products array exists and has items
  const bestSellerProducts = products || [];

  // Split products into two rows (or return all in first row if fewer than 4)
  const firstRowProducts = bestSellerProducts.slice(0, 4);
  const secondRowProducts = bestSellerProducts.length > 4
    ? bestSellerProducts.slice(4, 8)
    : [];

  return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 flex items-center">
          <h2 className="text-4xl font-playfair font-bold inline-flex items-center">
            <span>Best</span>
            <span className="bg-brown-primary text-white px-6 py-2 rounded-tr-[30px] rounded-bl-[30px] rounded-br-full ml-2">Seller</span>
          </h2>
          <div className="flex-grow border-t border-gray-300 ml-8"></div>
        </div>

        {/* First Row of Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {firstRowProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="h-48 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 bg-brown-primary text-white">
                {/* Name and Like */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-medium">{product.name}</h3>
                  <div className="flex items-center">
                    <Heart size={16} fill="white" className="mr-1" />
                    <span className="text-sm">{product.sales}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                  {product.description || 'Delicious coffee, carefully crafted for your enjoyment.'}
                </p>

                {/* Price and Add Button */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">₱{product.price.toFixed(2)}</span>
                  {/* <button className="w-8 h-8 bg-white text-brown-primary rounded-sm flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span className="text-xl font-bold leading-none">+</span>
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row of Products (only show if there are more than 4 products) */}
        {secondRowProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondRowProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="h-48 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 bg-brown-primary text-white">
                  {/* Name and Like */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-medium">{product.name}</h3>
                    <div className="flex items-center">
                      <Heart size={16} fill="white" className="mr-1" />
                      <span className="text-sm">{product.sales}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                    {product.description || 'Delicious coffee, carefully crafted for your enjoyment.'}
                  </p>

                  {/* Price and Add Button */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">₱{product.price.toFixed(2)}</span>
                    {/* <button className="w-8 h-8 bg-white text-brown-primary rounded-sm flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <span className="text-xl font-bold leading-none">+</span>
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;