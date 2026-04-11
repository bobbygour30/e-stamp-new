import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { UserPlus, CheckCircle, AlertCircle, Briefcase, Shield } from 'lucide-react';

export default function CreateEmployee({ onEmployeeCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    employeeDetails: {
      designation: '',
      department: '',
      salary: '',
      permissions: {
        stampPaperOrders: false,
        vendorManagement: false,
        createVendor: false,
        uploadStampPaper: false,
        employeeManagement: false,
        createEmployee: false
      }
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'permissions') {
        setFormData(prev => ({
          ...prev,
          employeeDetails: {
            ...prev.employeeDetails,
            permissions: {
              ...prev.employeeDetails.permissions,
              [child]: checked !== undefined ? checked : value
            }
          }
        }));
      } else if (parent === 'employeeDetails') {
        setFormData(prev => ({
          ...prev,
          employeeDetails: {
            ...prev.employeeDetails,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authAPI.registerEmployee(formData);
      setSuccess(true);
      setTimeout(() => {
        if (onEmployeeCreated) onEmployeeCreated();
      }, 2000);
    } catch (error) {
      console.error('Error creating employee:', error);
      setError(error.response?.data?.msg || 'Failed to create employee');
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
      employeeDetails: {
        designation: '',
        department: '',
        salary: '',
        permissions: {
          stampPaperOrders: false,
          vendorManagement: false,
          createVendor: false,
          uploadStampPaper: false,
          employeeManagement: false,
          createEmployee: false
        }
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Created Successfully!</h2>
        <p className="text-gray-600 mb-4">
          The employee has been created and can now login using their credentials.
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Create Another Employee
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
            <h2 className="text-2xl font-bold text-gray-900">Create New Employee</h2>
            <p className="text-gray-600 mt-1">Register a new employee and assign permissions</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Create Employee Form */}
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
                  placeholder="Enter employee name"
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
                  placeholder="employee@example.com"
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

          {/* Employment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-600" />
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="employeeDetails.designation"
                  value={formData.employeeDetails.designation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Senior Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="employeeDetails.department"
                  value={formData.employeeDetails.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., IT, Sales, Support"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary (₹)
                </label>
                <input
                  type="number"
                  name="employeeDetails.salary"
                  value={formData.employeeDetails.salary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Monthly salary"
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
              <Shield size={18} className="text-indigo-600" />
              Assign Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  name="permissions.stampPaperOrders"
                  checked={formData.employeeDetails.permissions.stampPaperOrders}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Stamp Paper Orders - View and manage orders</span>
              </label>
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  name="permissions.vendorManagement"
                  checked={formData.employeeDetails.permissions.vendorManagement}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Vendor Management - View and manage vendors</span>
              </label>
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  name="permissions.createVendor"
                  checked={formData.employeeDetails.permissions.createVendor}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Create Vendor - Register new vendors</span>
              </label>
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  name="permissions.uploadStampPaper"
                  checked={formData.employeeDetails.permissions.uploadStampPaper}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Upload Stamp Paper - Upload stamp paper documents</span>
              </label>
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  name="permissions.employeeManagement"
                  checked={formData.employeeDetails.permissions.employeeManagement}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Employee Management - View and manage employees</span>
              </label>
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  name="permissions.createEmployee"
                  checked={formData.employeeDetails.permissions.createEmployee}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Create Employee - Register new employees</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-3">Note: Employees will only see and access the features you enable here.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Employee...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Employee
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Briefcase size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Employee Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Employees will receive their login credentials via email. They can only access the features you assign to them.
              You can always edit permissions later from the Employee Management section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}