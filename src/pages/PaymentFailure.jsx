
import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <XCircle size={80} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed!</h1>
        <p className="text-gray-600 mb-6">
          Your payment could not be processed. Please try again or contact support.
        </p>
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="block w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
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