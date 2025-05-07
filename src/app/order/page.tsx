'use client'

import React, { useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Package, 
  ReceiptText, 
  Truck, 
  Wallet, 
  Clock, 
  CreditCard,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Nunito } from 'next/font/google';

import { Cart } from "@/lib/type";
import EspressoSpinner from '@/component/EspressoSpinner';

// Initialize Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
});

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    return res.json();
};

const OrderPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { data, error, isLoading, mutate } = useSWR(`/api/cart?userId=${session?.user?.id}`, fetcher);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [addressExpanded, setAddressExpanded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(72); // Default value

    // Effect to measure navbar height
    React.useEffect(() => {
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

    const deliveryFee = 50;

    if (isLoading) return (
        <div className={`${nunito.className} flex items-center justify-center min-h-screen bg-gray-50`}
             style={{ paddingTop: `${navbarHeight + 24}px` }}>
            <EspressoSpinner />
        </div>
    );

    if (error) return (
        <div className={`${nunito.className} flex flex-col items-center justify-center min-h-screen bg-gray-50`}
             style={{ paddingTop: `${navbarHeight + 24}px` }}>
            <p className="text-red-500 mb-4">Failed to load order details</p>
            <button 
                onClick={() => mutate()} 
                className="px-4 py-2 bg-brown-primary text-white rounded-lg"
            >
                Try Again
            </button>
        </div>
    );

    const calculateSubtotal = () => {
        return data.reduce((total: number, item: Cart) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const discount = 0;
    const totalAmount = deliveryFee + subtotal - discount;

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        const placingToast = toast.loading('Processing your order...');

        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId: session?.user?.id,
                    paymentMethod
                }),
            });

            toast.dismiss(placingToast);
            
            if (res.ok) {
                const result = await res.json();
                // Show success toast
                toast.success(`Order successfully placed!`);
                
                // Important: Navigate to confirmation page after success
                setTimeout(() => {
                    router.push('/order/confirmation');
                }, 1000); // Brief delay to allow toast to be seen
            } else {
                setIsProcessing(false);
                const error = await res.json();
                toast.error(error.error || 'Failed to place order');
            }
        } catch (error) {
            toast.dismiss(placingToast);
            setIsProcessing(false);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <div className={`${nunito.className} max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50`}
             style={{ paddingTop: `${navbarHeight + 24}px` }}>
            <Toaster position="bottom-right" reverseOrder={false} />

            {/* Page Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
                <p className="mt-2 text-gray-600">Review your items and delivery details before confirming</p>
                
                {/* Order Progress Indicator */}
                <div className="flex justify-center items-center mt-8 max-w-2xl mx-auto">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-brown-primary flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <span className="mt-2 text-sm font-medium text-brown-primary">Cart</span>
                    </div>
                    <div className="flex-1 h-1 mx-2 bg-brown-primary"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-brown-primary flex items-center justify-center">
                            <Truck className="h-5 w-5 text-white" />
                        </div>
                        <span className="mt-2 text-sm font-medium text-brown-primary">Delivery</span>
                    </div>
                    <div className="flex-1 h-1 mx-2 bg-brown-primary"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-brown-primary flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <span className="mt-2 text-sm font-medium text-brown-primary">Payment</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <ReceiptText className="mr-2 text-brown-primary" /> 
                                Order Items
                            </h2>
                            <span className="text-sm font-medium text-gray-500">{data.length} items</span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {data.map((item: Cart) => (
                                <div key={item.id} className="py-4 flex">
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                        <img 
                                            src={item.product.image} 
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="ml-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.product.description}</p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-lg font-medium text-brown-primary">
                                                ₱{item.product.price.toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">Qty:</span>
                                                <span className="font-medium">{item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setAddressExpanded(!addressExpanded)}
                        >
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <MapPin className="mr-2 text-brown-primary" /> 
                                Delivery Address
                            </h2>
                            {addressExpanded ? 
                                <ChevronUp className="text-gray-500" /> : 
                                <ChevronDown className="text-gray-500" />
                            }
                        </div>

                        <div className={`mt-4 ${addressExpanded ? 'block' : 'hidden'}`}>
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <p className="font-medium text-gray-900">Manila, Philippines</p>
                                <p className="text-gray-600 mt-1">123 Coffee Street, Brgy. Espresso</p>
                                <p className="text-gray-600">Contact: +63 912 345 6789</p>
                                
                                <div className="mt-4 flex items-center">
                                    <Clock className="h-4 w-4 text-brown-primary mr-2" />
                                    <span className="text-sm text-gray-600">
                                        Estimated delivery: 30-45 minutes
                                    </span>
                                </div>
                            </div>
                            
                            <button className="mt-4 text-brown-primary font-medium text-sm flex items-center">
                                Change address <ArrowRight className="ml-1 h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                            <CreditCard className="mr-2 text-brown-primary" /> 
                            Payment Method
                        </h2>

                        <div className="space-y-4">
                            <div 
                                className={`p-4 border rounded-lg flex items-center gap-3 cursor-pointer ${
                                    paymentMethod === 'cash' ? 'border-brown-primary bg-yellow-50' : 'border-gray-200'
                                }`}
                                onClick={() => setPaymentMethod('cash')}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    paymentMethod === 'cash' ? 'border-brown-primary' : 'border-gray-300'
                                }`}>
                                    {paymentMethod === 'cash' && (
                                        <div className="w-3 h-3 rounded-full bg-brown-primary"></div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                </div>
                            </div>

                            <div 
                                className={`p-4 border rounded-lg flex items-center gap-3 cursor-pointer ${
                                    paymentMethod === 'card' ? 'border-brown-primary bg-yellow-50' : 'border-gray-200'
                                }`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    paymentMethod === 'card' ? 'border-brown-primary' : 'border-gray-300'
                                }`}>
                                    {paymentMethod === 'card' && (
                                        <div className="w-3 h-3 rounded-full bg-brown-primary"></div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Credit/Debit Card</p>
                                    <p className="text-sm text-gray-600">Secure online payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                            <Wallet className="mr-2 text-brown-primary" /> 
                            Order Summary
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className="font-medium">₱{deliveryFee.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium text-green-600">-₱{discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-lg font-bold text-brown-primary">₱{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || data.length === 0}
                                className={`w-full py-4 mt-6 rounded-xl font-medium text-white flex items-center justify-center ${
                                    isProcessing || data.length === 0 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-brown-primary hover:bg-brown-primary-hover'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : 'Place Order'}
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-4">
                                By placing your order, you agree to our <span className="text-brown-primary">Terms of Service</span> and <span className="text-brown-primary">Privacy Policy</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;