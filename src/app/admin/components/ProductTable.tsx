'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  Coffee,
  ChevronDown
} from 'lucide-react';
import ProductModal from './products/ProductModal';
import DeleteConfirmModal from './products/DeleteConfirmModal';

// Product interface
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: string;
  sales: number;
  image: string;
  status: 'Active' | 'Inactive';
  description?: string;
}

const ProductTable: React.FC = () => {
  // Sample products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Cappuccino',
      category: 'Espresso',
      price: 120,
      stock: 'In Stock',
      sales: 250,
      image: '/img/products/coffee.png',
      status: 'Active',
      description: 'A classic Italian coffee drink prepared with espresso, hot milk, and steamed-milk foam'
    },
    {
      id: '2',
      name: 'Caramel Macchiato',
      category: 'Espresso',
      price: 140,
      stock: 'In Stock',
      sales: 180,
      image: '/img/products/coffee.png',
      status: 'Active',
      description: 'Espresso with steamed milk and vanilla, topped with caramel sauce'
    },
    {
      id: '3',
      name: 'Chicken Sandwich',
      category: 'Snacks',
      price: 130,
      stock: 'Low Stock',
      sales: 95,
      image: '/img/products/coffee.png',
      status: 'Active',
      description: 'Grilled chicken with lettuce, tomato, and special sauce on freshly baked bread'
    },
    {
      id: '4',
      name: 'Chocolate Croissant',
      category: 'Snacks',
      price: 85,
      stock: 'Out of Stock',
      sales: 120,
      image: '/img/products/coffee.png',
      status: 'Inactive',
      description: 'Buttery croissant filled with rich chocolate'
    },
    {
      id: '5',
      name: 'Spaghetti Carbonara',
      category: 'Pasta',
      price: 180,
      stock: 'In Stock',
      sales: 75,
      image: '/img/products/coffee.png',
      status: 'Active',
      description: 'Classic Italian pasta with eggs, cheese, bacon, and black pepper'
    }
  ]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // State for sorting
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  
  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Handle opening add product modal
  const handleAddProduct = () => {
    setModalType('add');
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  // Handle opening edit product modal
  const handleEditProduct = (product: Product) => {
    setModalType('edit');
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Handle product deletion
  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
    }
  };

  // Handle saving a product (add or edit)
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (modalType === 'add') {
      // Create a new product with a generated ID
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name || '',
        category: productData.category || 'Espresso',
        price: productData.price || 0,
        stock: productData.stock || 'In Stock',
        sales: 0,
        image: productData.image || '/img/products/coffee.png',
        status: productData.status || 'Active',
        description: productData.description
      };
      
      setProducts([...products, newProduct]);
    } else if (modalType === 'edit' && editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productData } 
          : p
      ));
    }
    
    setIsModalOpen(false);
  };

  // Handle sorting
  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  // Categories for filtering
  const categories = [
    'All',
    'Espresso',
    'Non Espresso',
    'Classic hot',
    'Rice Meals',
    'Snacks',
    'Pasta'
  ];

  // Apply filters and sorting
  const filteredAndSortedProducts = [...products]
    // Filter by search term
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Filter by category
    .filter(product => 
      selectedCategory === 'All' || product.category === selectedCategory
    )
    // Filter by status
    .filter(product => 
      selectedStatus === 'All' || product.status === selectedStatus
    )
    // Sort by field
    .sort((a, b) => {
      // Handle string and number sorting differently
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        const aValue = ((a[sortField] as string) || '').toLowerCase();
        const bValue = ((b[sortField] as string) || '').toLowerCase();
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Handle numeric or other values with null checks
        const aValue = a[sortField] ?? 0; // Use nullish coalescing to provide a default value
        const bValue = b[sortField] ?? 0;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        // Handle mixed or non-numeric types safely
        const aStr = String(aValue);
        const bStr = String(bValue);
        return sortDirection === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-primary hover:bg-brown-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          {/* Search */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Filter dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category filter */}
            <div className="w-full sm:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Coffee className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Status filter */}
            <div className="w-full sm:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-primary focus:border-brown-primary sm:text-sm appearance-none"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Reset filters button */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
              disabled={!searchTerm && selectedCategory === 'All' && selectedStatus === 'All'}
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Products table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('name')}
                    className="group flex items-center space-x-1"
                  >
                    <span>Product</span>
                    <span className="flex flex-col">
                      <ArrowUp 
                        className={`h-3 w-3 ${sortField === 'name' && sortDirection === 'asc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                      <ArrowDown 
                        className={`h-3 w-3 -mt-1 ${sortField === 'name' && sortDirection === 'desc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('category')}
                    className="group flex items-center space-x-1"
                  >
                    <span>Category</span>
                    <span className="flex flex-col">
                      <ArrowUp 
                        className={`h-3 w-3 ${sortField === 'category' && sortDirection === 'asc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                      <ArrowDown 
                        className={`h-3 w-3 -mt-1 ${sortField === 'category' && sortDirection === 'desc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('price')}
                    className="group flex items-center space-x-1"
                  >
                    <span>Price</span>
                    <span className="flex flex-col">
                      <ArrowUp 
                        className={`h-3 w-3 ${sortField === 'price' && sortDirection === 'asc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                      <ArrowDown 
                        className={`h-3 w-3 -mt-1 ${sortField === 'price' && sortDirection === 'desc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('stock')}
                    className="group flex items-center space-x-1"
                  >
                    <span>Stock</span>
                    <span className="flex flex-col">
                      <ArrowUp 
                        className={`h-3 w-3 ${sortField === 'stock' && sortDirection === 'asc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                      <ArrowDown 
                        className={`h-3 w-3 -mt-1 ${sortField === 'stock' && sortDirection === 'desc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('sales')}
                    className="group flex items-center space-x-1"
                  >
                    <span>Sales</span>
                    <span className="flex flex-col">
                      <ArrowUp 
                        className={`h-3 w-3 ${sortField === 'sales' && sortDirection === 'asc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                      <ArrowDown 
                        className={`h-3 w-3 -mt-1 ${sortField === 'sales' && sortDirection === 'desc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('status')}
                    className="group flex items-center space-x-1"
                  >
                    <span>Status</span>
                    <span className="flex flex-col">
                      <ArrowUp 
                        className={`h-3 w-3 ${sortField === 'status' && sortDirection === 'asc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                      <ArrowDown 
                        className={`h-3 w-3 -mt-1 ${sortField === 'status' && sortDirection === 'desc' ? 'text-brown-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                      />
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No products found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                currentItems.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/img/products/coffee.png';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.description?.substring(0, 30)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₱{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock === 'In Stock' 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredAndSortedProducts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredAndSortedProducts.length}</span> products
                </p>
              </div>
              <div>
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">First</span>
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    // Show current page, first, last, and pages around current
                    const shouldShowPage = 
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      Math.abs(pageNumber - currentPage) <= 1;
                    
                    // Show ellipsis for gaps
                    if (!shouldShowPage) {
                      if (pageNumber === 2 || pageNumber === totalPages - 1) {
                        return (
                          <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          pageNumber === currentPage
                            ? 'bg-brown-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Last</span>
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        modalType={modalType}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        itemName={productToDelete?.name || ''}
      />
    </div>
  );
};

export default ProductTable;