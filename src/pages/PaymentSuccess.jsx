import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { paymentAPI } from '../services/api';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txnId = params.get('txnid');
    const status = params.get('status');
    
    console.log('Payment success page loaded with params:', { txnId, status });
    
    if (!txnId) {
      // No transaction ID, redirect to dashboard
      console.log('No transaction ID found, redirecting to dashboard');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      setLoading(false);
      return;
    }
    
    if (status === 'success') {
      // Payment was successful, verify with backend
      checkPaymentStatus(txnId);
    } else {
      setError('Payment status unknown');
      setLoading(false);
    }
  }, [location]);
  
  const checkPaymentStatus = async (txnId) => {
    try {
      console.log('Checking payment status for txnId:', txnId);
      const response = await paymentAPI.getPaymentStatus(txnId);
      console.log('Payment status response:', response.data);
      
      if (response.data.status === 'success') {
        setPaymentStatus(response.data.payment);
      } else {
        setError('Payment verification failed');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setError('Failed to verify payment. Please check your dashboard.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={80} className="text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Received!</h1>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please check your dashboard for document status.
          </p>
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="block w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={80} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Your payment has been completed successfully.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Your document request is now pending admin approval.
          You will be notified once it's processed.
        </p>
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="block w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="block w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}