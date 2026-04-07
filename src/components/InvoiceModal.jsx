import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, X, FileText } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  const invoiceRef = useRef(null);

  const downloadPDF = async () => {
    try {
      const element = invoiceRef.current;
      if (!element) {
        console.error('Invoice element not found');
        return;
      }

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Invoice_${order.orderId || order._id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Calculate amounts
  const stampAmount = order.paymentAmount || 0;
  const platformFee = 0;
  const gst = (stampAmount * 0.18).toFixed(2);
  const totalPayable = (stampAmount + platformFee + parseFloat(gst)).toFixed(2);

  // Get form data from the order
  const formData = order.formData || {};
  
  // Determine order placed by (Vendor or User)
  const placedBy = order.userId?.role === 'vendor' ? 'Vendor' : 'User';
  const placedByName = order.userId?.name || 'N/A';
  const placedByEmail = order.userId?.email || 'N/A';
  const placedByPhone = order.userId?.phone || 'N/A';

  // Get first party name based on document type
  const getFirstPartyName = () => {
    if (formData.groomName) return formData.groomName;
    if (formData.name) return formData.name;
    if (formData.applicantName) return formData.applicantName;
    if (formData.ownerName) return formData.ownerName;
    return 'N/A';
  };

  // Get second party name based on document type
  const getSecondPartyName = () => {
    if (formData.brideName) return formData.brideName;
    if (formData.relationName) return formData.relationName;
    if (formData.childName) return formData.childName;
    if (formData.tenantName) return formData.tenantName;
    return 'N/A';
  };

  // Get phone number
  const getPhoneNumber = () => {
    if (formData.phone) return formData.phone;
    if (formData.contact1) return formData.contact1;
    if (formData.mobile) return formData.mobile;
    return 'N/A';
  };

  // Get address
  const getAddress = () => {
    if (formData.groomAddress) return formData.groomAddress;
    if (formData.address) return formData.address;
    return 'N/A';
  };

  // Inline styles for the invoice
  const styles = {
    container: {
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#4f46e5',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      marginBottom: '4px'
    },
    invoiceTitle: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    invoiceTitleText: {
      fontSize: '24px',
      fontWeight: 'bold',
      borderBottom: '2px solid #d1d5db',
      display: 'inline-block',
      paddingBottom: '8px',
      paddingLeft: '32px',
      paddingRight: '32px'
    },
    grid2Col: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      borderLeft: '4px solid #4f46e5',
      paddingLeft: '12px',
      marginBottom: '12px'
    },
    infoBox: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '24px'
    },
    infoRow: {
      marginBottom: '8px'
    },
    label: {
      color: '#6b7280'
    },
    value: {
      fontWeight: '500'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '24px'
    },
    tableHeader: {
      backgroundColor: '#f3f4f6'
    },
    tableHeaderCell: {
      textAlign: 'left',
      padding: '12px',
      border: '1px solid #d1d5db',
      fontWeight: 'bold'
    },
    tableCell: {
      textAlign: 'left',
      padding: '12px',
      border: '1px solid #d1d5db'
    },
    tableCellRight: {
      textAlign: 'right',
      padding: '12px',
      border: '1px solid #d1d5db'
    },
    totalRow: {
      backgroundColor: '#f3f4f6',
      fontWeight: 'bold'
    },
    footer: {
      textAlign: 'center',
      fontSize: '12px',
      color: '#9ca3af',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '16px',
      marginTop: '16px'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    vendorBadge: {
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: '9999px',
      fontSize: '10px',
      fontWeight: '500',
      marginLeft: '8px',
      backgroundColor: '#e9d5ff',
      color: '#5b21b6'
    },
    userBadge: {
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: '9999px',
      fontSize: '10px',
      fontWeight: '500',
      marginLeft: '8px',
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={24} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Download size={18} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content - Using inline styles instead of Tailwind */}
        <div ref={invoiceRef} style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Easy E-Stamp</h1>
            <p style={styles.subtitle}>Stamp Paper Invoice</p>
            <p style={styles.subtitle}>FinoLead Solutions Private Limited</p>
            <p style={styles.subtitle}>Email: info@easyestamp.com</p>
          </div>

          {/* Title */}
          <div style={styles.invoiceTitle}>
            <h2 style={styles.invoiceTitleText}>INVOICE</h2>
          </div>

          {/* Invoice Info */}
          <div style={styles.grid2Col}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Invoice Date</p>
              <p style={{ fontWeight: '500' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Order ID</p>
              <p style={{ fontWeight: '500', fontFamily: 'monospace' }}>{order.orderId || order._id.slice(-8)}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>CIN</p>
              <p style={{ fontWeight: '500' }}>U70200UP2025PTC223712</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>GSTIN</p>
              <p style={{ fontWeight: '500' }}>09AAGCF4064J1ZE</p>
            </div>
          </div>

          {/* Stamp Holder Details */}
          <div>
            <h3 style={styles.sectionTitle}>Stamp Holder (First Party)</h3>
            <div style={styles.infoBox}>
              <p style={styles.infoRow}><span style={styles.label}>Name:</span> <span style={styles.value}>{getFirstPartyName()}</span></p>
              <p style={styles.infoRow}><span style={styles.label}>Phone:</span> <span style={styles.value}>{getPhoneNumber()}</span></p>
              {formData.groomFather && <p style={styles.infoRow}><span style={styles.label}>Father's Name:</span> <span style={styles.value}>{formData.groomFather}</span></p>}
              {getAddress() !== 'N/A' && <p style={styles.infoRow}><span style={styles.label}>Address:</span> <span style={styles.value}>{getAddress()}</span></p>}
              <p style={styles.infoRow}><span style={styles.label}>Second Party:</span> <span style={styles.value}>{getSecondPartyName()}</span></p>
            </div>
          </div>

          {/* Order Placed By */}
          <div>
            <h3 style={styles.sectionTitle}>Order Placed By ({placedBy})</h3>
            <div style={styles.infoBox}>
              <p style={styles.infoRow}><span style={styles.label}>Name:</span> <span style={styles.value}>{placedByName}</span></p>
              <p style={styles.infoRow}><span style={styles.label}>Email:</span> <span style={styles.value}>{placedByEmail}</span></p>
              <p style={styles.infoRow}><span style={styles.label}>Phone:</span> <span style={styles.value}>{placedByPhone}</span></p>
            </div>
          </div>

          {/* Stamp Details */}
          <div>
            <h3 style={styles.sectionTitle}>Stamp Details</h3>
            <div style={styles.infoBox}>
              <p style={styles.infoRow}><span style={styles.label}>Document Type:</span> <span style={styles.value}>{order.documentType?.replace(/-/g, ' ') || 'N/A'}</span></p>
              <p style={styles.infoRow}><span style={styles.label}>State:</span> <span style={styles.value}>{formData.verificationPlace || 'Delhi'}</span></p>
              <p style={styles.infoRow}><span style={styles.label}>Order Status:</span> <span style={styles.statusBadge}>{order.status?.toUpperCase() || 'N/A'}</span></p>
              <p style={styles.infoRow}><span style={styles.label}>Payment Status:</span> <span style={styles.statusBadge}>{order.paymentStatus?.toUpperCase() || 'N/A'}</span></p>
            </div>
          </div>

          {/* Amount Breakdown */}
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>Description</th>
                <th style={styles.tableHeaderCell}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>Stamp Amount</td>
                <td style={styles.tableCellRight}>₹{parseFloat(stampAmount).toFixed(2)}</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>Platform Fee</td>
                <td style={styles.tableCellRight}>₹{platformFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>GST (18%)</td>
                <td style={styles.tableCellRight}>₹{gst}</td>
              </tr>
              <tr style={styles.totalRow}>
                <td style={styles.tableCell}>Total Payable</td>
                <td style={styles.tableCellRight}>₹{totalPayable}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div style={styles.footer}>
            <p>This is a system generated invoice. Stamp has been issued in the name of the First Party mentioned above.</p>
            <p style={{ marginTop: '8px' }}>For any queries, please contact support@easyestamp.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}