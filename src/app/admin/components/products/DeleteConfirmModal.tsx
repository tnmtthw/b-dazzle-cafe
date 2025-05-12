'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmSidePanel: React.FC<DeleteConfirmSidePanelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
      
      {/* Side panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Delete Product</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0 text-red-500 mr-4">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-medium">{itemName}</span>? 
                This action cannot be undone and will permanently remove this product from your inventory.
              </p>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-md border border-red-100 mb-6">
            <p className="text-sm text-red-700">
              Warning: Deleting this product will also remove it from any active orders and analytics data.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmSidePanel;