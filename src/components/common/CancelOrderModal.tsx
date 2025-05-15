'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { EspressoSpinner } from '@/components/common';

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
  orderTotal?: number;
  orderDate?: string;
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
  orderTotal,
  orderDate,
  onClose, 
  onCancel 
}) => {
  // State
  const [reason, setReason] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setAdditionalInfo('');
      setIsProcessing(false);
      setShowConfirmation(false);
      setValidationError(null);
    }
  }, [isOpen, orderId]);

  // Validate the form
  const validateForm = (): boolean => {
    if (!reason) {
      setValidationError("Please select a reason for cancellation");
      return false;
    }

    if (reason === "Other (please specify)" && !additionalInfo.trim()) {
      setValidationError("Please provide details for your cancellation reason");
      return false;
    }

    setValidationError(null);
    return true;
  };

  // Proceed to confirmation step
  const handleProceedToConfirmation = (): void => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      await onCancel(orderId, reason, additionalInfo);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setShowConfirmation(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative animate-slideUp">
        {/* Close button - positioned absolutely in the top right */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
          disabled={isProcessing}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {!showConfirmation ? (
          <>
            {/* Header */}
            <div className="pt-6 px-6 pb-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="text-amber-500 h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Cancel Order</h3>
              </div>
              <p className="text-gray-600">
                Please select a reason for cancelling your order <span className="font-medium">{orderNumber}</span>
              </p>
            </div>
            
            {/* Order summary */}
            {(orderTotal || orderDate) && (
              <div className="px-6 py-3 bg-gray-50 border-y border-gray-200">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Order number:</span>
                  <span className="font-medium">{orderNumber}</span>
                </div>
                {orderDate && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Date placed:</span>
                    <span>{orderDate}</span>
                  </div>
                )}
                {orderTotal && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">₱{orderTotal.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className="px-6 py-4">
              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional details*
                  </label>
                  <textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Please provide more details about your cancellation reason..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary"
                    rows={3}
                    disabled={isProcessing}
                  />
                </div>
              )}
              
              {/* Validation error */}
              {validationError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-600">{validationError}</p>
                </div>
              )}

              <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-md flex items-start">
                <Info className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Your feedback helps us improve our service. Thank you for letting us know why you're cancelling.
                </p>
              </div>
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
                onClick={handleProceedToConfirmation}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isProcessing || !reason || (reason === "Other (please specify)" && !additionalInfo.trim())}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation Screen */}
            <div className="pt-6 px-6 pb-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="text-red-500 h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Confirm Cancellation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you absolutely sure you want to cancel your order?
              </p>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4">
                <div className="flex items-start mb-2">
                  <span className="text-sm text-gray-600 mr-2">Reason:</span>
                  <span className="text-sm font-medium">{reason}</span>
                </div>
                {reason === "Other (please specify)" && additionalInfo && (
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 mr-2">Details:</span>
                    <span className="text-sm">{additionalInfo}</span>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  This action cannot be undone. Once cancelled, you'll need to place a new order if you change your mind.
                </p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
                disabled={isProcessing}
              >
                Go back
              </button>
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <EspressoSpinner size="sm" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={isProcessing}
                >
                  Yes, Cancel Order
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Interface for CancellationSuccessModal props
interface CancellationSuccessModalProps {
  isOpen: boolean;
  orderNumber: string;
  onClose: () => void;
  onViewOrders?: () => void;
  onContinueShopping?: () => void;
}

/**
 * Success Modal Component
 * 
 * This component displays a success message after an order has been cancelled.
 */
export const CancellationSuccessModal: React.FC<CancellationSuccessModalProps> = ({ 
  isOpen, 
  orderNumber, 
  onClose,
  onViewOrders,
  onContinueShopping
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white bg-opacity-95 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-slideUp">
        <div className="px-6 py-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scaleIn">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Cancelled</h3>
          
          <p className="text-gray-600 mb-6">
            Your order <span className="font-semibold">{orderNumber}</span> has been successfully cancelled.
            A confirmation email will be sent shortly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
            {onContinueShopping && (
              <button
                onClick={onContinueShopping}
                className="px-4 py-2 text-brown-primary bg-white border border-brown-primary rounded-md hover:bg-brown-50 transition-colors w-full sm:w-auto"
              >
                Continue Shopping
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brown-primary text-white rounded-md hover:bg-brown-primary-hover transition-colors w-full sm:w-auto"
            >
              Close
            </button>
          </div>
          
          {onViewOrders && (
            <button
              onClick={onViewOrders}
              className="mt-3 text-sm text-brown-primary hover:underline"
            >
              View all orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 