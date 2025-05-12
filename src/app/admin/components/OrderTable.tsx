'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  ArchiveX, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  PackageOpen,
  Calendar,
  User,
  MapPin,
  Phone
} from 'lucide-react';

// Define order status types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Define order item interface
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
    description: string;
    price: number;
  };
}

// Define order interface
export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

interface OrderTableProps {
  orders: Order[];
  isAdminView?: boolean;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

// Sample data for demonstration
const sampleOrders: Order[] = [
  {
    id: "ORD123456",
    userId: "1",
    total: 350.00,
    status: 'delivered',
    createdAt: new Date().toISOString(),
    items: [
      {
        id: '1',
        orderId: 'ORD123456',
        productId: '1',
        quantity: 2,
        price: 120.00,
        product: {
          id: '1',
          name: 'Cappuccino',
          description: 'A classic Italian coffee drink prepared with espresso, hot milk, and steamed-milk foam',
          price: 120.00,
          image: '/img/products/coffee.png',
        }
      },
      {
        id: '2',
        orderId: 'ORD123456',
        productId: '2',
        quantity: 1,
        price: 110.00,
        product: {
          id: '2',
          name: 'Blueberry Cheesecake',
          description: 'A rich and creamy cheesecake with fresh blueberry topping',
          price: 110.00,
          image: '/img/products/coffee.png',
        }
      }
    ],
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+63 912 345 6789',
      address: '123 Coffee Lane, Brgy. Espresso, Manila, Philippines'
    }
  },
  {
    id: "ORD789012",
    userId: "2",
    total: 280.00,
    status: 'processing',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    items: [
      {
        id: '3',
        orderId: 'ORD789012',
        productId: '3',
        quantity: 1,
        price: 150.00,
        product: {
          id: '3',
          name: 'Mocha Frappe',
          description: 'A cold blended drink made with espresso, chocolate, milk, and ice',
          price: 150.00,
          image: '/img/products/coffee.png',
        }
      },
      {
        id: '4',
        orderId: 'ORD789012',
        productId: '4',
        quantity: 1,
        price: 130.00,
        product: {
          id: '4',
          name: 'Chicken Sandwich',
          description: 'Grilled chicken with lettuce, tomato, and special sauce on freshly baked bread',
          price: 130.00,
          image: '/img/products/coffee.png',
        }
      }
    ],
    user: {
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+63 923 456 7890',
      address: '456 Bean Street, Makati City, Philippines'
    }
  },
  {
    id: "ORD345678",
    userId: "3",
    total: 420.00,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    items: [
      {
        id: '5',
        orderId: 'ORD345678',
        productId: '5',
        quantity: 2,
        price: 150.00,
        product: {
          id: '5',
          name: 'Caramel Macchiato',
          description: 'Espresso with steamed milk and vanilla, topped with caramel sauce',
          price: 150.00,
          image: '/img/products/coffee.png',
        }
      },
      {
        id: '6',
        orderId: 'ORD345678',
        productId: '6',
        quantity: 1,
        price: 120.00,
        product: {
          id: '6',
          name: 'Chocolate Croissant',
          description: 'Buttery croissant filled with rich chocolate',
          price: 120.00,
          image: '/img/products/coffee.png',
        }
      }
    ],
    user: {
      name: 'Robert Lee',
      email: 'robert.lee@example.com',
      phone: '+63 934 567 8901',
      address: '789 Brew Avenue, Quezon City, Philippines'
    }
  }
];

const OrderTable: React.FC<OrderTableProps> = ({ 
  orders = [], // Accept empty array from parent component 
  isAdminView = false,
  onStatusChange
}) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Use sample data if orders array is empty
  const displayOrders = orders.length > 0 ? orders : sampleOrders;

  // Handle expanding/collapsing order details
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to get status badge
  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      'pending': {
        color: 'bg-blue-100 text-blue-800',
        icon: <Clock className="h-4 w-4 mr-1" />
      },
      'processing': {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <PackageOpen className="h-4 w-4 mr-1" />
      },
      'shipped': {
        color: 'bg-indigo-100 text-indigo-800',
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

  // Mock function for status change if not provided
  const handleStatusChange = onStatusChange || ((orderId: string, newStatus: OrderStatus) => {
    console.log(`Status would change for order ${orderId} to ${newStatus}`);
    // This is just a placeholder - in a real app, this would call an API endpoint
  });

  if (displayOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              {isAdminView && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.substring(0, 8).toUpperCase()}
                  </td>
                  {isAdminView && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.name || 'Unknown User'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items.length} item(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brown-primary">
                    ₱{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-brown-primary hover:text-brown-primary-hover transition-colors flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedOrder === order.id ? 'Hide' : 'View'}
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={isAdminView ? 7 : 6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Order Items</h4>
                          <div className="bg-white rounded-lg shadow overflow-hidden">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center p-4 border-b border-gray-100 last:border-0">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img 
                                    src={item.product.image || '/img/products/placeholder.jpg'} 
                                    alt={item.product.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                                <div className="ml-4 flex-1">
                                  <h5 className="text-sm font-medium text-gray-900">{item.product.name}</h5>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.quantity} x ₱{item.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    ₱{(item.quantity * item.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Order Details</h4>
                          <div className="bg-white rounded-lg shadow p-4 space-y-4">
                            {/* Order Summary */}
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h5>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Subtotal:</span>
                                  <span>₱{order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Delivery Fee:</span>
                                  <span>₱50.00</span>
                                </div>
                                <div className="flex justify-between font-medium pt-1 border-t border-gray-200 mt-1">
                                  <span>Total:</span>
                                  <span>₱{(order.total + 50).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Customer Information - Only show in admin view */}
                            {isAdminView && order.user && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-start">
                                    <User className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                    <div>
                                      <p>{order.user.name}</p>
                                      <p className="text-gray-500">{order.user.email}</p>
                                    </div>
                                  </div>
                                  {order.user.phone && (
                                    <div className="flex items-start">
                                      <Phone className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                      <span>{order.user.phone}</span>
                                    </div>
                                  )}
                                  {order.user.address && (
                                    <div className="flex items-start">
                                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                      <span>{order.user.address}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Status management - Only show in admin view */}
                            {isAdminView && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Update Status</h5>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'pending')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      order.status === 'pending' 
                                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                                    }`}
                                  >
                                    Pending
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'processing')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      order.status === 'processing' 
                                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'
                                    }`}
                                  >
                                    Processing
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'shipped')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      order.status === 'shipped' 
                                        ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-indigo-50'
                                    }`}
                                  >
                                    Shipped
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'delivered')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      order.status === 'delivered' 
                                        ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                                    }`}
                                  >
                                    Delivered
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'cancelled')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      order.status === 'cancelled' 
                                        ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                                    }`}
                                  >
                                    Cancelled
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;