'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  User as UserIcon,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Define user role types
export type UserRole = 'Admin' | 'User' | 'Unverified';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: string;
  verified: boolean;
}

interface UserTableProps {
  users: User[];
  onRoleChange?: (userId: string, newRole: UserRole) => void;
  onDeleteUser?: (userId: string) => void;
  onEditUser?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users = [],
  onRoleChange,
  onDeleteUser,
  onEditUser
}) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Record<string, UserRole>>({});

  // Toggle user details
  const toggleUserDetails = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle role change selection
  const handleRoleSelect = (userId: string, role: UserRole) => {
    setSelectedRole({ ...selectedRole, [userId]: role });
  };

  // Submit role change
  const handleRoleChange = async (userId: string) => {
    if (!selectedRole[userId]) return;

    try {
      // If onRoleChange is provided, use it
      if (onRoleChange) {
        onRoleChange(userId, selectedRole[userId]);
        return;
      }

      // Otherwise, make direct API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: selectedRole[userId]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Show success notification or refresh data
      alert(`Role updated successfully to ${selectedRole[userId]}`);
      // Refresh page or data
      window.location.reload();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    }
  };

  // Default Edit handler with simple alert
  const defaultEditUser = (user: User) => {
    console.log(`Edit user`, user);
    // Could implement a simple edit form here
    alert(`Edit functionality for user ${user.name} would be implemented here`);
  };

  // Default Delete handler using the API endpoint
  const defaultDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'} /api/user ? id = ${userId} `, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      alert('User deleted successfully');
      // Refresh page or data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Use provided handlers or defaults
  const handleRoleChangeSubmit = onRoleChange || handleRoleChange;
  const handleDeleteUser = onDeleteUser || defaultDeleteUser;
  const handleEditUser = onEditUser || defaultEditUser;

  // Get status badge for verification status based on role
  const getVerificationBadge = (user: User) => {
    if (user.role === 'Unverified') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Unverified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </span>
      );
    }
  };

  // Get status badge for user role
  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      'Admin': {
        color: 'bg-purple-100 text-purple-800',
        label: 'Admin Account'
      },
      'User': {
        color: 'bg-blue-100 text-blue-800',
        label: 'Customer Account'
      },
      'Unverified': {
        color: 'bg-gray-100 text-gray-800',
        label: 'Unverified Account'
      }
    };

    const config = roleConfig[role];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <ShieldCheck className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verification
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-brown-primary text-white rounded-full flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getVerificationBadge(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleUserDetails(user.id)}
                        className="text-brown-primary hover:text-brown-primary-hover transition-colors"
                      >
                        {expandedUser === user.id ? <ChevronUp /> : <ChevronDown />}
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedUser === user.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Details */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">User Details</h4>
                          <div className="bg-white rounded-lg shadow p-4 space-y-3">
                            <div className="flex items-start">
                              <UserIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Full Name</p>
                                <p className="text-sm text-gray-600">{user.name}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                            {user.phone && (
                              <div className="flex items-start">
                                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Phone</p>
                                  <p className="text-sm text-gray-600">{user.phone}</p>
                                </div>
                              </div>
                            )}
                            {user.address && (
                              <div className="flex items-start">
                                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Address</p>
                                  <p className="text-sm text-gray-600">{user.address}</p>
                                </div>
                              </div>
                            )}
                            {user.bio && (
                              <div className="flex items-start">
                                <UserIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Bio</p>
                                  <p className="text-sm text-gray-600">{user.bio}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* User Management */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">User Management</h4>
                          <div className="bg-white rounded-lg shadow p-4">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Change Account Type
                              </label>
                              <div className="flex space-x-2">
                                <select
                                  className="rounded-lg border-gray-300 shadow-sm block w-full focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
                                  value={selectedRole[user.id] || user.role}
                                  onChange={(e) => handleRoleSelect(user.id, e.target.value as UserRole)}
                                >
                                  <option value="Admin">Admin Account</option>
                                  <option value="User">Customer Account</option>
                                  <option value="Unverified">Unverified Account</option>
                                </select>
                                <button
                                  onClick={() => handleRoleChangeSubmit(user.id, selectedRole[user.id] || user.role)}
                                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-brown-primary hover:bg-brown-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
                                >
                                  Update
                                </button>
                              </div>
                            </div>

                            {user.role === 'Unverified' && (
                              <div className="mb-4">
                                <button
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?id=${user.id}`, {
                                        method: 'PATCH',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          role: 'User',
                                        }),
                                      });

                                      if (!response.ok) throw new Error('Failed to verify user');

                                      alert('User verified successfully');
                                      window.location.reload();
                                    } catch (error) {
                                      console.error('Error verifying user:', error);
                                      alert('Failed to verify user');
                                    }
                                  }}
                                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
                                >
                                  <CheckCircle className="mr-2 h-5 w-5" />
                                  Manually Verify User
                                </button>
                              </div>
                            )}

                            <div>
                              <button
                                onClick={async () => {
                                  if (!confirm('Are you sure you want to delete this user?')) return;

                                  try {
                                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
                                      method: 'DELETE',
                                    });

                                    if (!response.ok) throw new Error('Failed to delete user');

                                    alert('User deleted successfully');
                                    window.location.reload();
                                  } catch (error) {
                                    console.error('Error deleting user:', error);
                                    alert('Failed to delete user');
                                  }
                                }}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full"
                              >
                                <XCircle className="mr-2 h-5 w-5" />
                                Delete Account
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;