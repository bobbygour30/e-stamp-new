import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import { LogOut, User, FileText, Clock, CheckCircle, XCircle, Download, Eye, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      const response = await documentAPI.getUserRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserRequests();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      case 'approved':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-500" />;
      case 'completed':
        return <FileText size={20} className="text-blue-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Your document is pending admin approval. You will be notified once approved.';
      case 'approved':
        return 'Your document has been approved. The PDF will be available soon.';
      case 'rejected':
        return 'Your document was rejected. Please contact support for more information.';
      case 'completed':
        return 'Your document is ready! Click the download button to get your PDF.';
      default:
        return 'Status unknown';
    }
  };

  const getPaymentStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Payment pending. Please complete payment to process your request.';
      case 'completed':
        return 'Payment completed successfully.';
      case 'failed':
        return 'Payment failed. Please try again.';
      default:
        return '';
    }
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-indigo-600">LexDraft</h1>
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User size={16} className="text-indigo-600" />
                </div>
                <span className="text-gray-700 text-sm hidden sm:inline">Welcome, {user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                <p className="text-slate-600">Manage your document requests</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-600 mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900">{requests.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <p className="text-sm text-yellow-600 mb-1">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-green-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-purple-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-purple-900">{completedCount}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link
              to="/marriage-register"
              className="bg-indigo-50 p-4 rounded-xl hover:bg-indigo-100 transition text-center group"
            >
              <FileText className="mx-auto mb-2 text-indigo-600 group-hover:scale-110 transition" size={28} />
              <span className="font-medium text-indigo-700">Create New Document Request</span>
              <p className="text-xs text-indigo-500 mt-1">Start a new application</p>
            </Link>
            <Link
              to="/profile"
              className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition text-center group"
            >
              <User className="mx-auto mb-2 text-gray-600 group-hover:scale-110 transition" size={28} />
              <span className="font-medium text-gray-700">Update Profile</span>
              <p className="text-xs text-gray-500 mt-1">Manage your account details</p>
            </Link>
          </div>

          {/* My Requests Section */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">My Document Requests</h3>
            
            {requests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="mx-auto mb-3" size={48} />
                <p className="text-lg font-medium">No document requests yet</p>
                <p className="text-sm mt-1">Create your first document request to get started</p>
                <Link to="/marriage-register" className="inline-block mt-4 text-indigo-600 hover:underline">
                  Create Request →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(request.status)}
                            <span className="ml-2 text-sm text-gray-900 capitalize">
                              {request.documentType.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{request.paymentAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewDetails(request)}
                              className="text-indigo-600 hover:text-indigo-900 transition"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            {request.pdfUrl && request.status === 'completed' && (
                              <a
                                href={request.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-900 transition"
                                title="Download PDF"
                              >
                                <Download size={18} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Document Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Document Type</label>
                  <p className="text-gray-900 capitalize mt-1">{selectedRequest.documentType.replace(/-/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Request ID</label>
                  <p className="text-gray-900 font-mono text-sm mt-1">{selectedRequest._id}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(selectedRequest.status)}
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{getStatusMessage(selectedRequest.status)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedRequest.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRequest.paymentStatus}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{getPaymentStatusMessage(selectedRequest.paymentStatus)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount Paid</label>
                  <p className="text-gray-900 font-medium mt-1">₹{selectedRequest.paymentAmount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted On</label>
                  <p className="text-gray-900 mt-1">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>
              
              {selectedRequest.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved On</label>
                  <p className="text-gray-900 mt-1">{formatDate(selectedRequest.approvedAt)}</p>
                </div>
              )}
              
              {selectedRequest.adminRemarks && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Admin Remarks</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{selectedRequest.adminRemarks}</p>
                </div>
              )}
              
              {selectedRequest.pdfUrl && selectedRequest.status === 'completed' && (
                <div className="pt-4">
                  <a
                    href={selectedRequest.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Download size={18} />
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}