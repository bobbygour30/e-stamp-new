import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  Users,
  DollarSign,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Calendar,
  ChevronDown,
  RefreshCw,
  Award,
  Package,
  Clock,
  XCircle,
  UserCheck,
  Briefcase,
  Filter
} from 'lucide-react';
import { reportsAPI } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function Reports() {
  const [period, setPeriod] = useState('month');
  const [userType, setUserType] = useState('all'); // 'all', 'users', 'vendors'
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period, userType]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = { period, userType };
      if (period === 'custom' && customDateRange.startDate && customDateRange.endDate) {
        params.startDate = customDateRange.startDate;
        params.endDate = customDateRange.endDate;
      }
      const response = await reportsAPI.getAnalytics(params);
      setData(response.data.data);
      setComparison(response.data.comparison);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateApply = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      setPeriod('custom');
      fetchAnalytics();
      setShowDatePicker(false);
    }
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const response = await reportsAPI.exportData({
        type: 'orders',
        userType: userType,
        startDate: period === 'custom' ? customDateRange.startDate : undefined,
        endDate: period === 'custom' ? customDateRange.endDate : undefined
      });
      
      const worksheet = XLSX.utils.json_to_sheet(response.data.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
      XLSX.writeFile(workbook, `reports_${userType}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    window.print();
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  // Sales Trend Chart Data
  const salesTrendData = {
    labels: data?.salesTrend?.map(item => {
      const date = new Date(item._id);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data?.salesTrend?.map(item => item.revenue) || [],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: data?.salesTrend?.map(item => item.orders) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const salesTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()}` } }
    },
    scales: {
      y: { title: { display: true, text: 'Revenue (₹)' }, beginAtZero: true, ticks: { callback: (value) => `₹${value.toLocaleString()}` } },
      y1: { title: { display: true, text: 'Orders' }, position: 'right', beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  // Document Type Distribution
  const documentTypeData = {
    labels: data?.documentTypes?.map(item => item._id?.replace(/-/g, ' ') || 'Other') || [],
    datasets: [
      {
        data: data?.documentTypes?.map(item => item.count) || [],
        backgroundColor: ['#4f46e5', '#22c55e', '#eab308', '#ef4444', '#06b6d4', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  // Top Users/Vendors Chart based on filter
  const topPerformersData = {
    labels: data?.topPerformers?.map(v => v.name?.split(' ')[0] || 'N/A') || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data?.topPerformers?.map(v => v.revenue) || [],
        backgroundColor: '#4f46e5',
        borderRadius: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">View insights and analytics of your business</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* User Type Filter */}
              <div className="relative">
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white flex items-center gap-2"
                >
                  <option value="all">All Users</option>
                  <option value="users">Only Customers</option>
                  <option value="vendors">Only Vendors</option>
                </select>
              </div>
              
              {/* Period Selector */}
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              {period === 'custom' && (
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Calendar size={18} />
                  Select Dates
                  <ChevronDown size={16} />
                </button>
              )}
              
              <button
                onClick={exportToExcel}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FileSpreadsheet size={18} />
                Export Excel
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FileText size={18} />
                Export PDF
              </button>
              <button
                onClick={fetchAnalytics}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Custom Date Picker */}
          {showDatePicker && period === 'custom' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>
              <button
                onClick={handleCustomDateApply}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Filter Badge */}
        {userType !== 'all' && (
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <Filter size={14} />
              Filtering by: {userType === 'users' ? 'Customers Only' : 'Vendors Only'}
              <button
                onClick={() => setUserType('all')}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={userType === 'vendors' ? 'Vendor Revenue' : 'Total Revenue'}
            value={`₹${data?.totalRevenue?.toLocaleString() || 0}`}
            icon={DollarSign}
            color="bg-green-500"
            trend={comparison?.totalRevenue ? (data?.totalRevenue > comparison.totalRevenue ? 'up' : 'down') : null}
            trendValue={comparison?.totalRevenue ? Math.abs(((data?.totalRevenue - comparison.totalRevenue) / comparison.totalRevenue) * 100).toFixed(1) : 0}
          />
          <StatCard
            title={userType === 'vendors' ? 'Vendor Orders' : 'New Orders'}
            value={data?.newOrders || 0}
            icon={ShoppingBag}
            color="bg-blue-500"
            trend={comparison?.newOrders ? (data?.newOrders > comparison.newOrders ? 'up' : 'down') : null}
            trendValue={comparison?.newOrders ? Math.abs(((data?.newOrders - comparison.newOrders) / comparison.newOrders) * 100).toFixed(1) : 0}
          />
          <StatCard
            title="Success Rate"
            value={`${data?.successRate || 0}%`}
            icon={CheckCircle}
            color="bg-indigo-500"
            trend={comparison?.successRate ? (data?.successRate > comparison.successRate ? 'up' : 'down') : null}
            trendValue={comparison?.successRate ? Math.abs((data?.successRate - comparison.successRate)).toFixed(1) : 0}
          />
          <StatCard
            title={userType === 'vendors' ? 'Active Vendors' : 'Active Users'}
            value={userType === 'vendors' ? (data?.activeVendors || 0) : (data?.activeUsers || 0)}
            icon={Users}
            color="bg-purple-500"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Package size={16} />
              <span className="text-sm">Completed Orders</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{data?.completedOrders || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock size={16} />
              <span className="text-sm">Pending Orders</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{data?.pendingOrders || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <XCircle size={16} />
              <span className="text-sm">Rejected Orders</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{data?.rejectedOrders || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <TrendingUp size={16} />
              <span className="text-sm">Avg Order Value</span>
            </div>
            <p className="text-xl font-bold text-gray-900">₹{data?.averageOrderValue?.toFixed(2) || 0}</p>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          {data?.salesTrend?.length > 0 ? (
            <div className="h-96">
              <Line data={salesTrendData} options={salesTrendOptions} />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">No sales data available</div>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Document Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Type Distribution</h3>
            {data?.documentTypes?.length > 0 ? (
              <div className="h-80 flex items-center justify-center">
                <Pie
                  data={documentTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw} orders` } }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No document type data available</div>
            )}
          </div>

          {/* Top Performers (Users or Vendors based on filter) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={20} className="text-yellow-500" />
              Top {userType === 'vendors' ? 'Vendors' : 'Customers'} by Revenue
            </h3>
            {data?.topPerformers?.length > 0 ? (
              <div className="h-80">
                <Bar
                  data={topPerformersData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { callbacks: { label: (context) => `₹${context.raw.toLocaleString()}` } }
                    },
                    scales: { y: { title: { display: true, text: 'Revenue (₹)' }, beginAtZero: true, ticks: { callback: (value) => `₹${value.toLocaleString()}` } } }
                  }}
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No data available</div>
            )}
            <div className="mt-4 space-y-2">
              {data?.topPerformers?.slice(0, 5).map((performer, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="font-medium text-gray-900">{performer.name}</span>
                    {userType === 'vendors' && performer.companyName && (
                      <span className="text-xs text-gray-500">({performer.companyName})</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-indigo-600">₹{performer.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{performer.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        {data?.paymentMethods?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.paymentMethods.map((method, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{method._id}</p>
                  <p className="text-xl font-bold text-gray-900">{method.count} transactions</p>
                  <p className="text-sm text-gray-500">₹{method.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Note */}
        <div className="text-center text-xs text-gray-400 mt-8 print:hidden">
          <p>Data exported on {new Date().toLocaleString()}</p>
          <p className="mt-1">© Easy E-stamp - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}