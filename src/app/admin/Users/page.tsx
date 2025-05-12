'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, RefreshCw, UserPlus, Filter, Download } from 'lucide-react';
import UserTable, { User, UserRole } from '../components/UserTable';
import UserEditModal from '../components/UserEditModal';
import UserDeleteModal from '../components/UserDeleteModal';
import EspressoSpinner from '@/component/EspressoSpinner';
import toast, { Toaster } from 'react-hot-toast';

// Sample users for testing - in a real app this would come from an API
const sampleUsers: User[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'Admin', 
    phone: '+1234567890',
    createdAt: new Date().toISOString(),
    verified: true
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'User', 
    phone: '+0987654321',
    createdAt: new Date().toISOString(),
    verified: true
  },
  { 
    id: '3', 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    role: 'Unverified',
    phone: '',
    createdAt: new Date().toISOString(),
    verified: false
  },
];

const UserManagementPage = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [users, setUsers] = useState<User[]>(sampleUsers);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // This would be replaced with API fetching in a real application
  const refreshUsers = async () => {
    setIsRefreshing(true);
    // Simulate API request
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('User list refreshed');
    }, 1000);
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
    
    // Simulate API request delay
    setTimeout(() => {
      toast.dismiss(loadingToast);
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast.success(`Account type updated to ${newRole}`);
    }, 1000);
  };

  const handleDeleteConfirm = async () => {
    if (!currentUser) return;
    
    // Show loading toast
    const loadingToast = toast.loading('Deleting account...');
    
    // Simulate API request delay
    setTimeout(() => {
      toast.dismiss(loadingToast);
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== currentUser.id));
      toast.success('Account deleted successfully');
      setIsDeleteModalOpen(false);
    }, 1000);
  };

  const handleAddUser = (userData: any) => {
    // Show loading toast
    const loadingToast = toast.loading('Creating account...');
    
    // Simulate API request delay
    setTimeout(() => {
      toast.dismiss(loadingToast);
      
      // Create a new user with a unique ID
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        verified: userData.role !== 'Unverified'
      };
      
      // Update local state
      setUsers(prev => [...prev, newUser]);
      
      toast.success('Account created successfully');
      setIsAddModalOpen(false);
    }, 1000);
  };

  const handleUpdateUser = (userData: any) => {
    if (!currentUser) return;
    
    // Show loading toast
    const loadingToast = toast.loading('Updating account...');
    
    // Simulate API request delay
    setTimeout(() => {
      toast.dismiss(loadingToast);
      
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
        users={filteredUsers}
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
      />
      
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