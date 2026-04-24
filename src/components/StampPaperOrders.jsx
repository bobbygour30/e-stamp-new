import React, { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Info,
  Upload
} from 'lucide-react';
import InvoiceModal from './InvoiceModal';
import OrderDetailsModal from './OrderDetailsModal'; // Add this import

export default function StampPaperOrders({ onUploadClick }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false); // Add this
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [filter, setFilter] = useState({ status: '', documentType: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...filter
      };
      if (searchTerm) params.search = searchTerm;
      
      const response = await documentAPI.getAdminRequests(params);
      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(true);
    try {
      await documentAPI.updateStatus(id, { status, adminRemarks });
      setShowModal(false);
      setAdminRemarks('');
      fetchRequests();
      alert(`Document ${status} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const makePDFAvailable = async (requestId) => {
    setActionLoading(true);
    try {
      const response = await documentAPI.makePDFAvailable(requestId);
      if (response.data.success) {
        alert('PDF is now available for user download!');
        fetchRequests();
      }
    } catch (error) {
      console.error('Error making PDF available:', error);
      alert('Failed to make PDF available. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const openStatusModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const viewInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUploadClick = (order) => {
    if (onUploadClick) {
      onUploadClick(order);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-10'>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Stamp Paper Orders</h2>
        <p className="text-gray-600 mt-1">Manage and process customer document requests</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-600">Total Orders</p>
          <p className="text-2xl font-bold text-blue-900">{requests.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">
            {requests.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-900">
            {requests.filter(r => r.status === 'completed').length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-sm text-purple-600">Revenue</p>
          <p className="text-2xl font-bold text-purple-900">
            ₹{requests.reduce((sum, r) => r.paymentStatus === 'completed' ? sum + r.paymentAmount : sum, 0)}
          </p>
        </div>
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
                placeholder="Search by user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchRequests()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value, currentPage: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <button
            onClick={fetchRequests}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Apply Filters
          </button>
          
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <FileText className="mx-auto mb-2" size={48} />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {request.orderId || request._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {request.userId?.name || 'N/A'}
                          {request.userId?.role === 'vendor' && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Vendor</span>
                          )}
                          {request.userId?.role === 'user' && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">User</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{request.userId?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                      {request.documentType.replace(/-/g, ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      ₹{request.paymentAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadge(request.paymentStatus)}`}>
                        {request.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => viewOrderDetails(request)} 
                          className="text-indigo-600 hover:text-indigo-900" 
                          title="View Order Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => viewInvoice(request)} 
                          className="text-purple-600 hover:text-purple-900" 
                          title="View Invoice"
                        >
                          <Info size={18} />
                        </button>
                        {request.status === 'pending' && request.paymentStatus === 'completed' && (
                          <>
                            <button 
                              onClick={() => handleUploadClick(request)} 
                              className="text-blue-600 hover:text-blue-900" 
                              title="Upload Stamp Paper"
                            >
                              <Upload size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(request._id, 'approved')} 
                              className="text-green-600 hover:text-green-900" 
                              title="Approve" 
                              disabled={actionLoading}
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => openStatusModal(request)} 
                              className="text-red-600 hover:text-red-900" 
                              title="Reject" 
                              disabled={actionLoading}
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && request.pdfUrl && (
                          <button 
                            onClick={() => makePDFAvailable(request._id)} 
                            className="text-blue-600 hover:text-blue-900" 
                            title="Make PDF Available" 
                            disabled={actionLoading}
                          >
                            <FileText size={18} />
                          </button>
                        )}
                        {request.pdfUrl && (
                          <a 
                            href={request.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-green-600 hover:text-green-900" 
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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

      {/* Status Update Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Update Document Status</h2>
            <p className="text-gray-600 mb-2">
              Document: <span className="font-medium capitalize">{selectedRequest.documentType.replace(/-/g, ' ')}</span>
            </p>
            <p className="text-gray-600 mb-4">
              User: <span className="font-medium">{selectedRequest.userId?.name}</span>
              {selectedRequest.userId?.role === 'vendor' && (
                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Vendor</span>
              )}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Remarks (Optional)
              </label>
              <textarea 
                value={adminRemarks} 
                onChange={(e) => setAdminRemarks(e.target.value)} 
                rows="3" 
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Add any remarks or notes..."
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleStatusUpdate(selectedRequest._id, 'approved')} 
                disabled={actionLoading} 
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
              <button 
                onClick={() => handleStatusUpdate(selectedRequest._id, 'rejected')} 
                disabled={actionLoading} 
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && selectedOrder && (
        <InvoiceModal 
          order={selectedOrder} 
          onClose={() => setShowInvoice(false)} 
        />
      )}

      {/* Order Details Modal */}
{showOrderDetails && selectedOrder && (
  <OrderDetailsModal 
    order={selectedOrder} 
    onClose={() => setShowOrderDetails(false)}
    onStatusUpdate={() => fetchRequests()}
  />
)}
    </div>
  );
}