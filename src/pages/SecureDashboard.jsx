import React, { useState, useEffect, useContext } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  CheckCircle, 
  Users,
  IndianRupee,
  Package,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  Clock
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
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

export default function SecureDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setRefreshing(true);
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Revenue Overview Chart Data
  const revenueChartData = {
    labels: stats?.revenueOverview?.map(item => {
      const date = new Date(item._id);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stats?.revenueOverview?.map(item => item.revenue) || [],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Order Status Distribution Chart Data
  const statusColors = {
    pending: '#eab308',
    approved: '#3b82f6',
    completed: '#22c55e',
    rejected: '#ef4444'
  };
  
  const statusLabels = stats?.statusDistribution?.map(item => item._id?.toUpperCase() || 'UNKNOWN') || [];
  const statusCounts = stats?.statusDistribution?.map(item => item.count) || [];
  
  const pieChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: statusLabels.map(label => {
          switch(label.toLowerCase()) {
            case 'pending': return '#eab308';
            case 'approved': return '#3b82f6';
            case 'completed': return '#22c55e';
            case 'rejected': return '#ef4444';
            default: return '#6b7280';
          }
        }),
        borderWidth: 0,
      },
    ],
  };

  // Monthly Trend Chart
  const monthlyTrendData = {
    labels: stats?.monthlyTrend?.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    }) || [],
    datasets: [
      {
        label: 'Orders',
        data: stats?.monthlyTrend?.map(item => item.count) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className=" px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={fetchDashboardStats}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
            icon={IndianRupee}
            color="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={ShoppingBag}
            color="bg-blue-500"
          />
          <StatCard
            title="Success Rate"
            value={`${stats?.successRate || 0}%`}
            icon={TrendingUp}
            color="bg-indigo-500"
            subtitle={`${stats?.completedOrders || 0} completed / ${stats?.totalOrders || 0} total`}
          />
          <StatCard
            title="Active Vendors"
            value={stats?.activeVendors || 0}
            icon={Users}
            color="bg-purple-500"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-yellow-600" />
              <div>
                <p className="text-sm text-yellow-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-900">{stats?.pendingOrders || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Approved Orders</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.approvedOrders || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Package size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-green-600">Completed Orders</p>
                <p className="text-2xl font-bold text-green-900">{stats?.completedOrders || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Overview Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview (Last 30 Days)</h3>
            {stats?.revenueOverview?.length > 0 ? (
              <div className="h-80">
                <Line
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: { callbacks: { label: (context) => `₹${context.raw.toLocaleString()}` } }
                    },
                    scales: { y: { beginAtZero: true, ticks: { callback: (value) => `₹${value}` } } }
                  }}
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No revenue data available</div>
            )}
          </div>

          {/* Order Status Distribution Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            {stats?.statusDistribution?.length > 0 ? (
              <div className="h-80 flex items-center justify-center">
                <Pie
                  data={pieChartData}
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
              <div className="h-80 flex items-center justify-center text-gray-500">No status data available</div>
            )}
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Order Trend (Last 6 Months)</h3>
          {stats?.monthlyTrend?.length > 0 ? (
            <div className="h-80">
              <Bar
                data={monthlyTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { callbacks: { label: (context) => `${context.raw} orders` } }
                  },
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }}
              />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">No trend data available</div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <p className="text-sm text-gray-500 mt-1">Latest 10 orders</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.recentOrders?.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{order.type}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{order.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}