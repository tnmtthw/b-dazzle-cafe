import { DateTime } from 'next-auth/providers/kakao';

export interface Product {
    id: string;
    image: string;
    name: string;
    description: string;
    price: number;
    sold: number;
    createdAt: DateTime;
}

export interface Cart {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt: number;
    product: Product;
}