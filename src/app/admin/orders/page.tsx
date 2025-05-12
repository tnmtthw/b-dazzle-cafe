'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, RefreshCw } from 'lucide-react';
import OrderTable, { Order, OrderStatus } from '../components/OrderTable';
import EspressoSpinner from '@/component/EspressoSpinner';
import toast, { Toaster } from 'react-hot-toast';

const AdminOrdersPage = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // This would normally fetch data from an API, but for now we'll use the sample data in OrderTable

  // Filter orders based on search term
  // This is just a mock function since we're using the sample data in OrderTable
  const refreshOrders = async () => {
    setIsRefreshing(true);
    // Simulate API request
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Orders refreshed');
    }, 1000);
  };

  // Mock function for status changes
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // Show loading toast
    const loadingToast = toast.loading('Updating order status...');
    
    // Simulate API request delay
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    }, 1000);
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EspressoSpinner />
      </div>
    );
  }

  // Check if user is admin
  if (session?.user?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="bottom-right" />
      
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={refreshOrders}
            disabled={isRefreshing}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Orders Table */}
      <OrderTable 
        orders={[]} // Pass empty array to use the sample data in OrderTable
        isAdminView={true}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminOrdersPage;