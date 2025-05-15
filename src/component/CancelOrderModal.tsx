'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

// Define the cancellation reasons
export const cancellationReasons: string[] = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Duplicate order",
  "Taking too long to process",
  "Financial reasons",
  "No longer needed",
  "Other (please specify)"
];

// Interface for CancelOrderModal props
interface CancelOrderModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: string;
  onClose: () => void;
  onCancel: (orderId: string, reason: string, additionalInfo: string) => Promise<void>;
}

/**
 * Cancel Order Modal Component
 * 
 * This component displays a modal to confirm order cancellation and collect a reason.
 */
export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ 
  isOpen, 
  orderId, 
  orderNumber, 
  onClose, 
  onCancel 
}) => {
  // State
  const [reason, setReason] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setAdditionalInfo('');
      setIsProcessing(false);
    }
  }, [isOpen, orderId]);

  // Handle form submission
  const handleSubmit = async (): Promise<void> => {
    if (!reason) {
      return; // Validation: Reason is required
    }

    if (reason === "Other (please specify)" && !additionalInfo.trim()) {
      return; // Validation: Additional info required for "Other"
    }

    setIsProcessing(true);
    try {
      await onCancel(orderId, reason, additionalInfo);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blur bg-opacity-20 backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="text-amber-500 h-5 w-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            disabled={isProcessing}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="px-6 py-4">
          <p className="mb-4 text-gray-700">
            Are you sure you want to cancel order <span className="font-semibold">{orderNumber}</span>?
            This action cannot be undone.
          </p>
          
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation*
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary"
              disabled={isProcessing}
            >
              <option value="">Select a reason</option>
              {cancellationReasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          {reason === "Other (please specify)" && (
            <div className="mb-4">
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Additional details*
              </label>
              <textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Please provide more details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary"
                rows={3}
                disabled={isProcessing}
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
            disabled={isProcessing}
          >
            Never mind
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={isProcessing || !reason || (reason === "Other (please specify)" && !additionalInfo.trim())}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Cancel Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Interface for CancellationSuccessModal props
interface CancellationSuccessModalProps {
  isOpen: boolean;
  orderNumber: string;
  onClose: () => void;
}

/**
 * Success Modal Component
 * 
 * This component displays a success message after an order has been cancelled.
 */
export const CancellationSuccessModal: React.FC<CancellationSuccessModalProps> = ({ 
  isOpen, 
  orderNumber, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="px-6 py-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Order Cancelled</h3>
          
          <p className="text-gray-600 mb-4">
            Your order <span className="font-semibold">{orderNumber}</span> has been successfully cancelled.
          </p>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brown-primary text-white rounded-md hover:bg-brown-primary-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};