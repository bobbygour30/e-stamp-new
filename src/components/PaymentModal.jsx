import React, { useState } from 'react';
import { paymentAPI, couponAPI } from '../services/api';
import { Tag, X } from 'lucide-react';

const PaymentModal = ({ requestId, amount, couponApplied, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(couponApplied || null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [finalAmount, setFinalAmount] = useState(amount);

  // Calculate discount if coupon is applied from parent
  React.useEffect(() => {
    if (couponApplied) {
      setAppliedCoupon(couponApplied);
      setCouponDiscount(couponApplied.discountAmount);
      setFinalAmount(amount - couponApplied.discountAmount);
    }
  }, [couponApplied, amount]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    
    try {
      // Get document type from localStorage or context (you'll need to pass this)
      const documentType = localStorage.getItem('currentDocumentType') || 'general';
      
      const response = await couponAPI.validateCoupon({
        code: couponCode,
        amount: amount,
        documentType: documentType
      });
      
      if (response.data.valid) {
        const discount = response.data.coupon.discountAmount;
        setAppliedCoupon(response.data.coupon);
        setCouponDiscount(discount);
        setFinalAmount(amount - discount);
        setCouponError('');
        setShowCouponInput(false);
        alert(`Coupon applied! You saved ₹${discount}`);
      } else {
        setCouponError(response.data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setFinalAmount(amount);
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setFinalAmount(amount);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setFinalAmount(amount);
    setCouponCode('');
    setCouponError('');
  };

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
        amount: finalAmount,
        originalAmount: amount,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code,
        name: userData.name,
        email: userData.email
      });
      
      const response = await paymentAPI.initiatePayment({
        requestId,
        amount: finalAmount,
        originalAmount: amount,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code,
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        {/* Price Breakdown */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Original Amount:</span>
            <span>₹{amount}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-1">
                <Tag size={14} />
                Coupon Discount ({appliedCoupon.code}):
              </span>
              <span>- ₹{couponDiscount}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Payable:</span>
              <span className="text-indigo-600">₹{finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Coupon Section */}
        {!appliedCoupon ? (
          <div className="mb-4">
            {!showCouponInput ? (
              <button
                onClick={() => setShowCouponInput(true)}
                className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
              >
                <Tag size={14} />
                Have a coupon code? Click here
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm"
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-600">{couponError}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 p-3 bg-green-50 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-green-600" />
              <span className="text-sm text-green-700">
                Coupon {appliedCoupon.code} applied!
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        )}
        
        <p className="text-gray-500 text-sm mb-6">
          Your document will be processed after successful payment
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay ₹${finalAmount}`}
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