"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
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
  DollarSign, 
  Package 
  
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = React.useState(false);

  // Navigation items for sidebar
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', href: '/admin' },
    { icon: <Coffee size={20} />, name: 'Products', href: '/admin/productcontrol' },
    { icon: <ShoppingCart size={20} />, name: 'Orders', href: '/admin/orders' },
    { icon: <Users size={20} />, name: 'Customers', href: '/admin/customers' },
    { icon: <BarChart3 size={20} />, name: 'Analytics', href: '/admin/analytics' },
    { icon: <Settings size={20} />, name: 'Settings', href: '/admin/settings' },
  ];

  // Mock data for statistics
  const stats = [
    { 
      icon: <ShoppingCart className="h-7 w-7 text-blue-600" />, 
      title: 'Total Orders', 
      value: '158', 
      change: '+12%',
      trend: 'up'
    },
    { 
      icon: <Users className="h-7 w-7 text-purple-600" />, 
      title: 'Customers', 
      value: '2,451', 
      change: '+18%',
      trend: 'up'
    },
    { 
      icon: <DollarSign className="h-7 w-7 text-green-600" />, 
      title: 'Revenue', 
      value: '₱45,267', 
      change: '+23%',
      trend: 'up'
    },
    { 
      icon: <Package className="h-7 w-7 text-amber-600" />, 
      title: 'Products Sold', 
      value: '384', 
      change: '+8%',
      trend: 'up'
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-primary"></div>
      </div>
    );
  }

  return (
    <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-full p-3 bg-gray-100">{stat.icon}</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                    {stat.trend === 'up' ? (
                      <TrendingUp size={14} className="ml-1" />
                    ) : (
                      <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Two Columns Layout */}
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

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">Top Products</h2>
                <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
              </div>
              <div className="overflow-x-auto">
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
          </div>
        </main>
  );
};

export default AdminDashboardPage;