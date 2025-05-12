"use client";

import React, { useState, ReactNode, useEffect } from 'react';
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
  BarChart3, 
  Search,
  Bell,
  ChevronDown,
  User,
  Plus
} from 'lucide-react';

interface AdminNavbarProps {
  children: ReactNode;
}

const AdminMainNav = ({ children }: AdminNavbarProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkForMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkForMobile();
    
    // Add event listener
    window.addEventListener('resize', checkForMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkForMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userDropdown = document.getElementById('user-dropdown');
      const userToggler = document.getElementById('user-dropdown-toggler');
      const notificationsDropdown = document.getElementById('notifications-dropdown');
      const notificationsToggler = document.getElementById('notifications-toggler');
      
      if (userDropdown && userToggler && 
          !userDropdown.contains(event.target as Node) && 
          !userToggler.contains(event.target as Node) && 
          userDropdownOpen) {
        setUserDropdownOpen(false);
      }
      
      if (notificationsDropdown && notificationsToggler && 
          !notificationsDropdown.contains(event.target as Node) && 
          !notificationsToggler.contains(event.target as Node) && 
          notificationsOpen) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen, notificationsOpen]);

  // Navigation items for sidebar
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', href: '/admin' },
    { icon: <Coffee size={20} />, name: 'Products', href: '/admin/productcontrol', badge: 'New' },
    { icon: <ShoppingCart size={20} />, name: 'Orders', href: '/admin/orders', badge: 3 },
    { icon: <Users size={20} />, name: 'Customers', href: '/admin/customers' },
    { icon: <BarChart3 size={20} />, name: 'Analytics', href: '/admin/analytics' },
    { icon: <Settings size={20} />, name: 'Settings', href: '/admin/settings' },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New Order #1234', message: 'A new order has been placed.', time: '5 min ago', read: false },
    { id: 2, title: 'Low Stock Alert', message: 'Cappuccino is running low on stock.', time: '30 min ago', read: false },
    { id: 3, title: 'Payment Received', message: 'Payment of ₱1,250 has been received.', time: '1 hour ago', read: true },
  ];

  // Function to get current page title
  const getCurrentPageTitle = (): string => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname?.includes('/productcontrol')) return 'Product Management';
    if (pathname?.includes('/orders')) return 'Orders';
    if (pathname?.includes('/customers')) return 'Customers';
    if (pathname?.includes('/analytics')) return 'Analytics';
    if (pathname?.includes('/settings')) return 'Settings';
    return 'Admin Panel';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      {isMobile && !mobileSidebarOpen && (
        <button 
          onClick={() => setMobileSidebarOpen(true)} 
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-brown-primary text-white hover:bg-brown-primary-hover transition-colors"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar Navigation */}
      <div 
        className={`bg-brown-primary text-white 
                  ${isMobile 
                    ? mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
                    : collapsed ? 'w-20' : 'w-64'
                  } 
                  transition-all duration-300 transform flex flex-col fixed h-full z-30
                  ${isMobile ? 'shadow-xl' : ''}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <Link href="/admin" className="flex items-center">
              <img 
                src="/img/logo.png" 
                alt="B'Dazzle Admin" 
                className="h-8 w-auto mr-3" 
              />
              <h1 className="text-xl font-bold">B'Dazzle Admin</h1>
            </Link>
          )}
          <button 
            onClick={() => isMobile ? setMobileSidebarOpen(false) : setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-brown-primary-hover"
          >
            {isMobile ? <X size={24} /> : (collapsed ? <Menu size={24} /> : <X size={24} />)}
          </button>
        </div>

        {/* Admin Info */}
        <div className={`px-4 py-3 border-t border-b border-yellow-primary/20 ${collapsed && !isMobile ? 'items-center' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-yellow-primary flex items-center justify-center text-brown-primary font-bold">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            {(!collapsed || isMobile) && (
              <div>
                <p className="font-medium">{session?.user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-300">{session?.user?.role || 'Administrator'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-colors ${
                pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
                  ? 'bg-yellow-primary text-brown-primary font-medium' 
                  : 'text-white hover:bg-brown-primary-hover'
              }`}
            >
              <div className="flex items-center">
                <div className={`${(collapsed && !isMobile) ? '' : 'mr-3'}`}>{item.icon}</div>
                {(!collapsed || isMobile) && <span>{item.name}</span>}
              </div>
              
              {(!collapsed || isMobile) && item.badge && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full 
                ${pathname === item.href || pathname?.startsWith(item.href)
                  ? 'bg-white text-brown-primary'
                  : 'bg-yellow-primary text-brown-primary'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-yellow-primary/20">
          <button 
            onClick={() => signOut()}
            className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : 'justify-start'} w-full px-3 py-3 rounded-lg text-white hover:bg-brown-primary-hover transition-colors`}
          >
            <LogOut size={20} className={`${(collapsed && !isMobile) ? '' : 'mr-3'}`} />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 ${
        isMobile ? 'ml-0' : (collapsed ? 'ml-20' : 'ml-64')
      } transition-all duration-300 flex flex-col`}>
        {/* Top Header Navigation */}
        <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            {/* Left side: Title */}
            <div className="flex items-center">
              {isMobile && (
                <div className="w-8"></div> // Spacer for mobile menu button
              )}
              <h1 className="text-xl font-bold text-gray-800">
                {getCurrentPageTitle()}
              </h1>
            </div>
            
            {/* Right side: Actions */}
            <div className="flex items-center space-x-4">
             
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
                />
                <Search className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" />
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  id="notifications-toggler"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </button>
                
                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div 
                    id="notifications-dropdown"
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold">Notifications</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700">Mark all as read</button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 ${notification.read ? '' : 'bg-yellow-50'} hover:bg-gray-50`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-1">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Dropdown */}
              <div className="relative">
                <button 
                  id="user-dropdown-toggler"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-primary flex items-center justify-center text-brown-primary font-bold">
                    {session?.user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="hidden md:block">
                    <ChevronDown size={16} className="text-gray-600" />
                  </div>
                </button>
                
                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium">{session?.user?.name || 'Admin User'}</p>
                      <p className="text-sm text-gray-500">{session?.user?.email || 'admin@example.com'}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/admin/profile" 
                        className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span>Your Profile</span>
                      </Link>
                      
                      <Link 
                        href="/admin/settings" 
                        className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    
                    <div className="py-1 border-t border-gray-200">
                      <button 
                        onClick={() => signOut()}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Secondary Navigation - Context Tabs */}
          {getCurrentPageTitle() === 'Product Management' && (
            <div className="mt-4 border-b border-gray-200 -mx-6 px-6">
              <nav className="flex -mb-px space-x-6 overflow-x-auto hide-scrollbar">
                <button className="px-1 pb-3 border-b-2 border-brown-primary text-brown-primary font-medium">All Products</button>
                <button className="px-1 pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Categories</button>
                <button className="px-1 pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Inventory</button>
                <button className="px-1 pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Analytics</button>
              </nav>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 bg-white border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© 2025 B'Dazzle Cafe Admin. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminMainNav;