import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { documentAPI, uploadAPI } from '../services/api';

export default function UploadStampPaper({ preselectedOrder, onUploadComplete }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [stampPaperType, setStampPaperType] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [recentUploads, setRecentUploads] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchRecentUploads();
  }, []);

  // Handle preselected order from StampPaperOrders
  useEffect(() => {
    if (preselectedOrder) {
      setSelectedOrder(preselectedOrder._id);
      setSelectedOrderDetails(preselectedOrder);
      setCustomerName(preselectedOrder.userId?.name || '');
    }
  }, [preselectedOrder]);

  const fetchOrders = async () => {
    try {
      const response = await documentAPI.getAdminRequests({ limit: 100 });
      // Filter only pending orders that need stamp paper
      const pendingOrders = (response.data.requests || []).filter(
        order => order.status === 'pending' && order.paymentStatus === 'completed'
      );
      setOrders(pendingOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchRecentUploads = async () => {
    try {
      const response = await documentAPI.getAdminRequests({ limit: 10 });
      const completedOrders = (response.data.requests || []).filter(
        order => order.status === 'completed' && order.pdfUrl
      );
      setRecentUploads(completedOrders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
    }
  };

  const handleOrderSelect = (orderId) => {
    setSelectedOrder(orderId);
    const order = orders.find(o => o._id === orderId);
    setSelectedOrderDetails(order);
    if (order) {
      setCustomerName(order.userId?.name || '');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF, JPEG, or PNG file (Max 10MB)');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF, JPEG, or PNG file (Max 10MB)');
    }
  };

  const isValidFile = (file) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOrder) {
      setError('Please select an order');
      return;
    }
    if (!stampPaperType) {
      setError('Please select stamp paper type');
      return;
    }
    if (!customerName) {
      setError('Please enter customer name');
      return;
    }
    if (!file) {
      setError('Please upload a file');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('orderId', selectedOrder);
      formData.append('stampPaperType', stampPaperType);
      formData.append('customerName', customerName);
      formData.append('notes', notes);
      formData.append('file', file);
      
      const response = await uploadAPI.uploadStampPaper(formData);
      
      if (response.data.success) {
        setUploadSuccess(true);
        // Reset form
        setTimeout(() => {
          setSelectedOrder('');
          setSelectedOrderDetails(null);
          setStampPaperType('');
          setCustomerName('');
          setNotes('');
          setFile(null);
          setUploadSuccess(false);
          fetchOrders();
          fetchRecentUploads();
          if (onUploadComplete) {
            onUploadComplete();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload stamp paper');
    } finally {
      setUploading(false);
    }
  };

  const stampPaperTypes = [
    'Judicial Stamp Paper',
    'Non-Judicial Stamp Paper',
    'e-Stamp Paper',
    'Special Stamp Paper',
    'Court Fee Stamp',
    'Revenue Stamp'
  ];

  return (
    <div className='p-10'>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Upload size={24} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Stamp Paper</h2>
            <p className="text-gray-600 mt-1">Upload stamp paper documents for customer orders</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <div>
            <p className="font-medium text-green-800">Upload Successful!</p>
            <p className="text-sm text-green-600">Stamp paper has been uploaded and is now available to the customer.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            {/* Select Order */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Order <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedOrder}
                onChange={(e) => handleOrderSelect(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select an order...</option>
                {orders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order.orderId || order._id.slice(-8)} - {order.userId?.name || 'N/A'} - ₹{order.paymentAmount}
                  </option>
                ))}
              </select>
              {selectedOrderDetails && (
                <div className="mt-2 text-sm text-gray-500">
                  Document: {selectedOrderDetails.documentType?.replace(/-/g, ' ')}
                </div>
              )}
            </div>

            {/* Stamp Paper Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stamp Paper Type <span className="text-red-500">*</span>
              </label>
              <select
                value={stampPaperType}
                onChange={(e) => setStampPaperType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select stamp paper type...</option>
                {stampPaperTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Customer Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document <span className="text-red-500">*</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                {!file ? (
                  <>
                    <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-2">Drag & Drop or Click to Upload</p>
                    <p className="text-sm text-gray-400">PDF, JPEG, PNG (Max 10MB)</p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition"
                    >
                      Browse Files
                    </label>
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText size={24} className="text-indigo-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                placeholder="Additional notes..."
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Stamp Paper
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Uploads Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
          {recentUploads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent uploads</p>
          ) : (
            <div className="space-y-3">
              {recentUploads.map((upload) => (
                <div key={upload._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {upload.orderId || upload._id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Customer: {upload.userId?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Uploaded: {new Date(upload.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {upload.pdfUrl && (
                      <a
                        href={upload.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select the correct order before uploading</li>
          <li>• Ensure the stamp paper is clearly visible and legible</li>
          <li>• Accepted file formats: PDF, JPEG, PNG</li>
          <li>• Maximum file size: 10MB</li>
          <li>• After upload, the customer will be able to download the stamp paper from their dashboard</li>
        </ul>
      </div>
    </div>
  );
}