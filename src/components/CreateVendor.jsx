import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { UserPlus, CheckCircle, XCircle, Truck } from 'lucide-react';

export default function CreateVendor({ onVendorCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vendorDetails: {
      companyName: '',
      gstNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authAPI.registerVendor(formData);
      setSuccess(true);
      setTimeout(() => {
        if (onVendorCreated) onVendorCreated();
      }, 2000);
    } catch (error) {
      console.error('Error creating vendor:', error);
      setError(error.response?.data?.msg || 'Failed to create vendor');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      vendorDetails: {
        companyName: '',
        gstNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      }
    });
    setSuccess(false);
    setError('');
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="bg-green-100 rounded-full p-4 mb-4">
          <CheckCircle size={64} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Created Successfully!</h2>
        <p className="text-gray-600 mb-4">
          The vendor has been created and can now login using their credentials.
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Create Another Vendor
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <UserPlus size={24} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Vendor</h2>
            <p className="text-gray-600 mt-1">Register a new vendor/seller in the system</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Create Vendor Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="vendor@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contact number"
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="vendorDetails.companyName"
                  value={formData.vendorDetails.companyName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  name="vendorDetails.gstNumber"
                  value={formData.vendorDetails.gstNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="GSTIN"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="vendorDetails.address"
                  value={formData.vendorDetails.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Complete address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="vendorDetails.city"
                  value={formData.vendorDetails.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="vendorDetails.state"
                  value={formData.vendorDetails.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="vendorDetails.pincode"
                  value={formData.vendorDetails.pincode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Vendor
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Truck size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Vendor Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Vendors will receive their login credentials via email. They can then log in to the system 
              and access their dashboard to manage stamp paper orders. Vendors can be activated or deactivated 
              from the Vendor Management section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}