"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Coffee,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useDasboard, useRecent } from "@/data/dashboard";
import { Order } from '@/lib/type';

const AdminDashboard = () => {
  const router = useRouter();
  
  // Function to navigate to product control and open add modal
  const handleAddProduct = () => {
    // Store the action in localStorage to trigger modal opening
    localStorage.setItem('productAction', 'add');
    // Navigate to product control page
    router.push('/admin/productcontrol');
  };

  // Safely get data with null fallbacks
  const { data: countData } = useDasboard() || { data: null };
  const { data: recentData } = useRecent() || { data: null };

  // Set default values if data is undefined
  const count = countData || {
    orders: 0,
    users: 0,
    revenue: 0,
    productsSold: 0
  };

  // Stats with fallback values
  const stats = [
    {
      icon: <ShoppingCart className="h-7 w-7 text-blue-600" />,
      title: 'Total Orders',
      value: count.orders || 0,
      change: '+12%',
      trend: 'up',
      period: 'from last month'
    },
    {
      icon: <Users className="h-7 w-7 text-purple-600" />,
      title: 'Customers',
      value: count.users || 0,
      change: '+18%',
      trend: 'up',
      period: 'from last month'
    },
    {
      icon: <DollarSign className="h-7 w-7 text-green-600" />,
      title: 'Revenue',
      value: `₱${count.revenue || 0}`,
      change: '+23%',
      trend: 'up',
      period: 'from last month'
    },
    {
      icon: <Package className="h-7 w-7 text-amber-600" />,
      title: 'Products Sold',
      value: count.productsSold || 0,
      change: '+8%',
      trend: 'up',
      period: 'from last month'
    },
  ];

  // Top products mock data
  const topProducts = [
    { name: 'Cappuccino', sold: 42, revenue: '₱5,040' },
    { name: 'Caramel Macchiato', sold: 38, revenue: '₱4,940' },
    { name: 'Espresso', sold: 35, revenue: '₱3,150' },
    { name: 'Café Mocha', sold: 29, revenue: '₱3,770' },
    { name: 'Caffè Latte', sold: 27, revenue: '₱3,240' },
  ];

  // Recent activity mock data
  const recentActivity = [
    { type: 'order', message: 'New order #ORD-006 received', time: '10 minutes ago', icon: <ShoppingCart className="h-5 w-5 text-blue-500" /> },
    { type: 'payment', message: 'Payment of ₱432 processed for order #ORD-004', time: '25 minutes ago', icon: <CreditCard className="h-5 w-5 text-green-500" /> },
    { type: 'stock', message: 'Cappuccino stock is running low', time: '1 hour ago', icon: <Coffee className="h-5 w-5 text-amber-500" /> },
    { type: 'customer', message: 'New customer Maria Garcia registered', time: '2 hours ago', icon: <Users className="h-5 w-5 text-purple-500" /> },
    { type: 'order', message: 'Order #ORD-003 has been completed', time: '3 hours ago', icon: <Package className="h-5 w-5 text-green-500" /> },
  ];

  // Recent orders data with fallback
  const recentOrders = recentData || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brown-primary to-brown-primary-hover rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-white">Welcome back, Admin!</h1>
            <p className="text-white/80 mt-1">Here's what's happening with your store today.</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/sales/report"
              className="px-4 py-2 bg-white text-brown-primary rounded-lg flex items-center hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span>View Sales Report</span>
            </Link>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-yellow-primary text-brown-primary rounded-lg flex items-center hover:bg-yellow-400 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:transform hover:scale-105 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full p-3 bg-gray-100">{stat.icon}</div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {stat.change}
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={14} className="ml-1" />
                ) : (
                  <ArrowDownRight size={14} className="ml-1" />
                )}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.period}</p>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(recentOrders) ? (
                  recentOrders.map((order: Order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.name || 'Unknown Customer'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {order.status?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}

                {/* Show placeholder rows if no data */}
                {(!Array.isArray(recentOrders) || recentOrders.length === 0) && (
                  <>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-001</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Smith</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 14, 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱352.00</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          DELIVERED
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-002</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maria Garcia</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 13, 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱215.00</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          PROCESSING
                        </span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Widgets */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Top Products</h2>
              <Link href="/admin/productcontrol" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
            </div>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <div key={index} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {activity.icon}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-gray-100 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">View All Activities</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;