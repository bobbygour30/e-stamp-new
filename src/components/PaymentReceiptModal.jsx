import React, { useRef } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function PaymentReceiptModal({ payment, onClose }) {
  const receiptRef = useRef();

  const downloadPDF = () => {
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Receipt_${payment.paymentId}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(receiptRef.current).save();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failure': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Successful';
      case 'failure': return 'Failed';
      default: return 'Pending';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card': return '💳';
      case 'Debit Card': return '💳';
      case 'UPI': return '📱';
      case 'Net Banking': return '🏦';
      default: return '💳';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Payment Receipt</h2>
          <div className="flex gap-2">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Download size={16} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          <div ref={receiptRef} style={{ fontFamily: "Arial", fontSize: "14px", color: "#000" }}>
            
            {/* Header */}
            <div className="text-center mb-6">
              <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#4f46e5" }}>Easy E Stamp</h1>
              <p style={{ fontSize: "12px", color: "#666" }}>Payment Receipt</p>
            </div>

            {/* Success Icon for successful payments */}
            {payment.status === 'success' && (
              <div className="text-center mb-4">
                <CheckCircle size={48} className="text-green-500 mx-auto" />
                <p className="text-green-600 font-medium mt-2">Payment Successful</p>
              </div>
            )}

            {/* Receipt Details */}
            <div style={{ 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px", 
              padding: "20px",
              marginBottom: "20px"
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>Receipt Number</p>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937" }}>{payment.receiptNumber}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>Payment ID</p>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#1f2937", fontFamily: "monospace" }}>{payment.paymentId}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>Order ID</p>
                  <p style={{ fontSize: "14px", fontFamily: "monospace", color: "#1f2937" }}>{payment.orderId}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>Transaction ID</p>
                  <p style={{ fontSize: "14px", fontFamily: "monospace", color: "#1f2937" }}>{payment.txnId}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>Date</p>
                  <p style={{ fontSize: "14px", color: "#1f2937" }}>{formatDate(payment.date)}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>Status</p>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: getStatusColor(payment.status) }}>
                    {getStatusText(payment.status)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div style={{ 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px", 
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px", color: "#1f2937" }}>Customer Details</h3>
              <div className="space-y-2">
                <p style={{ fontSize: "13px" }}><span style={{ color: "#6b7280" }}>Name:</span> {payment.customer}</p>
                <p style={{ fontSize: "13px" }}><span style={{ color: "#6b7280" }}>Email:</span> {payment.customerEmail}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div style={{ 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px", 
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px", color: "#1f2937" }}>Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: "#6b7280" }}>Payment Method:</span>
                  <span style={{ fontWeight: "500" }}>
                    {getMethodIcon(payment.method)} {payment.method}
                  </span>
                </div>
                {payment.originalAmount && payment.originalAmount !== payment.amount && (
                  <>
                    <div className="flex justify-between">
                      <span style={{ color: "#6b7280" }}>Original Amount:</span>
                      <span>{formatCurrency(payment.originalAmount)}</span>
                    </div>
                    {payment.couponCode && (
                      <div className="flex justify-between">
                        <span style={{ color: "#6b7280" }}>Coupon Applied:</span>
                        <span className="text-green-600">{payment.couponCode}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span style={{ color: "#6b7280" }}>Discount:</span>
                      <span className="text-green-600">-{formatCurrency(payment.discount)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#4f46e5" }}>
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "10px", color: "#9ca3af" }}>
                This is a system generated receipt. For any queries, please contact support@easyestamp.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}