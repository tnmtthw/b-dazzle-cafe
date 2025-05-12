"use client";

import React from 'react';
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
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock data for statistics
  const stats = [
    { 
      icon: <ShoppingCart className="h-7 w-7 text-blue-600" />, 
      title: 'Total Orders', 
      value: '158', 
      change: '+12%',
      trend: 'up',
      period: 'from last month'
    },
    { 
      icon: <Users className="h-7 w-7 text-purple-600" />, 
      title: 'Customers', 
      value: '2,451', 
      change: '+18%',
      trend: 'up',
      period: 'from last month'
    },
    { 
      icon: <DollarSign className="h-7 w-7 text-green-600" />, 
      title: 'Revenue', 
      value: '₱45,267', 
      change: '+23%',
      trend: 'up',
      period: 'from last month'
    },
    { 
      icon: <Package className="h-7 w-7 text-amber-600" />, 
      title: 'Products Sold', 
      value: '384', 
      change: '+8%',
      trend: 'up',
      period: 'from last month'
    },
  ];

  // Recent orders mock data
  const recentOrders = [
    { id: 'ORD-001', customer: 'John Smith', date: 'May 7, 2025', total: '₱352', status: 'Completed' },
    { id: 'ORD-002', customer: 'Maria Garcia', date: 'May 7, 2025', total: '₱215', status: 'Processing' },
    { id: 'ORD-003', customer: 'Robert Lee', date: 'May 6, 2025', total: '₱189', status: 'Completed' },
    { id: 'ORD-004', customer: 'Sarah Johnson', date: 'May 6, 2025', total: '₱432', status: 'Delivered' },
    { id: 'ORD-005', customer: 'David Chen', date: 'May 5, 2025', total: '₱267', status: 'Processing' },
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
            <Link
              href="/admin/productcontrol/add"
              className="px-4 py-2 bg-yellow-primary text-brown-primary rounded-lg flex items-center hover:bg-yellow-400 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:transform hover:scale-105 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full p-3 bg-gray-100">{stat.icon}</div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'Delivered' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
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