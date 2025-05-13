import { DateTime } from 'next-auth/providers/kakao';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: string;
  verified: boolean;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: string;
    sales: number;
    image: string;
    status: 'Active' | 'Inactive';
    description?: string;
    createdAt: string;
  }

export interface Cart {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt: number;
    product: Product;
}