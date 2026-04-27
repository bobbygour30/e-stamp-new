import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Eye, 
  Edit, 
  Download, 
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { invoiceAPI } from '../services/api';
import InvoiceEditModal from '../components/InvoiceEditModal';
import InvoiceViewModal from '../components/InvoiceViewModal';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, filterStatus]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        status: filterStatus || undefined
      };
      if (searchTerm) params.search = searchTerm;
      
      const response = await invoiceAPI.getAllInvoices(params);
      setInvoices(response.data.invoices);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async (invoiceId) => {
    setGeneratingPdf(true);
    try {
      const response = await invoiceAPI.generateInvoicePDF(invoiceId);
      if (response.data.success) {
        alert('Invoice PDF generated successfully!');
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return { icon: CheckCircle, text: 'Paid', color: 'bg-green-100 text-green-800' };
      case 'pending':
        return { icon: Clock, text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      case 'overdue':
        return { icon: AlertCircle, text: 'Overdue', color: 'bg-red-100 text-red-800' };
      case 'cancelled':
        return { icon: XCircle, text: 'Cancelled', color: 'bg-gray-100 text-gray-800' };
      default:
        return { icon: Clock, text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    }
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
          <p className="mt-4 text-gray-600">Loading invoices...</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
              <p className="text-gray-600 mt-1">Manage all customer invoices</p>
            </div>
            <button
              onClick={fetchInvoices}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by Invoice # or Order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchInvoices()}
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
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <button
              onClick={fetchInvoices}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <FileText className="mx-auto mb-2" size={48} />
                      <p>No invoices found</p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => {
                    const StatusIcon = getStatusBadge(invoice.status).icon;
                    const statusInfo = getStatusBadge(invoice.status);
                    return (
                      <tr key={invoice._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono font-medium text-gray-900">{invoice.invoiceNumber}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono text-gray-600">{invoice.orderId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{invoice.customer}</p>
                            <p className="text-xs text-gray-500">{invoice.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">₹{invoice.amount}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(invoice.dueDate)}
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
                              onClick={() => handleViewInvoice(invoice)}
                              className="text-indigo-600 hover:text-indigo-900 transition"
                              title="View Invoice"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEditInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-900 transition"
                              title="Edit Invoice"
                            >
                              <Edit size={18} />
                            </button>
                            {!invoice.pdfUrl && invoice.status === 'paid' && (
                              <button
                                onClick={() => handleGeneratePDF(invoice._id)}
                                disabled={generatingPdf}
                                className="text-green-600 hover:text-green-900 transition"
                                title="Generate PDF"
                              >
                                <FileText size={18} />
                              </button>
                            )}
                            {invoice.pdfUrl && (
                              <a
                                href={invoice.pdfUrl}
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

      {/* Invoice Edit Modal */}
      {showEditModal && selectedInvoice && (
        <InvoiceEditModal
          invoice={selectedInvoice}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchInvoices}
        />
      )}

      {/* Invoice View Modal */}
      {showViewModal && selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}