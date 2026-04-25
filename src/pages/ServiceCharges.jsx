import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  RefreshCw,
  Search,
  Edit,
  Save,
  X,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Percent,
  Wallet
} from 'lucide-react';
import { serviceChargeAPI } from '../services/api';

export default function ServiceCharges() {
  const [charges, setCharges] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    setLoading(true);
    try {
      const response = await serviceChargeAPI.getAllCharges();
      setCharges(response.data.charges);
      setDocumentTypes(response.data.documentTypes);
    } catch (error) {
      console.error('Error fetching service charges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (charge) => {
    setEditingId(charge._id);
    setEditFormData({
      basePrice: charge.basePrice,
      platformFee: charge.platformFee,
      gstPercentage: charge.gstPercentage,
      isActive: charge.isActive,
      discountEligible: charge.discountEligible,
      description: charge.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      await serviceChargeAPI.updateCharge(id, editFormData);
      alert('Service charge updated successfully!');
      setEditingId(null);
      fetchCharges();
    } catch (error) {
      console.error('Error updating service charge:', error);
      alert('Failed to update service charge');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = (charge) => {
    const subtotal = charge.basePrice + charge.platformFee;
    const gstAmount = (subtotal * charge.gstPercentage) / 100;
    return subtotal + gstAmount;
  };

  const filteredCharges = charges.filter(charge =>
    charge.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charge.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service charges...</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Service Charges Management</h2>
              <p className="text-gray-600 mt-1">Set custom pricing for each document type</p>
            </div>
            <button
              onClick={fetchCharges}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total Document Types</p>
                <p className="text-2xl font-bold text-blue-900">{charges.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Active Services</p>
                <p className="text-2xl font-bold text-green-900">
                  {charges.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Default GST</p>
                <p className="text-2xl font-bold text-purple-900">18%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by document type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Service Charges Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Price (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform Fee (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount Eligible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCharges.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <Wallet className="mx-auto mb-2" size={48} />
                      <p>No service charges found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCharges.map((charge) => {
                    const isEditing = editingId === charge._id;
                    const total = calculateTotal(charge);
                    
                    return (
                      <tr key={charge._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{charge.displayName}</p>
                            <p className="text-xs text-gray-500 font-mono">{charge.documentType}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editFormData.basePrice}
                              onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value))}
                              className="w-24 border border-gray-300 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-900">₹{charge.basePrice}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editFormData.platformFee}
                              onChange={(e) => handleInputChange('platformFee', parseFloat(e.target.value))}
                              className="w-24 border border-gray-300 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <span className="text-sm text-gray-600">₹{charge.platformFee}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editFormData.gstPercentage}
                              onChange={(e) => handleInputChange('gstPercentage', parseFloat(e.target.value))}
                              className="w-20 border border-gray-300 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <div className="flex items-center gap-1">
                              <Percent size={14} className="text-gray-400" />
                              <span className="text-sm text-gray-600">{charge.gstPercentage}%</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-indigo-600">₹{total.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <select
                              value={editFormData.isActive}
                              onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                              className="border border-gray-300 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value={true}>Active</option>
                              <option value={false}>Disabled</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(charge.isActive)}`}>
                              {charge.isActive ? 'Active' : 'Disabled'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <select
                              value={editFormData.discountEligible}
                              onChange={(e) => handleInputChange('discountEligible', e.target.value === 'true')}
                              className="border border-gray-300 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value={true}>Yes</option>
                              <option value={false}>No</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 text-xs rounded-full ${charge.discountEligible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {charge.discountEligible ? 'Yes' : 'No'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSave(charge._id)}
                                  disabled={saving}
                                  className="text-green-600 hover:text-green-900 transition"
                                  title="Save"
                                >
                                  <Save size={18} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-red-600 hover:text-red-900 transition"
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEdit(charge)}
                                className="text-indigo-600 hover:text-indigo-900 transition"
                                title="Edit"
                              >
                                <Edit size={18} />
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
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">About Service Charges</h4>
              <p className="text-sm text-blue-700 mt-1">
                • Base price is the document preparation fee<br />
                • Platform fee is the service charge for using our platform<br />
                • GST is calculated on the sum of base price and platform fee<br />
                • Total = Base Price + Platform Fee + GST<br />
                • Disabling a document type will hide it from users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}