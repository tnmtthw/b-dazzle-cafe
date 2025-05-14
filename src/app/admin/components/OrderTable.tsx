'use client';

import React, { useState } from 'react';
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
  Phone,
  Filter
} from 'lucide-react';

import { Order, OrderStatus } from '@/lib/type';

interface OrderTableProps {
  orders: Order[];
  isAdminView?: boolean;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

// Define tab types for filtering orders
type OrderTab = 'all' | OrderStatus;

const OrderTable: React.FC<OrderTableProps> = ({
  orders = [],
  isAdminView = false,
  onStatusChange
}) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderTab>('all');

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

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

  // Count orders by status for tab badges
  const orderCounts = {
    all: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    processing: orders.filter(order => order.status === 'processing').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-6 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'all'
              ? 'border-brown-primary text-brown-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            All Orders
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">{orderCounts.all}</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'pending'
              ? 'border-brown-primary text-brown-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-blue-100 text-blue-800">{orderCounts.pending}</span>
          </button>

          <button
            onClick={() => setActiveTab('processing')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'processing'
              ? 'border-brown-primary text-brown-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <PackageOpen className="h-4 w-4 mr-2" />
            Processing
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-yellow-100 text-yellow-800">{orderCounts.processing}</span>
          </button>

          <button
            onClick={() => setActiveTab('shipped')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'shipped'
              ? 'border-brown-primary text-brown-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Truck className="h-4 w-4 mr-2" />
            Shipped
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-indigo-100 text-indigo-800">{orderCounts.shipped}</span>
          </button>

          <button
            onClick={() => setActiveTab('delivered')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'delivered'
              ? 'border-brown-primary text-brown-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Delivered
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-green-100 text-green-800">{orderCounts.delivered}</span>
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'cancelled'
              ? 'border-brown-primary text-brown-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <ArchiveX className="h-4 w-4 mr-2" />
            Cancelled
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-red-100 text-red-800">{orderCounts.cancelled}</span>
          </button>
        </nav>
      </div>

      {/* Order Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No orders found in this category.</p>
        </div>
      ) : (
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
                {filteredOrders.map((order) => (
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
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'pending'
                                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                          : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                                          }`}
                                      >
                                        Pending
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(order.id, 'processing')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'processing'
                                          ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                                          : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'
                                          }`}
                                      >
                                        Processing
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(order.id, 'shipped')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'shipped'
                                          ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                                          : 'bg-gray-100 text-gray-800 hover:bg-indigo-50'
                                          }`}
                                      >
                                        Shipped
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(order.id, 'delivered')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered'
                                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                          : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                                          }`}
                                      >
                                        Delivered
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'cancelled'
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
      )}
    </div>
  );
};

export default OrderTable;