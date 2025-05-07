"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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

const AdminDashboard = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Navigation items for sidebar
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', href: '/admin' },
    { icon: <Coffee size={20} />, name: 'Products', href: '/admin/products' },
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-brown-primary text-white ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <Link href="/admin">
              <h1 className="text-xl font-bold">B'Dazzle Admin</h1>
            </Link>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-brown-primary-hover"
          >
            {collapsed ? <Menu size={24} /> : <X size={24} />}
          </button>
        </div>

        {/* Admin Info */}
        <div className={`px-4 py-3 border-t border-b border-yellow-primary/20 ${collapsed ? 'items-center' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-yellow-primary flex items-center justify-center text-brown-primary font-bold">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            {!collapsed && (
              <div>
                <p className="font-medium">{session?.user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-300">{session?.user?.role || 'Administrator'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3 py-3 rounded-lg transition-colors ${
                pathname === item.href 
                  ? 'bg-yellow-primary text-brown-primary font-medium' 
                  : 'text-white hover:bg-brown-primary-hover'
              }`}
            >
              <div className={`${collapsed ? '' : 'mr-3'}`}>{item.icon}</div>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-yellow-primary/20">
          <button 
            onClick={() => signOut()}
            className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} w-full px-3 py-3 rounded-lg text-white hover:bg-brown-primary-hover transition-colors`}
          >
            <LogOut size={20} className={`${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
                />
                <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="relative">
                <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;