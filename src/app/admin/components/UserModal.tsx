'use client';

import React from 'react';
import { X } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  title: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
  };
  isEditMode?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  user,
  isEditMode = false
}) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      role: formData.get('role')?.toString() || 'User',
      phone: formData.get('phone')?.toString() || ''
    };
    
    onSave(userData);
  };

  return (
    // Semi-transparent overlay with blur effect
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      {/* Modal container */}
      <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl">
        {/* Modal header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary"
                placeholder="Enter user's full name"
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
                defaultValue={user?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary"
                placeholder="Enter user's email"
                disabled={isEditMode}
                required
              />
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              )}
            </div>
            
            {isEditMode && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  defaultValue={user?.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary"
                  placeholder="Enter phone number"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                defaultValue={user?.role || 'User'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary"
              >
                <option value="User">Customer Account</option>
                <option value="Admin">Admin Account</option>
                {isEditMode && (
                  <option value="Unverified">Unverified Account</option>
                )}
              </select>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brown-primary border border-transparent rounded-md hover:bg-brown-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary transition-colors"
            >
              {isEditMode ? 'Save Changes' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;