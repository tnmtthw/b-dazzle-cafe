"use client";

import React, { useState } from 'react';
import { Edit, Save, X, Check, Plus, Upload, Loader2, Search, Coffee } from 'lucide-react';
import useSWR from 'swr';
import toast, { Toaster } from 'react-hot-toast';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sold: number;
  createdAt: string;
  available?: boolean;
  category?: string;
}

const CATEGORIES = [
  { id: 'espresso', name: 'Espresso' },
  { id: 'non-espresso', name: 'Non Espresso' },
  { id: 'classic-hot', name: 'Classic Hot' },
  { id: 'rice-meals', name: 'Rice Meals' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'pasta', name: 'Pasta' },
];
const DEFAULT_IMAGE = 'https://source.unsplash.com/random/300x200/?coffee';

const ProductControlPage = () => {
  // State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempProduct, setTempProduct] = useState<Partial<Product>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: DEFAULT_IMAGE,
    category: 'espresso'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Data fetching
  const { data: products, error, isLoading, mutate } = useSWR<Product[]>(
    '/api/product', 
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  );

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setTempProduct({ ...product });
  };

  const handleUpdateField = (field: string, value: any) => {
    setTempProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleNewProductField = (field: string, value: any) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = async (productId: string) => {
    try {
      setIsSubmitting(true);
      const toastId = toast.loading('Updating product...');
      
      // In a real app, this would be an API call
      const response = await fetch(`/api/product?id=${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tempProduct, price: Number(tempProduct.price) }),
      });
      
      if (!response.ok) throw new Error('Failed to update product');
      
      mutate(
        products?.map(p => p.id === productId ? { ...p, ...tempProduct, price: Number(tempProduct.price) } : p) || [],
        false
      );
      
      toast.success('Product updated', { id: toastId });
      setEditingId(null);
      setTempProduct({});
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name.trim() || newProduct.price <= 0) {
      toast.error(newProduct.name.trim() ? 'Price must be positive' : 'Name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const toastId = toast.loading('Creating product...');
      
      // In a real app, this would be an API call
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      
      if (!response.ok) throw new Error('Failed to create product');
      
      const createdProduct = await response.json();
      
      mutate([...(products || []), createdProduct], false);
      toast.success('Product created', { id: toastId });
      setIsModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        image: DEFAULT_IMAGE,
        category: 'espresso'
      });
    } catch (error) {
      toast.error('Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const toastId = toast.loading('Updating status...');
      
      // In a real app, this would be an API call
      const response = await fetch(`/api/product?id=${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !product.available }),
      });
      
      if (!response.ok) throw new Error('Failed to update product');
      
      mutate(
        products?.map(p => p.id === product.id ? { ...p, available: !p.available } : p) || [],
        false
      );
      
      toast.success('Status updated', { id: toastId });
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleImageUpload = async () => {
    setIsUploading(true);
    // In a real app, this would upload to a storage service
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
    handleNewProductField('image', `${DEFAULT_IMAGE}&t=${Date.now()}`);
    setIsUploading(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const toastId = toast.loading('Deleting product...');
      
      const response = await fetch(`/api/product?id=${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      mutate(
        products?.filter(p => p.id !== productId) || [],
        false
      );
      
      toast.success('Product deleted', { id: toastId });
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <Toaster position="bottom-right" />

  
      {/* Products Header */}
      <div className="bg-white shadow-sm rounded-lg p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-brown-primary/30"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="text-sm text-gray-500">{filteredProducts?.length || 0} products</div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brown-primary hover:bg-brown-primary-hover text-white py-2.5 px-4 rounded-lg flex items-center justify-center shadow-sm transition-colors"
        >
          <Plus className="h-5 w-5 mr-1.5" />
          New Product
        </button>
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-brown-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200 text-red-700 m-6">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className={`${editingId === product.id ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                      {/* Product */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === product.id ? (
                          <input
                            type="text"
                            value={tempProduct.name || ''}
                            onChange={(e) => handleUpdateField('name', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brown-primary/40 focus:outline-none text-sm"
                          />
                        ) : (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="h-10 w-10 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 flex items-center justify-center bg-gray-200">
                                  {product.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                          </div>
                        )}
                      </td>
                      
                      {/* Description */}
                      <td className="px-6 py-4">
                        {editingId === product.id ? (
                          <textarea
                            value={tempProduct.description || ''}
                            onChange={(e) => handleUpdateField('description', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brown-primary/40 focus:outline-none text-sm"
                            rows={2}
                          />
                        ) : (
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-md">{product.description}</div>
                        )}
                      </td>
                      
                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === product.id ? (
                          <div className="flex items-center">
                            <span className="text-gray-600 mr-1">₱</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={tempProduct.price || 0}
                              onChange={(e) => handleUpdateField('price', parseFloat(e.target.value))}
                              className="w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-brown-primary/40 focus:outline-none text-sm"
                            />
                          </div>
                        ) : (
                          <div className="text-sm font-medium">₱{product.price?.toFixed(2)}</div>
                        )}
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === product.id ? (
                          <select
                            value={tempProduct.available === false ? 'unavailable' : 'available'}
                            onChange={(e) => handleUpdateField('available', e.target.value === 'available')}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brown-primary/40 focus:outline-none text-sm"
                          >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full ${
                            product.available !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.available !== false ? 'Available' : 'Unavailable'}
                          </span>
                        )}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {editingId === product.id ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSaveProduct(product.id)}
                              disabled={isSubmitting}
                              className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-md flex items-center justify-center shadow-sm transition-colors"
                            >
                              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </button>
                            <button 
                              onClick={() => {setEditingId(null); setTempProduct({});}}
                              className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-1.5 px-3 rounded-md flex items-center justify-center shadow-sm transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              disabled={editingId !== null}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleAvailability(product)}
                              className={`p-1.5 rounded-md transition-colors ${
                                product.available !== false ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={product.available !== false ? 'Mark as unavailable' : 'Mark as available'}
                            >
                              {product.available !== false ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      {searchTerm ? (
                        <>
                          <Search className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-500 font-medium">No products match your search</p>
                        </>
                      ) : (
                        <>
                          <div className="h-32 mx-auto mb-3 opacity-60 flex items-center justify-center">
                            <Coffee className="h-24 w-24 text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-medium">No products available</p>
                          <p className="text-gray-400 text-sm mt-1">Click "New Product" to add one</p>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-10">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="border rounded-lg h-40 mb-2 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {newProduct.image && (
                    <img 
                      src={newProduct.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                    />
                  )}
                </div>
                <button
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="w-full py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              
              {/* Form Fields */}
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => handleNewProductField('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-primary/40"
                placeholder="Product name*"
              />
              
              <div className="flex items-center">
                <span className="mr-2">₱</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => handleNewProductField('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-primary/40"
                  placeholder="Price*"
                />
              </div>
              
              <select
                value={newProduct.category}
                onChange={(e) => handleNewProductField('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-primary/40"
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              <textarea
                value={newProduct.description}
                onChange={(e) => handleNewProductField('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-primary/40"
                rows={3}
                placeholder="Description"
              />
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={isSubmitting}
                className="px-4 py-2 bg-brown-primary text-white rounded-lg hover:bg-brown-primary-hover shadow-sm transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductControlPage;