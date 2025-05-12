"use client";

import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Filter, 
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import Link from 'next/link';

// Sample product data
const sampleProducts = [
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
  const [products, setProducts] = useState(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Categories derived from products
  const categories = ['All', ...new Set(products.map(product => product.category))];
  
  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return '';
    }
    return sortConfig.key === name ? sortConfig.direction : '';
  };

  // Sort products
  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig !== null) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  // Filter products
  const filteredProducts = sortedProducts.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (selectedStatus === 'All' || product.status === selectedStatus)
    );
  });

  // Handle row selection
  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedRows(filteredProducts.map(product => product.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (id: string) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(id);
    }
  };

  return (
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
            
            {/* Filter Button */}
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <span>More Filters</span>
            </button>
            
            {/* Add Product Button */}
            <Link
              href="/admin/productcontrol/add"
              className="px-4 py-2 bg-brown-primary text-white rounded-lg flex items-center justify-center hover:bg-brown-primary-hover transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
        
        {/* Bulk Actions - Only show when items are selected */}
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between mt-4 py-2 px-4 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">{selectedRows.length} items</span> selected
            </div>
            
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                Export
              </button>
              <button className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">
                Delete
              </button>
              <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
                Change Status
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-brown-primary focus:ring-brown-primary"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </div>
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
                  {getClassNamesFor('category') === 'ascending' && (
                    <ArrowUp className="h-4 w-4 ml-1" />
                  )}
                  {getClassNamesFor('category') === 'descending' && (
                    <ArrowDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center">
                  Price
                  {getClassNamesFor('price') === 'ascending' && (
                    <ArrowUp className="h-4 w-4 ml-1" />
                  )}
                  {getClassNamesFor('price') === 'descending' && (
                    <ArrowDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                onClick={() => requestSort('stock')}
              >
                <div className="flex items-center">
                  Stock
                  {getClassNamesFor('stock') === 'ascending' && (
                    <ArrowUp className="h-4 w-4 ml-1" />
                  )}
                  {getClassNamesFor('stock') === 'descending' && (
                    <ArrowDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                onClick={() => requestSort('sales')}
              >
                <div className="flex items-center">
                  Sales
                  {getClassNamesFor('sales') === 'ascending' && (
                    <ArrowUp className="h-4 w-4 ml-1" />
                  )}
                  {getClassNamesFor('sales') === 'descending' && (
                    <ArrowDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getClassNamesFor('status') === 'ascending' && (
                    <ArrowUp className="h-4 w-4 ml-1" />
                  )}
                  {getClassNamesFor('status') === 'descending' && (
                    <ArrowDown className="h-4 w-4 ml-1" />
                  )}
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
                      className="h-4 w-4 rounded border-gray-300 text-brown-primary focus:ring-brown-primary"
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
                    <div className="text-sm text-gray-900">{product.sales}</div>
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
                        onClick={() => toggleDropdown(product.id)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                      
                      {dropdownOpen === product.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-left">
                          <Link
                            href={`/admin/productcontrol/${product.id}/view`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-3 text-gray-500" />
                            <span>View Details</span>
                          </Link>
                          <Link
                            href={`/admin/productcontrol/${product.id}/edit`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-3 text-gray-500" />
                            <span>Edit</span>
                          </Link>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
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
                <td colSpan={8} className="px-6 py-10 text-center">
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
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
        
        <div className="hidden md:block">
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1" />
              <span>Export</span>
            </button>
            <button className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-1" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;