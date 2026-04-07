import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

export default function InvoiceModal({ order, onClose }) {
  const invoiceRef = useRef();

  const downloadPDF = () => {
    const opt = {
      margin: 0.3,
      filename: `Invoice_${order.orderId || order._id}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  const formData = order.formData || {};

  const stampAmount = order.paymentAmount || 0;
  const platformFee = 0;
  const gst = (stampAmount * 0.18).toFixed(2);
  const totalPayable = (
    stampAmount +
    platformFee +
    parseFloat(gst)
  ).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto p-6">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* INVOICE */}
        <div ref={invoiceRef} style={{ fontFamily: "Arial", fontSize: "14px", color: "#000" }}>
          
          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>Easy E-Stamp</h1>
              <p>Stamp Paper Invoice</p>
              <p style={{ fontWeight: "bold" }}>FinoLead Solutions Private Limited</p>
              <p>Email: info@easyestamp.com</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ fontWeight: "bold" }}>INVOICE</p>
              <p>{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
              <p>Order ID: {order.orderId}</p>
              <p>CIN: U70200UP2025PTC223712</p>
              <p>GSTIN: 09AAGCF4064J1ZE</p>
            </div>
          </div>

          <hr style={{ margin: "15px 0" }} />

          {/* TWO COLUMN */}
          <div className="flex justify-between">
            
            {/* LEFT */}
            <div style={{ width: "48%" }}>
              <p style={{ fontWeight: "bold" }}>Stamp Holder (First Party)</p>

              <p><b>Name:</b> {formData.name || "N/A"}</p>
              <p><b>Phone:</b> {formData.phone || "N/A"}</p>
              <p><b>Second Party:</b> {formData.secondParty || "N/A"}</p>

              <br />

              <p><b>Stamp Type:</b> {order.documentType || "Agreement"}</p>
              <p><b>Stamp Sub Type:</b> Residential Lease Agreement</p>
              <p><b>State:</b> {formData.state || "Delhi"}</p>
            </div>

            {/* RIGHT */}
            <div style={{ width: "48%", textAlign: "right" }}>
              <p style={{ fontWeight: "bold" }}>Order Placed By</p>

              <p><b>{order.userId?.name || "N/A"}</b></p>
              <p>{order.userId?.email}</p>
              <p>{order.userId?.phone}</p>

              <br />

              <p><b>Order Status:</b> {order.status?.toUpperCase()}</p>
              <p><b>Payment Status:</b> {order.paymentStatus?.toUpperCase()}</p>
              <p><b>District:</b> {formData.district || "North West Delhi"}</p>
            </div>
          </div>

          {/* TABLE */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
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

              <tr>
                <td style={{ ...cell, fontWeight: "bold" }}>Total Payable</td>
                <td style={{ ...cellRight, fontWeight: "bold" }}>
                  ₹{totalPayable}
                </td>
              </tr>
            </tbody>
          </table>

          {/* FOOTER */}
          <p style={{ marginTop: "15px", fontSize: "12px" }}>
            This is a system generated invoice. Stamp has been issued in the name of the First Party mentioned above.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white">
            Close
          </button>
          <button onClick={downloadPDF} className="px-4 py-2 bg-blue-600 text-white">
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

/* TABLE STYLES */
const cellHeader = {
  border: "1px solid #000",
  padding: "8px",
  textAlign: "left",
};

const cellHeaderRight = {
  border: "1px solid #000",
  padding: "8px",
  textAlign: "right",
};

const cell = {
  border: "1px solid #000",
  padding: "8px",
};

const cellRight = {
  border: "1px solid #000",
  padding: "8px",
  textAlign: "right",
};