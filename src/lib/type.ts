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