'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm shadow-lg bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center">
          <AlertTriangle className="text-red-500 mr-2 h-5 w-5" />
          <h2 className="text-lg font-medium text-gray-900">Delete Confirmation</h2>
          <button 
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700 mb-3">
            Are you sure you want to delete <span className="font-semibold">{userName}</span>?
          </p>
          <p className="text-gray-500 text-sm">
            This action cannot be undone and will permanently remove this item from your system.
          </p>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;