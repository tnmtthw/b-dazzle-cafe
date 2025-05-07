"use client";

import React, { useState, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
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
  BarChart3
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-primary"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
          <Link href="/" className="block w-full bg-brown-primary hover:bg-brown-primary-hover text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;