import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { Edit, Save, X } from "lucide-react";
import { documentAPI } from "../services/api";

export default function InvoiceModal({ order, onClose }) {
  const invoiceRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      // Initialize edited order with current order data
      setEditedOrder({
        ...order,
        formData: { ...order.formData },
        userId: { ...order.userId }
      });
    }
  }, [order]);

  const downloadPDF = () => {
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `Invoice_${order.orderId || order._id}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update the document request with edited data
      await documentAPI.updateStatus(order._id, {
        ...editedOrder,
        adminRemarks: editedOrder.adminRemarks
      });
      
      // Update local order data
      Object.assign(order, editedOrder);
      setIsEditing(false);
      alert("Invoice updated successfully!");
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedOrder({ ...order, formData: { ...order.formData }, userId: { ...order.userId } });
    setIsEditing(false);
  };

  const handleFieldChange = (section, field, value) => {
    setEditedOrder(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const formData = editedOrder?.formData || order.formData || {};
  const userId = editedOrder?.userId || order.userId || {};

  const stampAmount = order.paymentAmount || 0;
  const platformFee = 0;
  const gst = (stampAmount * 0.18).toFixed(2);
  const totalPayable = (stampAmount + platformFee + parseFloat(gst)).toFixed(2);

  const EditableField = ({ label, value, section, field, type = "text" }) => {
    if (!isEditing) {
      return <p><b>{label}:</b> {value || "N/A"}</p>;
    }
    return (
      <p>
        <b>{label}:</b>{" "}
        <input
          type={type}
          value={value || ""}
          onChange={(e) => handleFieldChange(section, field, e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 ml-2 w-40"
        />
      </p>
    );
  };

  const EditableTextArea = ({ label, value, section, field }) => {
    if (!isEditing) {
      return <p><b>{label}:</b> {value || "N/A"}</p>;
    }
    return (
      <p>
        <b>{label}:</b>{" "}
        <textarea
          value={value || ""}
          onChange={(e) => handleFieldChange(section, field, e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 ml-2 w-48"
          rows="2"
        />
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-[950px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
        
        {/* TOP BAR */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Edit size={16} />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* INVOICE CONTENT */}
        <div className="p-6">
          <div ref={invoiceRef} style={{ fontFamily: "Arial", fontSize: "14px", color: "#000" }}>
            
            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>Easy E-Stamp</h1>
                <p>Stamp Paper Invoice</p>
                <p style={{ fontWeight: "bold" }}>FinoLead Solutions Private Limited</p>
                <p>Email: info@easyestamp.com</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>INVOICE</p>
                <p>{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
                <p>Order ID: {order.orderId}</p>
                <p>CIN: U70200UP2025PTC223712</p>
                <p>GSTIN: 09AAGCF4064J1ZE</p>
              </div>
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* TWO COLUMN */}
            <div className="flex justify-between gap-6">
              
              {/* LEFT COLUMN */}
              <div style={{ width: "50%" }}>
                <p style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>Stamp Holder (First Party)</p>
                <EditableField label="Name" value={formData.name || formData.groomName || formData.applicantName} section="formData" field="name" />
                <EditableField label="Phone" value={formData.phone || formData.contact1} section="formData" field="phone" />
                <EditableField label="Father's Name" value={formData.fatherName || formData.groomFather} section="formData" field="fatherName" />
                <EditableField label="Second Party" value={formData.brideName || formData.spouseName || formData.secondParty} section="formData" field="secondParty" />

                <div style={{ marginTop: "15px" }}>
                  <p style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>Stamp Details</p>
                  <EditableField label="Stamp Type" value={order.documentType?.replace(/-/g, ' ') || "Agreement"} section="formData" field="documentType" />
                  <EditableField label="Stamp Sub Type" value={formData.stampSubType || "Residential Lease Agreement"} section="formData" field="stampSubType" />
                  <EditableField label="State" value={formData.state || formData.verificationPlace || "Delhi"} section="formData" field="state" />
                  <EditableField label="District" value={formData.district || "North West Delhi"} section="formData" field="district" />
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ width: "50%" }}>
                <p style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px", textAlign: "right" }}>Order Placed By</p>
                <div style={{ textAlign: "right" }}>
                  <EditableField label="Name" value={userId.name} section="userId" field="name" />
                  <EditableField label="Email" value={userId.email} section="userId" field="email" />
                  <EditableField label="Phone" value={userId.phone} section="userId" field="phone" />
                </div>

                <div style={{ marginTop: "15px", textAlign: "right" }}>
                  <p style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>Status</p>
                  <EditableField label="Order Status" value={order.status?.toUpperCase()} section="order" field="status" />
                  <EditableField label="Payment Status" value={order.paymentStatus?.toUpperCase()} section="order" field="paymentStatus" />
                </div>
              </div>
            </div>

            {/* AMOUNT TABLE */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "25px",
              }}
            >
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
                  <td style={cellRight}>₹{gst}</td>
                </tr>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <td style={{ ...cell, fontWeight: "bold" }}>Total Payable</td>
                  <td style={{ ...cellRight, fontWeight: "bold" }}>
                    ₹{totalPayable}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* FOOTER - FIXED WITH PROPER PADDING AND MARGIN */}
            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
              <p style={{ fontSize: "12px", textAlign: "center", color: "#666", margin: "0", padding: "10px 0" }}>
                This is a system generated invoice. Stamp has been issued in the name of the First Party mentioned above.
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Close
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/* TABLE STYLES */
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