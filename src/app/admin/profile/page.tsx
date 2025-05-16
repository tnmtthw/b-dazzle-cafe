"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Edit,
  Save,
  X,
  LogOut,
  ShieldCheck,
  Clock
} from 'lucide-react';
import EspressoSpinner from "@/components/common/EspressoSpinner";
import toast, { Toaster } from 'react-hot-toast';

const AdminProfilePage = () => {
  const { data: session, status, update } = useSession();

  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update form data when session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        bio: session.user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [session]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show loading toast
    const loadingToast = toast.loading('Updating profile...');

    try {
      const response = await fetch(`/api/auth/profile?id=${session?.user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update session
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name,
            phone: formData.phone,
            bio: formData.bio
          }
        });
      }

      toast.dismiss(loadingToast);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Changing password...');

    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.dismiss(loadingToast);
      toast.success('Password changed successfully');
      setIsChangingPassword(false);

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to change password');
      console.error('Error changing password:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    signOut();
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

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Profile</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-brown-primary to-brown-primary-hover h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="bg-white rounded-full p-2 shadow-md w-24 h-24 flex items-center justify-center">
              <div className="bg-yellow-primary rounded-full w-20 h-20 flex items-center justify-center">
                <span className="text-3xl font-bold text-brown-primary">
                  {session?.user?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Administrator
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 pb-6 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{session?.user?.name}</h2>
              <p className="text-gray-600">{session?.user?.email}</p>

              {/* Account creation date - in a real app, this would come from the user object */}
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Member since January 2023</span>
              </div>
            </div>

            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4 mr-1" />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-brown-primary hover:text-brown-primary-hover"
              >
                <Edit className="h-4 w-4 mr-1" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Main Profile Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 mb-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className="w-full border-gray-300 rounded-lg shadow-sm bg-gray-50"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  placeholder="+63 900 000 0000"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                  placeholder="Tell us a bit about yourself"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-primary hover:bg-brown-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

                  <div className="space-y-4">
                    <div className="flex">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="mt-1">{session?.user?.name}</p>
                      </div>
                    </div>

                    <div className="flex">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1">{session?.user?.email}</p>
                      </div>
                    </div>

                    <div className="flex">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="mt-1">{session?.user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account</h3>

                  <div className="space-y-4">
                    <div className="flex">
                      <ShieldCheck className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Role</p>
                        <p className="mt-1">Administrator</p>
                      </div>
                    </div>

                    <div className="flex">
                      <Lock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Password</p>
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="mt-1 text-brown-primary hover:text-brown-primary-hover text-sm"
                        >
                          Change password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {session?.user?.bio && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                  <p className="text-gray-700">
                    {session.user.bio}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Password Change Form */}
          {isChangingPassword && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brown-primary focus:border-brown-primary"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-primary hover:bg-brown-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;