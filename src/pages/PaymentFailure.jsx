import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const txnId = params.get('txnid');
    const status = params.get('status');
    
    console.log('Payment failure page:', { error, txnId, status });
    
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [location, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <XCircle size={80} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed!</h1>
        <p className="text-gray-600 mb-4">
          Your payment could not be processed. Please try again.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You will be redirected to dashboard in a few seconds...
        </p>
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="block w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/marriage-register"
            className="block w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}