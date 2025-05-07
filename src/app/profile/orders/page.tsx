'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Truck, 
  Calendar, 
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import EspressoSpinner from '@/component/EspressoSpinner';
import { Nunito } from 'next/font/google';

// Initialize Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
});

// Define interfaces for type safety
interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<{ orders: Order[] }> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return res.json();
};

// Status badge component
const StatusBadge = ({ status }: { status: Order['status'] }) => {
  const statusConfig = {
    'processing': {
      color: 'bg-blue-100 text-blue-800',
      icon: <Clock className="h-4 w-4 mr-1" />
    },
    'shipped': {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Truck className="h-4 w-4 mr-1" />
    },
    'delivered': {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-4 w-4 mr-1" />
    },
    'cancelled': {
      color: 'bg-red-100 text-red-800',
      icon: <ShoppingBag className="h-4 w-4 mr-1" />
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Order details component
interface OrderDetailsProps {
  order: Order;
  isOpen: boolean;
  onToggle: () => void;
}

const OrderDetails = ({ order, isOpen, onToggle }: OrderDetailsProps) => {
  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      
      {isOpen && (
        <div className="mt-4 space-y-4">
          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm font-medium text-gray-900">₱{item.price.toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₱{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">₱{order.deliveryFee.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-₱{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <span className="font-bold">Total</span>
              <span className="font-bold text-brown-primary">₱{order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900">Delivery Address</h4>
            <p className="mt-1 text-sm text-gray-500">{order.address}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900">Payment Method</h4>
            <p className="mt-1 text-sm text-gray-500">{order.paymentMethod}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
const OrderHistoryPage = () => {
  const { data: session } = useSession();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get navbar height to adjust top padding
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

  // Simulated data for demonstration - 3 orders with different statuses
  const { data, error, isLoading } = useSWR('/api/orders', () => {
    // This is mock data - in production, replace with actual API call
    return Promise.resolve({
      orders: [
        {
          id: 'ORD-2789',
          date: '2025-05-08T14:20:00',
          status: 'processing' as const,
          total: 355.00,
          subtotal: 305.00,
          deliveryFee: 50.00,
          discount: 0,
          address: '123 Coffee Street, Brgy. Espresso, Manila, Philippines',
          paymentMethod: 'Cash on Delivery',
          items: [
            { id: '7', name: 'Espresso', price: 120.00, quantity: 1, image: '/img/products/espresso.jpg' },
            { id: '8', name: 'Chocolate Chip Cookie', price: 85.00, quantity: 1, image: '/img/products/chocolate-chip-cookie.jpg' },
            { id: '9', name: 'Cappuccino', price: 100.00, quantity: 1, image: '/img/products/cappuccino.jpg' },
          ]
        },
        {
          id: 'ORD-2671',
          date: '2025-05-07T09:15:00',
          status: 'shipped' as const,
          total: 395.00,
          subtotal: 345.00,
          deliveryFee: 50.00,
          discount: 0,
          address: '123 Coffee Street, Brgy. Espresso, Manila, Philippines',
          paymentMethod: 'Cash on Delivery',
          items: [
            { id: '5', name: 'Cold Brew', price: 165.00, quantity: 1, image: '/img/products/cold-brew.jpg' },
            { id: '6', name: 'Cinnamon Roll', price: 180.00, quantity: 1, image: '/img/products/cinnamon-roll.jpg' },
          ]
        },
        {
          id: 'ORD-2584',
          date: '2025-05-06T10:45:00',
          status: 'delivered' as const,
          total: 420.00,
          subtotal: 370.00,
          deliveryFee: 50.00,
          discount: 0,
          address: '123 Coffee Street, Brgy. Espresso, Manila, Philippines',
          paymentMethod: 'Cash on Delivery',
          items: [
            { id: '1', name: 'Iced Caramel Macchiato', price: 170.00, quantity: 1, image: '/img/products/caramel-macchiato.jpg' },
            { id: '2', name: 'Blueberry Cheesecake', price: 200.00, quantity: 1, image: '/img/products/blueberry-cheesecake.jpg' },
          ]
        }
      ]
    });
  });

  if (isLoading) {
    return (
      <div className={`${nunito.className} flex items-center justify-center min-h-screen bg-gray-50 pt-16`}>
        <EspressoSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${nunito.className} flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-16`}>
        <p className="text-red-500 mb-4">Failed to load your orders</p>
        <button 
          className="px-4 py-2 bg-brown-primary text-white rounded-lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Filter and search orders
  const filteredOrders = data?.orders.filter(order => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div 
      className={`${nunito.className} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen`}
      style={{ paddingTop: `${navbarHeight + 24}px` }} // Dynamic padding based on navbar height
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">View and track your order history</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brown-primary focus:border-brown-primary"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <span className="mr-2 text-gray-700">Filter by:</span>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | Order['status'])}
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter parameters'
              : "You haven't placed any orders yet"}
          </p>
          <Link href="/products" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-primary hover:bg-brown-primary-hover">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-12">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-2 md:mb-0">
                    <ShoppingBag className="h-5 w-5 text-brown-primary mr-2" />
                    <span className="text-lg font-medium text-gray-900">Order {order.id}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-2 flex flex-col md:flex-row md:items-center text-sm text-gray-500">
                  <div className="flex items-center mr-6">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(order.date)}</span>
                  </div>
                  <div className="flex items-center mt-1 md:mt-0">
                    <span className="font-medium text-brown-primary text-base">₱{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Order Actions */}
              <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                <button
                  className="text-sm text-brown-primary font-medium flex items-center"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                  <Eye className="ml-1 h-4 w-4" />
                </button>
                
                {order.status === 'delivered' && (
                  <button className="text-sm text-gray-600 font-medium hover:text-brown-primary">
                    Reorder
                  </button>
                )}
                
                {order.status === 'processing' && (
                  <button className="text-sm text-red-600 font-medium hover:text-red-700">
                    Cancel Order
                  </button>
                )}
                
                {order.status === 'shipped' && (
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                    Track Delivery
                  </button>
                )}
              </div>
              
              {/* Order Details (expandable) */}
              {expandedOrder === order.id && (
                <OrderDetails 
                  order={order} 
                  isOpen={true} 
                  onToggle={() => toggleOrderDetails(order.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;