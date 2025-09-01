import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

// Extend jsPDF type to include lastAutoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface SalesReportData {
  count: {
    orders: number;
    users: number;
    revenue: number;
    productsSold: number;
  };
  recentOrders: any[];
  topProducts: any[];
  generatedAt: string;
  timeRange: 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const generateSalesReportPDF = async (data: SalesReportData) => {
  const { count, recentOrders, topProducts, generatedAt, timeRange, dateRange } = data;
  
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: 'Sales Report - B-Dazzle Coffee Shop',
    subject: 'Sales Performance Summary',
    author: 'B-Dazzle Admin',
    creator: 'B-Dazzle Coffee Shop System'
  });

  // Add header
  doc.setFontSize(24);
  doc.setTextColor(139, 69, 19); // Brown color
  doc.text('B-Dazzle Coffee Shop', 20, 30);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Sales Performance Report', 20, 45);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${generatedAt}`, 20, 55);
  
  // Add time range information
  const timeRangeText = timeRange === 'all' ? 'All Time' : 
    `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
  doc.text(`Time Period: ${timeRangeText}`, 20, 65);
  
  // Add note about data filtering
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Note: All data shown is filtered for the selected time period`, 20, 72);

  // Add summary statistics
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary Statistics', 20, 95);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Create summary table
  const summaryData = [
    ['Total Revenue', `Php ${count.revenue?.toLocaleString() || '0'}`],
    ['Total Orders', count.orders?.toString() || '0'],
    ['Products Sold', count.productsSold?.toString() || '0'],
    ['Total Customers', count.users?.toString() || '0']
  ];
  
  autoTable(doc, {
    startY: 100,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: [139, 69, 19],
      textColor: 255,
      fontSize: 11,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 10
    },
    margin: { left: 20, right: 20 }
  });

  // Add recent orders table
  if (recentOrders && recentOrders.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Orders', 20, doc.lastAutoTable.finalY + 20);
    
    const ordersData = recentOrders.slice(0, 10).map(order => [
      `#${order.id.substring(0, 8).toUpperCase()}`,
      order.user?.name || 'Unknown Customer',
      new Date(order.createdAt).toLocaleDateString(),
      `Php ${order.total.toFixed(2)}`,
      order.status?.toUpperCase() || 'UNKNOWN'
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Order ID', 'Customer', 'Date', 'Total', 'Status']],
      body: ordersData,
      theme: 'grid',
      headStyles: {
        fillColor: [70, 130, 180],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 }
      }
    });
  }

  // Top products section removed - only showing recent orders

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add page number
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 20);
    
    // Add company info
    doc.text('B-Dazzle Coffee Shop - Sales Report', 20, doc.internal.pageSize.height - 15);
  }

  // Save the PDF
  const timeRangeSuffix = timeRange === 'all' ? 'all-time' : timeRange;
  const fileName = `sales-report-${timeRangeSuffix}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  return fileName;
};
