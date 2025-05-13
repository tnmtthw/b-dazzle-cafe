'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, RefreshCw, UserPlus, Filter, Download } from 'lucide-react';

import UserTable, { User, UserRole } from '../components/UserTable';
import UserEditModal from '../components/UserEditModal';
import UserDeleteModal from '../components/UserDeleteModal';
import toast, { Toaster } from 'react-hot-toast';

import { useUser } from "@/data/user";
import EspressoSpinner from '@/component/EspressoSpinner';

const UserManagementPage = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Fetch users data with SWR hook
  const { data: fetchedUsers, error, isLoading, mutate } = useUser();

  // Local state for users that initializes from fetched data
  const [users, setUsers] = useState<User[]>([]);

  // Effect to sync users state with fetched data
  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Refresh users from the API
  const refreshUsers = async () => {
    setIsRefreshing(true);
    try {
      await mutate(); // This will re-fetch the data using SWR
      toast.success('User list refreshed');
    } catch (error) {
      toast.error('Failed to refresh user list');
      console.error('Error refreshing users:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handler for delete action - explicitly takes a string userId
  const handleDeleteUser = (userId: string) => {
    // Find the user by ID
    const userToDelete = users.find(user => user.id === userId);
    if (userToDelete) {
      setCurrentUser(userToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  // Handler for edit action - explicitly takes a User object
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  // Handler for role change - takes a userId string
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // Show loading toast
    const loadingToast = toast.loading('Updating account type...');

    try {
      // API call to update user role
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?id=${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Update local state - set verified status based on role
      setUsers(prev => prev.map(user =>
        user.id === userId ? {
          ...user,
          role: newRole,
          verified: newRole !== 'Unverified' // Set verified based on role
        } : user
      ));

      toast.success(`Account type updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update account type');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentUser) return;

    // Show loading toast
    const loadingToast = toast.loading('Deleting account...');

    try {
      // API call to delete user
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?id=${currentUser.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== currentUser.id));
      toast.success('Account deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete account');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleAddUser = async (userData: any) => {
    // Show loading toast
    const loadingToast = toast.loading('Creating account...');

    try {
      // API call to create user
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const newUser = await response.json();

      // Update local state
      setUsers(prev => [...prev, newUser]);
      toast.success('Account created successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create account');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!currentUser) return;

    // Show loading toast
    const loadingToast = toast.loading('Updating account...');

    try {
      // API call to update user
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?id=${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update local state
      setUsers(prev => prev.map(user =>
        user.id === currentUser.id
          ? {
            ...user,
            name: userData.name,
            role: userData.role as UserRole,
            phone: userData.phone || '',
            verified: userData.role !== 'Unverified'
          }
          : user
      ));

      toast.success('Account updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update account');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EspressoSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">Failed to load user data. Please try again later.</p>
          <button
            onClick={refreshUsers}
            className="bg-brown-primary text-white px-4 py-2 rounded-lg hover:bg-brown-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
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

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

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
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brown-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-brown-primary-hover transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Account
          </button>
          <button
            onClick={refreshUsers}
            disabled={isRefreshing}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* User Table */}
      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No users found. Add a new user to get started.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brown-primary text-white px-4 py-2 rounded-lg inline-flex items-center hover:bg-brown-primary-hover transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add First Account
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No users match your search criteria.</p>
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
        />
      )}

      {/* Add User Modal */}
      <UserEditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddUser}
        user={undefined}
      />

      {/* Edit User Modal */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateUser}
        user={currentUser || undefined}
      />

      {/* Delete Confirmation Modal */}
      <UserDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        userName={currentUser?.name || ''}
      />
    </div>
  );
};

export default UserManagementPage;