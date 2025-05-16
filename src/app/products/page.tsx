'use client';

import React, { useState, useEffect } from 'react';
import { Nunito } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { Heart, ShoppingCart, ChevronDown, ChevronUp, X } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import useSWR from 'swr';
import { EspressoSpinner } from '@/components';

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
  status: string;
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
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: session } = useSession();
  
  // Use SWR to fetch products
  const { data: products, error, isLoading } = useSWR<Product[]>(
    '/api/product',
    fetcher
  );

  // Handle category from URL parameter
  useEffect(() => {
    // Check if we have URL parameters for category filtering
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      // Validate that the category exists
      const validCategory = categories.find(c => c.id === categoryParam);
      if (validCategory) {
        setActiveCategory(categoryParam);
      }
    }
  }, []);

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
      const res = await fetch(`/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user?.id,
          productId: productId,
          quantity: 1
        })
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

  // Toggle description expansion
  const toggleDescriptionExpansion = (productId: string) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(productId);
    }
  };

  // Filter products by category
  const filteredProducts = products 
    ? (activeCategory === 'all' 
        ? products.filter(product => product.status !== 'Inactive') // Only show active products when all selected
        : products.filter(product => 
            product.category === categories.find(c => c.id === activeCategory)?.name && 
            product.status !== 'Inactive')) // Filter by category name and only show active products
    : [];

  // Open product detail modal
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  // Close product detail modal
  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div 
        className={`${nunito.className} min-h-screen bg-gray-50 flex items-center justify-center`}
        style={{ paddingTop: `${navbarHeight}px` }}
      >
        <EspressoSpinner size="lg" />
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
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeProductDetail}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-72 overflow-hidden">
              <img 
                src={selectedProduct.image || '/img/products/placeholder.jpg'} 
                alt={selectedProduct.name}
                className="w-full h-full object-cover" 
              />
              <button 
                onClick={closeProductDetail}
                className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center">
                  <span className="bg-brown-primary/90 text-white text-xs px-2 py-1 rounded">
                    {selectedProduct.category}
                  </span>
                  <span className="text-white/90 text-sm ml-2">
                    ₱{selectedProduct.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 mb-6">
                {selectedProduct.description || 'No description available for this product.'}
              </p>
              
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => toggleFavorite(selectedProduct.id)}
                  className="flex items-center text-gray-700 hover:text-brown-primary"
                >
                  <Heart className={`h-5 w-5 mr-1 ${favorites.includes(selectedProduct.id) ? 'fill-brown-primary text-brown-primary' : ''}`} />
                  <span>Add to Favorites</span>
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct.id);
                    closeProductDetail();
                  }}
                  className="bg-brown-primary text-white px-4 py-2 rounded-md hover:bg-brown-primary-hover transition-colors flex items-center"
                >
                  <span>Add to Cart</span>
                  <ShoppingCart className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
            <h2 className="font-semibold text-lg mb-3 text-gray-800">Categories</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
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
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
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
            {activeCategory !== 'all' && (
              <div className="mb-4 pb-2 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeCategory === 'all' 
                    ? 'All Products' 
                    : categories.find(c => c.id === activeCategory)?.name || 'Category'}
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product: Product) => (
                  <div key={product.id} className="bg-white overflow-hidden rounded-lg shadow-sm">
                    <div className="relative">
                      <img
                        src={product.image || '/img/products/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-64 object-cover cursor-pointer"
                        onClick={() => openProductDetail(product)}
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
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-black/20 text-center py-3 cursor-pointer hover:bg-black/30 transition-colors"
                        onClick={() => openProductDetail(product)}
                      >
                        <span className="text-white text-sm font-medium">View Details</span>
                      </div>
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
                      
                      <div 
                        onClick={() => toggleDescriptionExpansion(product.id)}
                        className={`text-white/80 text-sm mb-4 cursor-pointer transition-all duration-300 ease-in-out hover:text-white/90 ${
                          expandedProductId === product.id ? 'pb-1 max-h-96' : 'line-clamp-2 max-h-12'
                        }`}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="relative">
                          {product.description || 'Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla'}
                          {expandedProductId !== product.id && product.description && product.description.length > 100 && (
                            <span className="text-white/90 font-medium ml-1 inline-flex items-center">
                              ...Read more
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </span>
                          )}
                          {expandedProductId === product.id && (
                            <span className="text-white/90 font-medium block mt-2 text-xs text-right">
                              Show less
                              <ChevronUp className="h-3 w-3 ml-1 inline" />
                            </span>
                          )}
                        </div>
                      </div>
                      
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