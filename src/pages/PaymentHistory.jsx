import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Eye, 
  Download, 
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { paymentHistoryAPI } from '../services/api';
import PaymentReceiptModal from '../components/PaymentReceiptModal';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, filterStatus, startDate, endDate]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        status: filterStatus || undefined
      };
      if (searchTerm) params.search = searchTerm;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await paymentHistoryAPI.getPaymentHistory(params);
      setPayments(response.data.payments);
      setStats(response.data.stats);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return { icon: CheckCircle, text: 'Success', color: 'bg-green-100 text-green-800' };
      case 'failure':
        return { icon: XCircle, text: 'Failed', color: 'bg-red-100 text-red-800' };
      case 'initiated':
        return { icon: Clock, text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { icon: Clock, text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card':
        return '💳';
      case 'Debit Card':
        return '💳';
      case 'UPI':
        return '📱';
      case 'Net Banking':
        return '🏦';
      default:
        return '💳';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
              <p className="text-gray-600 mt-1">Track and manage all customer payments</p>
            </div>
            <button
              onClick={fetchPayments}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Payments"
            value={stats?.totalPayments || 0}
            icon={CreditCard}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatCard
            title="Successful"
            value={stats?.successfulPayments || 0}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Failed"
            value={stats?.failedPayments || 0}
            icon={XCircle}
            color="bg-red-500"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by Payment ID, Order ID or Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchPayments()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failure">Failed</option>
                <option value="initiated">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={fetchPayments}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <CreditCard className="mx-auto mb-2" size={48} />
                      <p>No payments found</p>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    const statusInfo = getStatusBadge(payment.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr key={payment._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono font-medium text-gray-900">{payment.paymentId}</p>
                          <p className="text-xs text-gray-500">TXN: {payment.txnId?.slice(-8)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono text-gray-600">{payment.orderId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{payment.customer}</p>
                            <p className="text-xs text-gray-500">{payment.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">₹{payment.amount}</p>
                          {payment.discount > 0 && (
                            <p className="text-xs text-green-600">Saved ₹{payment.discount}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(payment.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{getMethodIcon(payment.method)}</span>
                            <span className="text-sm text-gray-600">{payment.method}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                            <StatusIcon size={12} />
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewReceipt(payment)}
                              className="text-indigo-600 hover:text-indigo-900 transition"
                              title="View Receipt"
                            >
                              <Eye size={18} />
                            </button>
                            {payment.status === 'success' && (
                              <button
                                onClick={() => handleViewReceipt(payment)}
                                className="text-green-600 hover:text-green-900 transition"
                                title="Download Receipt"
                              >
                                <Download size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <PaymentReceiptModal
          payment={selectedPayment}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}