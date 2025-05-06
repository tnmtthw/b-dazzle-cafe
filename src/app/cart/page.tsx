'use client'

import React from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Trash2 } from 'lucide-react';

import { Cart } from "@/lib/type";
import EspressoSpinner from '@/component/EspressoSpinner';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    return res.json();
};

const CartPage = () => {
    const { data: session, status } = useSession();
    const { data, error, isLoading, mutate } = useSWR(`/api/cart?userId=${session?.user?.id}`, fetcher)

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">
        <EspressoSpinner />
    </div>;
    if (isLoading) return <div className="text-center">Loading...</div>

    const handleRemoveFromCart = async (cartItemId: string) => {
        const response = await fetch(`/api/cart/remove?userId=${session?.user?.id}&cartItemId=${cartItemId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            mutate();
        } else {
            alert('Failed to remove item from cart');
        }
    };

    const calculateTotal = () => {
        return data.reduce((total: number, item: Cart) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
            <div className="space-y-4">
                {data.map((item: Cart) => (
                    <div key={item.id} className="flex justify-between items-center border-b py-4">
                        <div className="flex items-center space-x-4">
                            <div className="text-lg font-medium">{item.product.name}</div>
                            <div className="text-gray-500">{item.quantity} x ₱{item.product.price}</div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                onClick={() => handleRemoveFromCart(item.id)}>
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-xl font-semibold mt-6">
                <h3>Total: <span className="text-green-500">₱{calculateTotal()}</span></h3>
            </div>
        </div>
    );
};

export default CartPage;