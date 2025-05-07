'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Home, ShoppingBag, ChevronRight, Clock, MapPin, CreditCard } from 'lucide-react';
import { Nunito } from 'next/font/google';

// Initialize Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
});

const ConfirmationPage = () => {
    const router = useRouter();
    const [navbarHeight, setNavbarHeight] = useState(72); // Default value

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
    
    return (
        <div 
            className={`${nunito.className} min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center`}
            style={{ paddingTop: `${navbarHeight + 24}px` }}
        >
            <div className="w-full max-w-5xl">
                {/* Main Confirmation Card - Landscape Layout */}
                <div className="bg-white shadow-lg rounded-3xl overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Section with Accent Color */}
                    <div className="bg-brown-primary p-8 text-center lg:w-1/3 lg:flex lg:flex-col lg:justify-center">
                        <div className="relative">
                            {/* Animated Pulse Ring */}
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75" style={{ animationDuration: '2s' }}></div>
                            
                            {/* Checkmark Circle */}
                            <div className="relative bg-white/20 rounded-full p-5 mx-auto w-24 h-24 flex items-center justify-center">
                                <CheckCircle className="text-white" size={50} />
                            </div>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-white mt-6 mb-2">
                            Yay! Your order has been placed
                        </h1>
                        <p className="text-white/80 text-lg">
                            Your order will be delivered in 30 minutes
                        </p>
                        
                        {/* Order number visible on mobile and desktop */}
                        <div className="mt-6 bg-white/10 rounded-xl p-4 lg:mt-8">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white/90 font-medium">Order Number</p>
                                <p className="font-bold text-white">#BD-2584</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-white/90 font-medium">Estimated Delivery</p>
                                <p className="font-bold text-white">30 minutes</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Section with Order Information */}
                    <div className="p-6 md:p-8 lg:w-2/3">
                        <div className="flex flex-col h-full">
                            {/* Order Details */}
                            <div className="flex-grow">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                
                                {/* Order information cards - horizontal layout */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                                        <Clock className="text-brown-primary h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Order Time</p>
                                            <p className="text-sm text-gray-600">May 8, 2025 • 14:30</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                                        <MapPin className="text-brown-primary h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Delivery Address</p>
                                            <p className="text-sm text-gray-600">123 Coffee St., Manila</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                                        <CreditCard className="text-brown-primary h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Payment Method</p>
                                            <p className="text-sm text-gray-600">Cash on Delivery</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Tracking Information - Horizontal steps for landscape */}
                                <div className="rounded-xl border border-gray-200 p-5 mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-6">Track Your Order</h3>
                                    
                                    <div className="relative">
                                        {/* Horizontal progress line */}
                                        <div className="hidden md:block absolute top-4 left-8 right-8 h-0.5 bg-gray-200"></div>
                                        <div className="hidden md:block absolute top-4 left-8 w-8 h-0.5 bg-brown-primary"></div>
                                        
                                        {/* Vertical progress line for mobile */}
                                        <div className="md:hidden absolute top-4 left-4 bottom-4 w-0.5 bg-gray-200"></div>
                                        <div className="md:hidden absolute top-4 left-4 h-4 w-0.5 bg-brown-primary"></div>
                                        
                                        {/* Steps - horizontal on desktop */}
                                        <div className="md:flex md:justify-between md:items-start">
                                            {/* Step 1 - Horizontal layout on desktop */}
                                            <div className="relative ml-10 mb-6 md:ml-0 md:mb-0 md:flex-1 md:text-center">
                                                <div className="md:hidden absolute -left-10 mt-1 w-8 h-8 rounded-full border-2 border-brown-primary bg-brown-primary flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">1</span>
                                                </div>
                                                <div className="hidden md:flex md:justify-center">
                                                    <div className="w-8 h-8 rounded-full border-2 border-brown-primary bg-brown-primary flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">1</span>
                                                    </div>
                                                </div>
                                                <p className="font-medium md:mt-2">Order Confirmed</p>
                                                <p className="text-sm text-gray-500">Your order has been received</p>
                                            </div>
                                            
                                            {/* Step 2 - Horizontal layout on desktop */}
                                            <div className="relative ml-10 mb-6 md:ml-0 md:mb-0 md:flex-1 md:text-center">
                                                <div className="md:hidden absolute -left-10 mt-1 w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs font-bold">2</span>
                                                </div>
                                                <div className="hidden md:flex md:justify-center">
                                                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                                                        <span className="text-gray-500 text-xs font-bold">2</span>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-gray-500 md:mt-2">Preparing</p>
                                                <p className="text-sm text-gray-500">Your coffee is being crafted</p>
                                            </div>
                                            
                                            {/* Step 3 - Horizontal layout on desktop */}
                                            <div className="relative ml-10 md:ml-0 md:flex-1 md:text-center">
                                                <div className="md:hidden absolute -left-10 mt-1 w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs font-bold">3</span>
                                                </div>
                                                <div className="hidden md:flex md:justify-center">
                                                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                                                        <span className="text-gray-500 text-xs font-bold">3</span>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-gray-500 md:mt-2">On the way</p>
                                                <p className="text-sm text-gray-500">Your order is on the way to you</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons - Horizontal on desktop */}
                            <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                                <Link href="/products" className="bg-brown-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-brown-primary-hover transition-colors duration-200 text-center flex-1">
                                    Order More Coffee
                                </Link>
                                <Link href="/" className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center flex-1">
                                    <Home className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Link>
                                <Link href="/profile/orders" className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center flex-1">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    View Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer Text */}
                <div className="text-center mt-6 text-gray-500 text-sm">
                    <p>Thank you for choosing B'Dazzle Cafe!</p>
                    <p className="mt-1">A confirmation email has been sent to your registered email address.</p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;