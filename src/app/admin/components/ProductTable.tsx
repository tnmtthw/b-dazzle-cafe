"use client";

import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Plus,
  ArrowUp,
  ArrowDown,
  Download
} from 'lucide-react';
import ProductModal from './products/ProductModal';
import DeleteConfirmationModal from './products/DeleteConfirmModal';

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

// Sample product data
const sampleProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Cappuccino',
    category: 'Espresso',
    price: 150.00,
    stock: 'In Stock',
    sales: 158,
    image: '/img/products/coffee.png',
    status: 'Active'
  },
  {
    id: 'PROD-002',
    name: 'Espresso',
    category: 'Espresso',
    price: 120.00,
    stock: 'In Stock',
    sales: 132,
    image: '/img/products/coffee.png',
    status: 'Active'
  },
  {
    id: 'PROD-003',
    name: 'Caffè Mocha',
    category: 'Espresso',
    price: 170.00,
    stock: 'Low Stock',
    sales: 89,
    image: '/img/products/coffee.png',
    status: 'Active'
  },
  {
    id: 'PROD-004',
    name: 'Caramel Macchiato',
    category: 'Espresso',
    price: 175.00,
    stock: 'In Stock',
    sales: 142,
    image: '/img/products/coffee.png',
    status: 'Active'
  },
  {
    id: 'PROD-005',
    name: 'Caffè Latte',
    category: 'Espresso',
    price: 160.00,
    stock: 'In Stock',
    sales: 116,
    image: '/img/products/coffee.png',
    status: 'Active'
  },
  {
    id: 'PROD-006',
    name: 'Pancit Canton',
    category: 'Rice Meals',
    price: 200.00,
    stock: 'Out of Stock',
    sales: 45,
    image: '/img/products/coffee.png',
    status: 'Inactive'
  },
  {
    id: 'PROD-007',
    name: 'Chicken Sandwich',
    category: 'Snacks',
    price: 120.00,
    stock: 'In Stock',
    sales: 98,
    image: '/img/products/coffee.png',
    status: 'Active'
  },
];

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);

  // Categories derived from products
  const categories = ['All', ...Array.from(new Set(products.map(product => product.category)))];
  
  // Handle sorting
  const requestSort = (key: keyof Product) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort and filter products
  const filteredProducts = React.useMemo(() => {
    let sortableProducts = [...products];
    
    // Apply search filter
    if (searchTerm) {
      sortableProducts = sortableProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      sortableProducts = sortableProducts.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Apply status filter
    if (selectedStatus !== 'All') {
      sortableProducts = sortableProducts.filter(product => 
        product.status === selectedStatus
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      sortableProducts.sort((a, b) => {
        // Fix for TypeScript errors: Ensure we're comparing with safe values
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle undefined values by providing default values based on the type
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (bValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableProducts;
  }, [products, searchTerm, selectedCategory, selectedStatus, sortConfig]);

  // Handle row selection
  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? filteredProducts.map(p => p.id) : []);
  };

  // Modal handlers
  const openAddModal = () => {
    setCurrentProduct(undefined);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  const openDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };
  
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (isAddModalOpen) {
      // Generate a new ID for new products
      const newProduct = {
        ...productData,
        id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
        sales: 0
      } as Product;
      
      setProducts([...products, newProduct]);
      setIsAddModalOpen(false);
    } else if (isEditModalOpen && currentProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === currentProduct.id ? { ...p, ...productData } : p
      ));
      setIsEditModalOpen(false);
    }
  };
  
  const handleDeleteProduct = () => {
    if (currentProduct) {
      setProducts(products.filter(p => p.id !== currentProduct.id));
      setIsDeleteModalOpen(false);
    }
  };
  
  const handleBulkDelete = () => {
    setProducts(products.filter(p => !selectedRows.includes(p.id)));
    setSelectedRows([]);
    setSelectAll(false);
  };

  // Render sort indicator
  const renderSortIcon = (key: keyof Product) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Products</h2>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-stretch md:items-center">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
              
              {/* Status Filter */}
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
              
              {/* Add Product Button */}
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-brown-primary text-white rounded-lg flex items-center justify-center hover:bg-brown-primary-hover transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
          
          {/* Bulk Actions - Only show when items are selected */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between mt-4 py-2 px-4 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">{selectedRows.length} items</span> selected
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Export
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-brown-primary focus:ring-brown-primary"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Product
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {renderSortIcon('category')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {renderSortIcon('price')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                  onClick={() => requestSort('stock')}
                >
                  <div className="flex items-center">
                    Stock
                    {renderSortIcon('stock')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-brown-primary focus:ring-brown-primary"
                        checked={selectedRows.includes(product.id)}
                        onChange={() => toggleSelectRow(product.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₱{product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.stock === 'In Stock' ? 'bg-green-100 text-green-800' : 
                          product.stock === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === product.id ? null : product.id)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>
                        
                        {activeDropdown === product.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-left">
                            <button
                              onClick={() => openEditModal(product)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-3 text-gray-500" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => openDeleteModal(product)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash2 className="h-4 w-4 mr-3 text-red-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <div className="text-gray-500">
                      <p className="text-base font-medium">No products found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> products
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 bg-brown-primary text-white rounded-md text-sm hover:bg-brown-primary-hover">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
          
          <div className="hidden md:block">
            <button className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveProduct}
        modalType="add"
      />
      
      <ProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={currentProduct} 
        onSave={handleSaveProduct}
        modalType="edit"
      />
      
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        itemName={currentProduct?.name || ''}
      />
    </>
  );
};

export default ProductTable;