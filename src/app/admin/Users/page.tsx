'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, RefreshCw, UserPlus, Filter, Download } from 'lucide-react';
import UserTable, { User, UserRole } from '../components/UserTable';
import EspressoSpinner from '@/component/EspressoSpinner';
import toast, { Toaster } from 'react-hot-toast';

const UserManagementPage = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // This would be replaced with API fetching in a real application
  const refreshUsers = async () => {
    setIsRefreshing(true);
    // Simulate API request
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('User list refreshed');
    }, 1000);
  };

  // Handlers for user management
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // Show loading toast
    const loadingToast = toast.loading('Updating account type...');
    
    // Simulate API request delay
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success(`Account type updated to ${newRole}`);
    }, 1000);
  };

  const handleDeleteUser = async (userId: string) => {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading('Deleting account...');
    
    // Simulate API request delay
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success('Account deleted successfully');
    }, 1000);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setShowEditUserModal(true);
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage admin accounts and customer accounts</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-brown-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-brown-primary-hover transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Account
          </button>
          <button
            onClick={refreshUsers}
            disabled={isRefreshing}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent appearance-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All User Types</option>
            <option value="Admin">Admin Accounts</option>
            <option value="User">Customer Accounts</option>
            <option value="Unverified">Unverified Accounts</option>
          </select>
        </div>
      </div>
      
      {/* User Table */}
      <UserTable 
        users={[]} // Empty array will use sample data from UserTable
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
      />
      
      {/* Add User Modal - in a real app, this would be a separate component */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  placeholder="Enter user's full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  placeholder="Enter user's email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary">
                  <option value="User">Customer Account</option>
                  <option value="Admin">Admin Account</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Account added successfully');
                    setShowAddUserModal(false);
                  }}
                  className="px-4 py-2 bg-brown-primary text-white rounded-lg hover:bg-brown-primary-hover"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal - in a real app, this would be a separate component */}
      {showEditUserModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Account: {currentUser.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  defaultValue={currentUser.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  defaultValue={currentUser.email}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  defaultValue={currentUser.phone || ''}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  defaultValue={currentUser.role}
                >
                  <option value="User">Customer Account</option>
                  <option value="Admin">Admin Account</option>
                  <option value="Unverified">Unverified Account</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Account updated successfully');
                    setShowEditUserModal(false);
                  }}
                  className="px-4 py-2 bg-brown-primary text-white rounded-lg hover:bg-brown-primary-hover"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;