import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { invoiceAPI } from '../services/api';

export default function InvoiceEditModal({ invoice, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    status: invoice.status,
    paymentStatus: invoice.paymentStatus === 'paid' ? 'completed' : 'pending',
    adminRemarks: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await invoiceAPI.updateInvoice(invoice._id, formData);
      alert('Invoice updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  const getStatusOptions = () => {
    const options = [
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' },
      { value: 'overdue', label: 'Overdue' },
      { value: 'cancelled', label: 'Cancelled' }
    ];
    return options;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={invoice.orderId}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={invoice.customer}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="text"
              value={`₹${invoice.amount}`}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {getStatusOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Remarks
            </label>
            <textarea
              value={formData.adminRemarks}
              onChange={(e) => setFormData({ ...formData, adminRemarks: e.target.value })}
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add remarks..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}