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
  AlertCircle,
  PackageOpen,
  ArchiveX,
  Coffee,
  MapPin
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
  estimatedDelivery?: string;
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
      icon: <ArchiveX className="h-4 w-4 mr-1" />
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
  const [activeTab, setActiveTab] = useState<'all' | Order['status']>('all');
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
          estimatedDelivery: '2025-05-10T14:20:00',
          items: [
            { id: '7', name: 'Espresso', price: 120.00, quantity: 1, image: '/img/products/coffee.png' },
            { id: '8', name: 'Chocolate Chip Cookie', price: 85.00, quantity: 1, image: '/img/products/coffee.png' },
            { id: '9', name: 'Cappuccino', price: 100.00, quantity: 1, image: '/img/products/coffee.png' },
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
          estimatedDelivery: '2025-05-09T14:20:00',
          items: [
            { id: '5', name: 'Cold Brew', price: 165.00, quantity: 1, image: '/img/products/coffee.png' },
            { id: '6', name: 'Cinnamon Roll', price: 180.00, quantity: 1, image: '/img/products/coffee.png' },
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
            { id: '1', name: 'Iced Caramel Macchiato', price: 170.00, quantity: 1, image: '/img/products/coffee.png' },
            { id: '2', name: 'Blueberry Cheesecake', price: 200.00, quantity: 1, image: '/img/products/coffee.png' },
          ]
        },
        {
          id: 'ORD-2490',
          date: '2025-05-05T15:30:00',
          status: 'cancelled' as const,
          total: 280.00,
          subtotal: 230.00,
          deliveryFee: 50.00,
          discount: 0,
          address: '123 Coffee Street, Brgy. Espresso, Manila, Philippines',
          paymentMethod: 'Cash on Delivery',
          items: [
            { id: '3', name: 'Vanilla Latte', price: 150.00, quantity: 1, image: '/img/products/coffee.png' },
            { id: '4', name: 'Croissant', price: 80.00, quantity: 1, image: '/img/products/coffee.png' },
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

  // Get active/current orders (processing or shipped)
  const activeOrders = data?.orders.filter(order => 
    order.status === 'processing' || order.status === 'shipped'
  ) || [];

  // Filter and search orders based on tab and search term
  const filteredOrders = data?.orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
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

  // Format date in a more compact way for estimated delivery
  const formatShortDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div 
      className={`${nunito.className} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen pb-12`}
      style={{ paddingTop: `${navbarHeight + 24}px` }} // Dynamic padding based on navbar height
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">View and track your order history</p>
      </div>

      {/* Current/Active Orders Section */}
      {activeOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Current Orders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  
                  {/* Status Progress Bar */}
                  <div className="my-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                          <CheckCircle size={16} />
                        </div>
                        <p className="text-xs mt-1">Confirmed</p>
                      </div>
                      <div className="flex-grow h-1 bg-gray-200 mx-2">
                        <div 
                          className={`h-full bg-green-500 ${order.status === 'processing' ? 'w-1/3' : 'w-2/3'}`} 
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${order.status === 'processing' ? 'bg-blue-100 text-blue-500' : 'bg-green-500 text-white'} flex items-center justify-center`}>
                          <PackageOpen size={16} />
                        </div>
                        <p className="text-xs mt-1">Preparing</p>
                      </div>
                      <div className="flex-grow h-1 bg-gray-200 mx-2">
                        <div 
                          className={`h-full bg-green-500 ${order.status === 'shipped' ? 'w-1/2' : 'w-0'}`} 
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${order.status === 'shipped' ? 'bg-yellow-100 text-yellow-500' : 'bg-gray-200 text-gray-400'} flex items-center justify-center`}>
                          <Truck size={16} />
                        </div>
                        <p className="text-xs mt-1">Shipped</p>
                      </div>
                      <div className="flex-grow h-1 bg-gray-200 mx-2">
                        <div className="h-full bg-green-500 w-0" />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <CheckCircle size={16} />
                        </div>
                        <p className="text-xs mt-1">Delivered</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Info */}
                  <div className="bg-gray-50 p-3 rounded-lg mt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Items:</span>
                      <span className="text-sm font-medium">{order.items.length} items</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="text-sm font-medium">₱{order.total.toFixed(2)}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Estimated delivery:</span>
                        <span className="text-sm font-medium">{formatShortDate(order.estimatedDelivery)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Item Preview */}
                  <div className="flex mt-4 space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex mt-4 justify-between">
                    <button 
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-sm text-brown-primary hover:text-brown-primary-hover font-medium flex items-center"
                    >
                      View Details
                      <Eye className="ml-1 h-4 w-4" />
                    </button>
                    
                    {order.status === 'processing' ? (
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Cancel Order
                      </button>
                    ) : order.status === 'shipped' ? (
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Track Order
                      </button>
                    ) : null}
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>₱{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Delivery</span>
                          <span>₱{order.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium mt-2">
                          <span>Total</span>
                          <span>₱{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-start">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{order.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order History Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-brown-primary focus:border-brown-primary"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Order Status Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-brown-primary text-brown-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab('processing')}
              className={`flex items-center whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'processing'
                  ? 'border-brown-primary text-brown-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="mr-2 h-4 w-4" />
              Processing
            </button>
            <button
              onClick={() => setActiveTab('shipped')}
              className={`flex items-center whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shipped'
                  ? 'border-brown-primary text-brown-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Truck className="mr-2 h-4 w-4" />
              Shipped
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`flex items-center whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'delivered'
                  ? 'border-brown-primary text-brown-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Delivered
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex items-center whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cancelled'
                  ? 'border-brown-primary text-brown-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ArchiveX className="mr-2 h-4 w-4" />
              Cancelled
            </button>
          </nav>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || activeTab !== 'all' 
                ? 'Try adjusting your search or filter parameters'
                : "You haven't placed any orders yet"}
            </p>
            <Link href="/products" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-primary hover:bg-brown-primary-hover">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                order.status === 'processing' ? 'border-l-4 border-blue-500' :
                order.status === 'shipped' ? 'border-l-4 border-yellow-500' :
                order.status === 'delivered' ? 'border-l-4 border-green-500' :
                'border-l-4 border-red-500'
              }`}>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 text-brown-primary mr-2" />
                        <h3 className="font-medium">{order.id}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(order.date)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  
                  {/* Order Summary */}
                  <div className="flex items-center mt-4 text-sm">
                    <Coffee className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-gray-600 mr-2">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                    <span className="font-medium">₱{order.total.toFixed(2)}</span>
                  </div>
                  
                  {/* Item thumbnails */}
                  <div className="flex mt-3 space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex mt-4 justify-between">
                    <button 
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-sm text-brown-primary hover:text-brown-primary-hover font-medium flex items-center"
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                      <Eye className="ml-1 h-4 w-4" />
                    </button>
                    
                    {order.status === 'delivered' && (
                      <button className="text-sm text-brown-primary hover:text-brown-primary-hover font-medium">
                        Reorder
                      </button>
                    )}
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>₱{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Delivery</span>
                          <span>₱{order.deliveryFee.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm mt-1">
                            <span>Discount</span>
                            <span className="text-green-600">-₱{order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium mt-2">
                          <span>Total</span>
                          <span>₱{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-start">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{order.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Empty State for No Active Orders */}
      {activeOrders.length === 0 && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-gray-300">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No active orders</h3>
          <p className="text-gray-500 mt-1">You don't have any orders being processed or shipped right now.</p>
          <Link 
            href="/products" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-brown-primary text-white rounded-md hover:bg-brown-primary-hover transition-colors"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;