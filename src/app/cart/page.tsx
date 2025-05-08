'use client'

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ArrowRight,
  ArrowLeft,
  Coffee,
  Loader2,
  X,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Nunito } from 'next/font/google';

import { Cart } from "@/lib/type";
import EspressoSpinner from '@/component/EspressoSpinner';
import Link from 'next/link';

// Initialize Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
});

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    return res.json();
};

const CartPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { data, error, isLoading, mutate } = useSWR(
        session?.user?.id ? `/api/cart?userId=${session.user.id}` : null, 
        fetcher
    );
    const [navbarHeight, setNavbarHeight] = useState(72); // Default value
    const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);
    
    // Modal states
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);
    const [removedItemName, setRemovedItemName] = useState('');

    // Auto-close success modal after 2 seconds
    useEffect(() => {
        if (isSuccessModalOpen) {
            const timer = setTimeout(() => {
                setIsSuccessModalOpen(false);
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [isSuccessModalOpen]);

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

    if (status === "loading" || isLoading) return (
        <div 
            className={`${nunito.className} flex items-center justify-center min-h-screen bg-gray-50`}
            style={{ paddingTop: `${navbarHeight + 24}px` }}
        >
            <EspressoSpinner />
        </div>
    );

    if (!session) {
        return (
            <div 
                className={`${nunito.className} flex items-center justify-center min-h-screen bg-gray-50 px-4`}
                style={{ paddingTop: `${navbarHeight + 24}px` }}
            >
                <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
                    <div className="bg-yellow-50 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
                        <ShoppingBag className="text-brown-primary h-10 w-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is lonely</h1>
                    <p className="text-gray-600 mb-6">Please sign in to view your cart</p>
                    <Link 
                        href="/account/sign-in" 
                        className="bg-brown-primary text-white py-3 px-6 rounded-xl font-medium inline-block hover:bg-brown-primary-hover transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className={`${nunito.className} flex items-center justify-center min-h-screen bg-gray-50 px-4`}
                style={{ paddingTop: `${navbarHeight + 24}px` }}
            >
                <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                    <p className="text-gray-600 mb-6">We couldn't load your cart. Please try again.</p>
                    <button 
                        onClick={() => mutate()}
                        className="bg-brown-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-brown-primary-hover transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div 
                className={`${nunito.className} flex items-center justify-center min-h-screen bg-gray-50 px-4`}
                style={{ paddingTop: `${navbarHeight + 24}px` }}
            >
                <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
                    <div className="bg-yellow-50 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
                        <ShoppingBag className="text-brown-primary h-10 w-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <Link 
                        href="/products" 
                        className="bg-brown-primary text-white py-3 px-6 rounded-xl font-medium inline-block hover:bg-brown-primary-hover transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }
    
    // Open confirmation modal
    const openRemoveConfirmation = (id: string, name: string) => {
        setItemToRemove({ id, name });
        setIsRemoveModalOpen(true);
    };
    
    // Handle removing from cart
    const handleRemoveFromCart = async (cartItemId: string) => {
        setIsRemoveModalOpen(false);
        
        try {
            const response = await fetch(`/api/cart/remove?userId=${session?.user?.id}&cartItemId=${cartItemId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                // Show success modal instead of toast
                if (itemToRemove) {
                    setRemovedItemName(itemToRemove.name);
                    setIsSuccessModalOpen(true);
                }
                mutate();
            } else {
                toast.error('Failed to remove item');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const updateQuantity = async (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        setUpdatingQuantity(cartItemId);
        const toastId = toast.loading('Updating quantity...');
        
        try {
            const response = await fetch(`/api/cart/update?userId=${session?.user?.id}&cartItemId=${cartItemId}&quantity=${newQuantity}`, {
                method: 'PATCH',
            });
            
            if (response.ok) {
                toast.success('Quantity updated', { id: toastId });
                mutate();
            } else {
                toast.error('Failed to update quantity', { id: toastId });
            }
        } catch (error) {
            toast.error('Something went wrong', { id: toastId });
        } finally {
            setUpdatingQuantity(null);
        }
    };

    const calculateSubtotal = () => {
        return data.reduce((total: number, item: Cart) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    const deliveryFee = 50;
    const subtotal = calculateSubtotal();
    const total = subtotal + deliveryFee;

    const handlePlaceOrder = () => {
        router.push('/order');
    };

    return (
        <div 
            className={`${nunito.className} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50`}
            style={{ paddingTop: `${navbarHeight + 24}px` }}
        >
            <Toaster position="bottom-right" reverseOrder={false} />
            
            {/* Remove Item Modal - with shadow but no background overlay */}
            {isRemoveModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white rounded-md shadow-[0_0_25px_rgba(0,0,0,0.3)] p-6 w-full max-w-md pointer-events-auto">
                        <div className="flex items-start mb-4">
                            <div className="mr-2 text-amber-500">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Remove Item?</h3>
                                <p className="mt-2 text-gray-600">
                                    Are you sure you want to remove <span className="font-medium">{itemToRemove?.name}</span> from your cart?
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsRemoveModalOpen(false)}
                                className="ml-auto text-gray-400 hover:text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setIsRemoveModalOpen(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (itemToRemove) {
                                        handleRemoveFromCart(itemToRemove.id);
                                    }
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white rounded-md shadow-[0_0_25px_rgba(0,0,0,0.3)] p-6 w-full max-w-md pointer-events-auto">
                        <div className="flex flex-col items-center text-center">
                            <div className="text-green-500 mb-4">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Item Removed Successfully</h3>
                            <p className="text-gray-600">
                                <span className="font-medium">{removedItemName}</span> has been removed from your cart.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
                <p className="text-gray-600">Review and update your items before checking out</p>
                
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                                <span className="text-sm font-medium text-gray-500">{data.length} items</span>
                            </div>
                            
                            {/* Cart Items List */}
                            <div className="divide-y divide-gray-100">
                                {data.map((item: Cart) => (
                                    <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center">
                                        <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0">
                                            <img 
                                                src={item.product.image || '/img/products/placeholder.jpg'} 
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        <div className="flex-1 sm:ml-4">
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.product.description?.substring(0, 50)}
                                                        {item.product.description && item.product.description.length > 50 ? '...' : ''}
                                                    </p>
                                                </div>
                                                <div className="mt-2 sm:mt-0 text-right">
                                                    <p className="text-lg font-medium text-brown-primary">₱{item.product.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between mt-4 items-center">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || updatingQuantity === item.id}
                                                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-3 text-gray-900 font-medium">
                                                        {updatingQuantity === item.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={updatingQuantity === item.id}
                                                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                
                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => openRemoveConfirmation(item.id, item.product.name)}
                                                    disabled={updatingQuantity === item.id}
                                                    className="text-red-500 hover:text-red-700 focus:outline-none flex items-center disabled:opacity-50"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    <span className="text-sm font-medium">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Continue Shopping Link */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                <Link href="/products" className="text-brown-primary hover:text-brown-primary-hover font-medium flex items-center transition-colors">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Order Summary - Right Side */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-medium">₱{deliveryFee.toFixed(2)}</span>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-lg font-bold text-brown-primary">₱{total.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handlePlaceOrder}
                                    className="w-full py-3 px-4 mt-6 bg-brown-primary hover:bg-brown-primary-hover text-white rounded-xl font-medium flex items-center justify-center"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                                
                                {/* Satisfaction guarantee */}
                                <div className="mt-6 text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Coffee className="h-4 w-4 text-brown-primary mr-2" />
                                        <span className="text-sm font-medium text-gray-900">Satisfaction Guaranteed</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        If you're not completely satisfied with your order, let us know and we'll make it right.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;