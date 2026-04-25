import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Tag,
  AlertCircle
} from 'lucide-react';
import { couponAPI } from '../services/api';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'fixed',
    discountValue: '',
    minimumOrderAmount: '',
    maximumDiscount: '',
    usageLimit: '',
    perUserLimit: 1,
    startDate: '',
    expiryDate: '',
    description: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [currentPage, filterStatus]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        status: filterStatus || undefined
      };
      if (searchTerm) params.search = searchTerm;
      
      const response = await couponAPI.getAllCoupons(params);
      setCoupons(response.data.coupons);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingCoupon) {
        await couponAPI.updateCoupon(editingCoupon._id, formData);
        alert('Coupon updated successfully!');
      } else {
        await couponAPI.createCoupon(formData);
        alert('Coupon created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert(error.response?.data?.message || 'Failed to save coupon');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      try {
        await couponAPI.deleteCoupon(id);
        alert('Coupon deleted successfully!');
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert('Failed to delete coupon');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await couponAPI.toggleStatus(id);
      alert(`Coupon ${currentStatus === 'active' ? 'disabled' : 'activated'} successfully!`);
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update coupon status');
    }
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount || '',
      maximumDiscount: coupon.maximumDiscount || '',
      usageLimit: coupon.usageLimit || '',
      perUserLimit: coupon.perUserLimit || 1,
      startDate: coupon.startDate?.split('T')[0] || '',
      expiryDate: coupon.expiryDate?.split('T')[0] || '',
      description: coupon.description || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'fixed',
      discountValue: '',
      minimumOrderAmount: '',
      maximumDiscount: '',
      usageLimit: '',
      perUserLimit: 1,
      startDate: '',
      expiryDate: '',
      description: ''
    });
  };

  const getStatusBadge = (status, expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const isExpired = expiry < now;
    
    if (status === 'disabled') {
      return { text: 'Disabled', color: 'bg-gray-100 text-gray-800' };
    }
    if (isExpired || status === 'expired') {
      return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
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
          <p className="mt-4 text-gray-600">Loading coupons...</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Coupons Management</h2>
              <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={18} />
              Create Coupon
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
                  placeholder="Search by coupon code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchCoupons()}
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
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <button
              onClick={fetchCoupons}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Apply Filters
            </button>
            
            <button
              onClick={fetchCoupons}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <Tag className="mx-auto mb-2" size={48} />
                      <p>No coupons found</p>
                      <button onClick={openCreateModal} className="mt-2 text-indigo-600 hover:underline">
                        Create your first coupon
                      </button>
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon, index) => {
                    const statusInfo = getStatusBadge(coupon.status, coupon.expiryDate);
                    return (
                      <tr key={coupon._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {(currentPage - 1) * 10 + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Tag size={16} className="text-indigo-600" />
                            <span className="font-mono font-medium text-gray-900">{coupon.code}</span>
                          </div>
                          {coupon.description && (
                            <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-green-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {coupon.discountType === 'fixed' 
                                ? `₹${coupon.discountValue} OFF` 
                                : `${coupon.discountValue}% OFF`}
                            </span>
                          </div>
                          {coupon.maximumDiscount && (
                            <p className="text-xs text-gray-500">Max ₹{coupon.maximumDiscount}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {coupon.minimumOrderAmount > 0 ? `₹${coupon.minimumOrderAmount}` : 'No minimum'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(coupon.expiryDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(coupon.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(coupon)}
                              className="text-indigo-600 hover:text-indigo-900 transition"
                              title="Edit Coupon"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(coupon._id, coupon.status)}
                              className={`transition ${
                                coupon.status === 'active' 
                                  ? 'text-red-600 hover:text-red-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                              title={coupon.status === 'active' ? 'Disable' : 'Activate'}
                            >
                              {coupon.status === 'active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                            </button>
                            <button
                              onClick={() => handleDelete(coupon._id, coupon.code)}
                              className="text-red-600 hover:text-red-900 transition"
                              title="Delete Coupon"
                            >
                              <Trash2 size={18} />
                            </button>
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE10, WELCOME20"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'fixed' ? 'Amount in ₹' : 'Percentage %'}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                    placeholder="Leave empty for no minimum"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Discount
                  </label>
                  <input
                    type="number"
                    value={formData.maximumDiscount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                    placeholder="For percentage discounts"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit (Total)
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Leave empty for unlimited"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Per User Limit
                  </label>
                  <input
                    type="number"
                    value={formData.perUserLimit}
                    onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  placeholder="Add description or terms..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : (editingCoupon ? 'Update Coupon' : 'Create Coupon')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}