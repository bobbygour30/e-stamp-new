import React, { useState } from 'react';
import { paymentAPI } from '../services/api';

const PaymentModal = ({ requestId, amount, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Get user info from localStorage
      const userStr = localStorage.getItem('user');
      let userData = { name: 'User', email: '', phone: '9999999999' };
      
      if (userStr) {
        try {
          userData = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      console.log('Initiating payment for:', {
        requestId,
        amount,
        name: userData.name,
        email: userData.email
      });
      
      const response = await paymentAPI.initiatePayment({
        requestId,
        amount,
        name: userData.name || 'User',
        email: userData.email || 'customer@example.com',
        phone: userData.phone || '9999999999'
      });

      if (response.data.success) {
        const { paymentData } = response.data;
        
        // Determine PayU URL based on mode
        const payuUrl = import.meta.env.VITE_PAYU_MODE === 'production' 
          ? 'https://secure.payu.in/_payment'
          : 'https://test.payu.in/_payment';
        
        console.log('Submitting to PayU URL:', payuUrl);
        console.log('Payment Data:', paymentData);
        
        // Create and submit PayU form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payuUrl;
        
        Object.keys(paymentData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = paymentData[key];
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
        <p className="text-gray-600 mb-4">Amount: ₹{amount}</p>
        <p className="text-gray-600 mb-6">Your document will be processed after successful payment</p>
        
        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;