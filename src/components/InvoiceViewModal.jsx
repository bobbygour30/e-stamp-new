import React, { useRef } from 'react';
import { X, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function InvoiceViewModal({ invoice, onClose }) {
  const invoiceRef = useRef();

  const downloadPDF = () => {
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `Invoice_${invoice.invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const stampAmount = invoice.amount || 0;
  const platformFee = 0;
  const gst = (stampAmount * 0.18);
  const totalPayable = stampAmount + platformFee + gst;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-[950px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
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

        {/* Invoice Content */}
        <div className="p-6">
          <div ref={invoiceRef} style={{ fontFamily: "Arial", fontSize: "14px", color: "#000" }}>
            
            {/* Header */}
            <div className="flex justify-between mb-4">
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>Easy E-Stamp</h1>
                <p>Stamp Paper Invoice</p>
                <p style={{ fontWeight: "bold" }}>FinoLead Solutions Private Limited</p>
                <p>Email: info@easyestamp.com</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>INVOICE</p>
                <p>{formatDate(invoice.date)}</p>
                <p>Invoice No: {invoice.invoiceNumber}</p>
                <p>Order ID: {invoice.orderId}</p>
                <p>CIN: U70200UP2025PTC223712</p>
                <p>GSTIN: 09AAGCF4064J1ZE</p>
              </div>
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* Customer Details */}
            <div className="flex justify-between mb-6">
              <div>
                <p style={{ fontWeight: "bold" }}>Bill To:</p>
                <p>{invoice.customer}</p>
                <p>{invoice.customerEmail}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: "bold" }}>Status:</p>
                <p className={getStatusColor(invoice.status)} style={{ fontWeight: "bold" }}>
                  {invoice.status?.toUpperCase()}
                </p>
                <p>Due Date: {formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            {/* Amount Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr>
                  <th style={cellHeader}>Description</th>
                  <th style={cellHeaderRight}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={cell}>Stamp Amount</td>
                  <td style={cellRight}>₹{stampAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={cell}>Platform Fee</td>
                  <td style={cellRight}>₹{platformFee.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={cell}>GST (18%)</td>
                  <td style={cellRight}>₹{gst.toFixed(2)}</td>
                </tr>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <td style={{ ...cell, fontWeight: "bold" }}>Total Payable</td>
                  <td style={{ ...cellRight, fontWeight: "bold" }}>₹{totalPayable.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
              <p style={{ fontSize: "12px", textAlign: "center", color: "#666" }}>
                This is a system generated invoice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cellHeader = {
  border: "1px solid #000",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f9fafb"
};

const cellHeaderRight = {
  border: "1px solid #000",
  padding: "10px",
  textAlign: "right",
  backgroundColor: "#f9fafb"
};

const cell = {
  border: "1px solid #000",
  padding: "10px",
};

const cellRight = {
  border: "1px solid #000",
  padding: "10px",
  textAlign: "right",
};