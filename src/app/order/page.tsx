'use client'

import React from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { MapPin, Package, ReceiptText, Trash2, Wallet } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Cart } from "@/lib/type";
import EspressoSpinner from '@/component/EspressoSpinner';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    return res.json();
};

const OrderPage = () => {
    const { data: session, status } = useSession();
    const { data, error, isLoading, mutate } = useSWR(`/api/cart?userId=${session?.user?.id}`, fetcher)

    const df = 50;

    const router = useRouter();

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">
        <EspressoSpinner />
    </div>;
    if (isLoading) return <div className="text-center">Loading...</div>

    const calculateTotal = () => {
        return data.reduce((total: number, item: Cart) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    const handlePlaceOrder = async () => {
        const placingToast = toast.loading('Placing your order...');

        const res = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session?.user?.id }),
        });

        toast.dismiss(placingToast);

        if (res.ok) {
            const result = await res.json();
            toast.success(`Order placed! Order ID: ${result.orderId}`);
            router.push('/order/confirmation');
            mutate();
        } else {
            const error = await res.json();
            toast.error(error.error || 'Failed to place order');
        }
    };

    const totalAmount = df + calculateTotal();

    return (
        <div className="max-w-7xl mx-auto space-y-4">
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            <h1 className="text-3xl font-bold text-center mb-6">Order Confirmation</h1>
            <div className="p-6 space-y-4 bg-white rounded-3xl shadow-lg">
                <h1 className="font-black text-xl flex items-center">
                    <ReceiptText className="mr-2" /> Order Summary
                </h1>
                {data.map((item: Cart) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center max-w-5xl mx-auto"
                    >
                        <div className="flex items-center space-x-4">
                            <img src={item.product.image} className="w-24 h-24" />
                            <div>
                                <div className="text-lg font-medium">{item.product.name}</div>
                                <div className="text-lg font-medium">Php {item.product.price}</div>
                            </div>
                        </div>
                        <div className="text-lg font-medium">
                            <small>x</small>
                            {item.quantity}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 space-y-4 bg-white rounded-3xl shadow-lg">
                <h1 className="font-black text-xl flex items-center">
                    <Package className="mr-2" /> Delivery Details
                </h1>
                <div className="border-b-1 border-dashed"></div>
                <h2 className="font-black text-lg flex items-center">
                    <MapPin className="mr-2" /> Address
                </h2>
                <span>Manila, Philippines</span>
            </div>

            <div className="p-6 space-y-4 bg-white rounded-3xl shadow-lg">
                <h1 className="font-black text-xl flex items-center">
                    <Wallet className="mr-2" /> Payment Summary
                </h1>
                <div className="border-b-1 border-dashed"></div>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <div>Delivery Fee</div>
                        <div className="">Php {df.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center mt-4">
                        <div>Subtotal</div>
                        <div className="">Php {calculateTotal().toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center mt-4">
                        <div>Discount</div>
                        <div className="">Php 0.00</div>
                    </div>
                </div>
                <div className="border-b-1 border-dashed"></div>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="font-bold">Total Amount</div>
                        <div className="font-bold">Php {totalAmount.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            <div className="pb-6">
                <button onClick={handlePlaceOrder}
                    className=" w-full p-6 bg-brown-primary hover:bg-brown-primary-hover text-white rounded-3xl">
                    Confirm Order
                </button>
            </div>
        </div>
    );
};

export default OrderPage;