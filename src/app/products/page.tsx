'use client';

import React, { useState, useEffect } from 'react';
import { Nunito } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import useSWR from 'swr';

// Initialize Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
});

// Define product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sold: number;
  createdAt: string;
}

// Product categories
const categories = [
  { id: 'non-espresso', name: 'Non Espresso' },
  { id: 'espresso', name: 'Espresso' },
  { id: 'classic-hot', name: 'Classic hot' },
  { id: 'rice-meals', name: 'Rice Meals' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'pasta', name: 'Pasta' },
];

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

const ProductsPage = () => {
  const [navbarHeight, setNavbarHeight] = useState(72);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { data: session } = useSession();
  
  // Use SWR to fetch products
  const { data: products, error, isLoading } = useSWR<Product[]>(
    '/api/product',
    fetcher
  );

  // Effect to measure navbar height
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('header');
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };
    
    // Update on initial render
    updateNavbarHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateNavbarHeight);
    
    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
    };
  }, []);

  // Handle adding to cart
  const handleAddToCart = async (productId: string) => {
    if (!session) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      const res = await fetch(`/api/cart/add?userId=${session.user?.id}&productId=${productId}&quantity=1`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  // Toggle favorite
  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // Filter products by category
  const filteredProducts = products 
    ? (activeCategory === 'all' 
        ? products 
        : products.filter(product => product.category === activeCategory))
    : [];

  if (isLoading) {
    return (
      <div 
        className={`${nunito.className} min-h-screen bg-gray-50 flex items-center justify-center`}
        style={{ paddingTop: `${navbarHeight}px` }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`${nunito.className} min-h-screen bg-gray-50 flex items-center justify-center`}
        style={{ paddingTop: `${navbarHeight}px` }}
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load products</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-brown-primary text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${nunito.className} bg-gray-50 min-h-screen`}
      style={{ paddingTop: `${navbarHeight}px` }}
    >
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            <span className="text-brown-primary">Our</span> Menu
          </h1>
          <div className="h-px bg-gray-300 max-w-3xl mx-auto mt-4"></div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Category Sidebar */}
          <div className="md:w-1/4 mb-6 md:mb-0 md:pr-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-md ${
                    activeCategory === 'all'
                      ? 'bg-brown-primary text-white font-medium'
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  All Items
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-md ${
                      activeCategory === category.id
                        ? 'bg-brown-primary text-white font-medium'
                        : 'text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Product Grid */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product: Product) => (
                  <div key={product.id} className="bg-white overflow-hidden rounded-lg shadow-sm">
                    <div className="relative">
                      <img
                        src={product.image || '/img/products/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.includes(product.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="p-5" style={{ backgroundColor: '#8B6E4E' }}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="text-white/80 hover:text-white"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.includes(product.id) ? 'fill-white' : ''
                            }`}
                          />
                          <span className="text-xs block mt-1">Favorites</span>
                        </button>
                      </div>
                      
                      <p className="text-white/80 text-sm mb-4 line-clamp-2">
                        {product.description || 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla'}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">₱{product.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="bg-white text-brown-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                        >
                          <span>Add to Cart</span>
                          <ShoppingCart className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-10">
                  <p className="text-gray-500">No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;