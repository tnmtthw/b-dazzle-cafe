'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ImagePlus, PhilippinePeso, Upload, Loader2 } from 'lucide-react';
import { Product } from "@/lib/type";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product?: Product; // Undefined for adding new products
  modalType: 'add' | 'edit';
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  modalType
}) => {
  // Initial form state
  const initialFormData: Partial<Product> = {
    name: '',
    category: 'Espresso',
    price: 0,
    stock: 'In Stock',
    image: '/img/products/coffee.png',
    status: 'Active',
    description: ''
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('/img/products/coffee.png');

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories
  const categories = [
    'Espresso',
    'Non Espresso',
    'Classic hot',
    'Rice Meals',
    'Snacks',
    'Pasta'
  ];

  // Stock options
  const stockOptions = ['In Stock', 'Low Stock', 'Out of Stock'];

  // Initialize form with product data if editing
  useEffect(() => {
    if (product && modalType === 'edit') {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        status: product.status,
        description: product.description || ''
      });
      setImagePreview(product.image);
    } else {
      // Reset form for add mode
      setFormData(initialFormData);
      setImagePreview('/img/products/coffee.png');
    }

    // Reset file upload state
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
  }, [product, modalType, isOpen]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let parsedValue: string | number | boolean = value;

    // Parse numeric values
    if (name === 'price') {
      parsedValue = parseFloat(value) || 0;
    }

    setFormData({
      ...formData,
      [name]: parsedValue
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle image URL change with preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      image: value
    });

    // Update preview if URL is valid
    if (value) {
      setImagePreview(value);
    } else {
      setImagePreview('/img/products/coffee.png');
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];

      // Validate file is an image
      if (!file.type.match('image.*')) {
        setErrors({
          ...errors,
          file: 'Please select an image file'
        });
        return;
      }

      // Clear any file errors
      if (errors.file) {
        setErrors({
          ...errors,
          file: ''
        });
      }

      setSelectedFile(file);

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload to Vercel Blob
  const uploadFile = async (): Promise<string> => {
    if (!selectedFile) {
      return formData.image || '/img/products/coffee.png';
    }

    try {
      setIsUploading(true);

      // Generate a unique filename - you might want to use a more robust method
      const timestamp = new Date().getTime();
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filename = `products/${timestamp}-${safeName}`;

      // Create a FormData instance for upload
      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'POST',
        body: selectedFile,
        // Optional: track upload progress with extra configuration
        // Not supported in all browsers
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const blob = await response.json();
      setIsUploading(false);
      setUploadProgress(100);

      // Return the URL from the Vercel Blob
      return blob.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      setErrors({
        ...errors,
        file: 'Failed to upload image. Please try again.'
      });
      return formData.image || '/img/products/coffee.png';
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.price === undefined || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // If there's a file selected, upload it
        if (selectedFile) {
          const imageUrl = await uploadFile();
          // Update the form data with the uploaded image URL
          setFormData({
            ...formData,
            image: imageUrl
          });
          // Save the product with the new image URL
          onSave({
            ...formData,
            image: imageUrl
          });
        } else {
          // No file to upload, just save the form data
          onSave(formData);
        }
      } catch (error) {
        console.error('Error during product save:', error);
        // Handle the error appropriately
      }
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    // Semi-transparent overlay with blur effect
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      {/* Modal container */}
      <div className="bg-white rounded-lg w-full max-w-3xl mx-auto shadow-xl">
        {/* Modal header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {modalType === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Image preview */}
            <div className="col-span-1">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div
                  className="mt-1 border-2 border-gray-300 border-dashed rounded-md p-2 h-44 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 text-brown-primary animate-spin mb-2" />
                      <span className="text-sm text-gray-500">Uploading... {uploadProgress}%</span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="max-h-36 max-w-full object-contain"
                        onError={() => setImagePreview('/img/products/coffee.png')}
                      />
                      <div className="mt-2 flex text-sm text-gray-600">
                        <Upload className="mr-1 h-5 w-5 text-gray-400" />
                        <p className="pl-1">Click to upload</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileSelect}
                          disabled={isUploading}
                        />
                      </div>
                    </>
                  )}
                </div>
                {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                {selectedFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImagePlus className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleImageChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
                    placeholder="Or enter image URL"
                  />
                </div>
              </div>
            </div>

            {/* Right column - Product details */}
            <div className="col-span-2 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₱)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhilippinePeso className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
                      required
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Status
                  </label>
                  <select
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
                  >
                    {stockOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brown-primary border border-transparent rounded-md hover:bg-brown-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary transition-colors flex items-center"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Uploading...
                </>
              ) : (
                modalType === 'add' ? 'Add Product' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;