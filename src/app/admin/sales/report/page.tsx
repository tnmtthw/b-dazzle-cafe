"use client";

import React, { useState, useEffect } from 'react';
import { useDasboard, useRecent, useTopOrder } from "@/data/dashboard";
import { Order } from '@/lib/type';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowLeft,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { generateSalesReportPDF } from './generatePDF';

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';

const SalesReportPage = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Set default custom dates to current month
  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setCustomStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    setCustomEndDate(lastDayOfMonth.toISOString().split('T')[0]);

    // Set default time range to 'all' to show all data initially
    setSelectedTimeRange('all');
  }, []);

  // Fetch data using the same hooks as AdminDashboard
  const { data: countData } = useDasboard() || { data: null };
  const { data: recentData } = useRecent() || { data: null };
  const { data: TopOrderData } = useTopOrder() || { data: null };

  // Set default values if data is undefined
  const defaultCount = countData || {
    orders: 0,
    users: 0,
    revenue: 0,
    productsSold: 0
  };

  const allRecentOrders = recentData || [];
  const allTopProducts = Array.isArray(TopOrderData) ? TopOrderData : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate date range based on selected time period
  const getDateRange = (timeRange: TimeRange) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeRange) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDate = new Date(now.getFullYear(), now.getMonth(), diff);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Beginning of time
        break;
    }

    return { startDate, endDate };
  };

  // Get formatted date range string for display
  const getDateRangeString = (timeRange: TimeRange) => {
    if (timeRange === 'custom' && customStartDate && customEndDate) {
      const startStr = new Date(customStartDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const endStr = new Date(customEndDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return `${startStr} - ${endStr}`;
    }

    const { startDate, endDate } = getDateRange(timeRange);

    if (timeRange === 'all') {
      return 'All Time';
    }

    const startStr = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const endStr = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `${startStr} - ${endStr}`;
  };

  // Get date range for custom dates
  const getCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      return {
        start: new Date(customStartDate),
        end: new Date(customEndDate)
      };
    }
    const { startDate, endDate } = getDateRange(selectedTimeRange);
    return {
      start: startDate,
      end: endDate
    };
  };

  // Filter data based on selected time range
  const getFilteredData = () => {
    const { start, end } = getCustomDateRange();

    // Debug logging
    console.log('Filtering data:', {
      selectedTimeRange,
      start: start.toISOString(),
      end: end.toISOString(),
      totalOrders: allRecentOrders.length,
      sampleOrderDate: allRecentOrders[0]?.createdAt
    });

    // Filter orders within the date range
    const filteredOrders = allRecentOrders.filter((order: Order) => {
      const orderDate = new Date(order.createdAt);
      // Set time to start of day for comparison
      const orderStartOfDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
      const startStartOfDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endStartOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      const isInRange = orderStartOfDay >= startStartOfDay && orderStartOfDay <= endStartOfDay;

      if (selectedTimeRange === 'all') {
        return true; // Show all orders for "All Time"
      }

      return isInRange;
    });

    console.log('Filtered orders:', filteredOrders.length);

    // Recalculate summary statistics based on filtered orders
    const filteredCount = {
      orders: filteredOrders.length,
      users: new Set(filteredOrders.map((order: Order) => order.user?.id)).size,
      revenue: filteredOrders.reduce((sum: number, order: Order) => sum + order.total, 0),
      productsSold: filteredOrders.reduce((sum: number, order: Order) => {
        // Assuming order has items array, if not, default to 1
        return sum + (order.items?.length || 1);
      }, 0)
    };

    return {
      filteredOrders,
      filteredTopProducts: [], // Remove top products
      filteredCount
    };
  };

  const { filteredOrders, filteredTopProducts, filteredCount } = getFilteredData();

  // Use filtered data for display and PDF generation
  const recentOrders = filteredOrders;
  const topProducts = filteredTopProducts;
  const count = filteredCount;

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { start, end } = getCustomDateRange();
      await generateSalesReportPDF({
        count,
        recentOrders,
        topProducts,
        generatedAt: new Date().toLocaleString(),
        timeRange: selectedTimeRange,
        dateRange: {
          start,
          end
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/dashboard"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
            <p className="text-gray-600 mt-1">Comprehensive overview of your store's performance</p>
          </div>
        </div>
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          className="px-6 py-3 bg-brown-primary text-white rounded-lg flex items-center space-x-2 hover:bg-brown-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-800">Select Time Range</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Date Range */}
          <div className="md:col-span-1">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-gray-700">Custom Date Range</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="End Date"
              />
              <button
                onClick={() => {
                  if (customStartDate && customEndDate) {
                    if (new Date(customStartDate) <= new Date(customEndDate)) {
                      setSelectedTimeRange('custom');
                    } else {
                      alert('Start date must be before or equal to end date');
                    }
                  } else {
                    alert('Please select both start and end dates');
                  }
                }}
                disabled={!customStartDate || !customEndDate}
                className="px-3 py-2 bg-brown-primary text-white rounded-lg text-sm hover:bg-brown-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Custom Range
              </button>
            </div>
          </div>

          {/* Status Information */}
          <div className="md:col-span-1">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-medium">{getDateRangeString(selectedTimeRange)}</span>
              </p>
              <p className="text-xs text-blue-600">
                Showing {filteredOrders.length} orders from {allRecentOrders.length} total orders
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTimeRange('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTimeRange === 'all'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-300 text-brown-primary hover:bg-yellow-400'
                }`}
            >
              All
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                setCustomStartDate(firstDayOfMonth.toISOString().split('T')[0]);
                setCustomEndDate(lastDayOfMonth.toISOString().split('T')[0]);
                setSelectedTimeRange('custom');
              }}
              className="px-3 py-2 bg-yellow-300 text-brown-primary rounded-lg text-sm hover:bg-yellow-400 transition-colors"
            >
              This Month
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
                const lastDayOfYear = new Date(now.getFullYear(), 11, 31);
                setCustomStartDate(firstDayOfYear.toISOString().split('T')[0]);
                setCustomEndDate(lastDayOfYear.toISOString().split('T')[0]);
                setSelectedTimeRange('custom');
              }}
              className="px-3 py-2 bg-yellow-300 text-brown-primary rounded-lg text-sm hover:bg-yellow-400 transition-colors"
            >
              This Year
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const yesterday = new Date(now);
                yesterday.setDate(now.getDate() - 1);
                setCustomStartDate(yesterday.toISOString().split('T')[0]);
                setCustomEndDate(yesterday.toISOString().split('T')[0]);
                setSelectedTimeRange('custom');
              }}
              className="px-3 py-2 bg-yellow-300 text-brown-primary rounded-lg text-sm hover:bg-yellow-400 transition-colors"
            >
              Yesterday
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₱{count.revenue?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{count.orders?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products Sold</p>
              <p className="text-2xl font-bold text-gray-900">{count.productsSold?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{count.users?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(recentOrders) && recentOrders.length > 0 ? (
                  recentOrders.slice(0, 10).map((order: Order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.name || 'Unknown Customer'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-yellow-300 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {order.status?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products - Removed */}
      </div>

      {/* Report Info */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-800">Report Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Generated:</strong> {new Date().toLocaleString()}</p>
            <p><strong>Data Source:</strong> Real-time from database</p>
          </div>
          <div>
            <p><strong>Report Type:</strong> Sales Performance Summary</p>
            <p><strong>Data Range:</strong> {getDateRangeString(selectedTimeRange)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReportPage;
