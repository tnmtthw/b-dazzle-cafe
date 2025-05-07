"use client";

import React from 'react';
import { Heart } from 'lucide-react';

// Sample product data - in a real application, this would come from an API or database
const bestSellerProducts = [
  {
    id: 1,
    name: 'Espresso',
    description: 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla',
    price: 150.00,
    image: '/img/products/coffee.png',
    likes: '1k'
  },
  {
    id: 2,
    name: 'Cappuccino',
    description: 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla',
    price: 150.00,
   image: '/img/products/coffee.png',
    likes: '5k'
  },
  {
    id: 3,
    name: 'Mocha',
    description: 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla',
    price: 150.00,
    image: '/img/products/coffee.png',
    likes: '1k'
  },
  {
    id: 4,
    name: 'Espresso',
    description: 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla',
    price: 150.00,
    image: '/img/products/coffee.png',
    likes: '1k'
  },
  // Second row products
  {
    id: 5,
    name: 'Espresso',
    description: 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla',
    price: 150.00,
    image: '/img/products/coffee.png',
    likes: '1k'
  },
  {
    id: 6,
    name: 'Cappuccino',
    description: 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla',
    price: 150.00,
    image: '/img/products/coffee.png',
    likes: '5k'
  },
  {
    id: 7,
    name: 'Mocha',
    description: 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla',
    price: 150.00,
    image: '/img/products/coffee.png',
    likes: '1k'
  },
  {
    id: 8,
    name: 'Espresso',
    description: 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla',
    price: 150.00,
    image: '/img/products/coffee.png',
    likes: '1k'
  }
];

const BestSeller = () => {
  // First four products for row 1
  const firstRowProducts = bestSellerProducts.slice(0, 4);
  // Next four products for row 2
  const secondRowProducts = bestSellerProducts.slice(4, 8);

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
                    <span className="text-sm">{product.likes}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-200 mb-4">{product.description}</p>

                {/* Price and Add Button */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Php {product.price.toFixed(2)}</span>
                  <button className="w-8 h-8 bg-white text-brown-primary rounded-sm flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span className="text-xl font-bold leading-none">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row of Products */}
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
                    <span className="text-sm">{product.likes}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-200 mb-4">{product.description}</p>

                {/* Price and Add Button */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Php {product.price.toFixed(2)}</span>
                  <button className="w-8 h-8 bg-white text-brown-primary rounded-sm flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span className="text-xl font-bold leading-none">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;