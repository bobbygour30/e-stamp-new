import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  User,
  FileText,
  Download,
  GraduationCap,
  Home,
  Building,
  Users,
  Phone,
  Mail,
  Briefcase,
  Truck,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Save
} from "lucide-react";
import { documentAPI } from "../services/api";

export default function OrderDetailsModal({ order, onClose, onStatusUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFormData, setEditedFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order?.status || "pending");

  if (!order) return null;

  const originalFormData = order.formData || {};

  useEffect(() => {
    if (order) {
      setEditedFormData({ ...order.formData });
      setAdminRemarks(order.adminRemarks || "");
      setCurrentStatus(order.status || "pending");
    }
  }, [order]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Helper to render field rows
  const FieldRow = ({ label, value }) => (
    <div className="py-3 border-b border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value || "N/A"}</p>
    </div>
  );

  const EditableFieldRow = ({ label, name, value, type = "text" }) => {
    if (!isEditing) {
      return <FieldRow label={label} value={value} />;
    }
    return (
      <div className="py-3 border-b border-gray-100">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <input
          type={type}
          value={editedFormData[name] !== undefined ? editedFormData[name] : (value || "")}
          onChange={(e) => setEditedFormData(prev => ({
            ...prev,
            [name]: e.target.value
          }))}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    );
  };

  const SectionTitle = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
      <Icon size={18} className="text-indigo-600" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );

  // Handle Approve
  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const response = await documentAPI.updateStatus(order._id, { 
        status: 'approved', 
        adminRemarks 
      });
      setCurrentStatus('approved');
      alert('Document approved successfully!');
      if (onStatusUpdate) onStatusUpdate();
      onClose();
    } catch (error) {
      console.error('Error approving document:', error);
      alert('Failed to approve document. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    if (!adminRemarks) {
      alert('Please add remarks before rejecting the document.');
      return;
    }
    setActionLoading(true);
    try {
      const response = await documentAPI.updateStatus(order._id, { 
        status: 'rejected', 
        adminRemarks 
      });
      setCurrentStatus('rejected');
      alert('Document rejected successfully!');
      if (onStatusUpdate) onStatusUpdate();
      onClose();
    } catch (error) {
      console.error('Error rejecting document:', error);
      alert('Failed to reject document. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      // Update the document with edited form data
      await documentAPI.updateStatus(order._id, {
        formData: editedFormData,
        adminRemarks
      });
      alert('Order updated successfully!');
      setIsEditing(false);
      if (onStatusUpdate) onStatusUpdate();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Determine document type to show relevant sections
  const docType = order.documentType;
  const formData = isEditing ? editedFormData : originalFormData;

  // Status badge color
  const getStatusColor = () => {
    switch (currentStatus) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={24} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
              {docType?.replace(/-/g, " ")}
            </span>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>
              {currentStatus?.toUpperCase() || "PENDING"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && currentStatus !== 'rejected' && currentStatus !== 'completed' && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedFormData({ ...originalFormData });
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {/* Order Information - Common for ALL documents */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="text-sm font-mono font-medium text-gray-900">
                  {order.orderId || order._id.slice(-8)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Document Type</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {docType?.replace(/-/g, " ") || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Order Status</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>
                  {currentStatus?.toUpperCase() || "PENDING"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  order.paymentStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.paymentStatus?.toUpperCase() || "PENDING"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="text-sm font-medium text-gray-900">
                  ₹{order.paymentAmount || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Submitted On</p>
                <p className="text-sm text-gray-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* ==================== MARRIAGE REGISTER / MARRIAGE REGISTRATION ==================== */}
          {(docType === "marriage-register" || docType === "marriage-registration") && (
            <>
              {(formData.groomName || formData.name) && (
                <div className="mb-6">
                  <SectionTitle title="Groom Details" icon={User} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <EditableFieldRow label="Groom Name" name="groomName" value={formData.groomName || formData.name} />
                    <EditableFieldRow label="Groom Father Name" name="groomFather" value={formData.groomFather || formData.fatherName} />
                    <div className="col-span-2">
                      <EditableFieldRow label="Groom Address" name="groomAddress" value={formData.groomAddress || formData.residentOf} />
                    </div>
                  </div>
                </div>
              )}

              {formData.brideName && (
                <div className="mb-6">
                  <SectionTitle title="Bride Details" icon={User} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <EditableFieldRow label="Bride Name" name="brideName" value={formData.brideName} />
                    <EditableFieldRow label="Bride Father Name" name="brideFather" value={formData.brideFather} />
                    <div className="col-span-2">
                      <EditableFieldRow label="Bride Address" name="brideAddress" value={formData.brideAddress} />
                    </div>
                  </div>
                </div>
              )}

              {formData.spouseName && (
                <div className="mb-6">
                  <SectionTitle title="Spouse Details" icon={User} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <EditableFieldRow label="Spouse Name" name="spouseName" value={formData.spouseName} />
                    <EditableFieldRow label="Spouse Father Name" name="spouseFatherName" value={formData.spouseFatherName} />
                    <div className="col-span-2">
                      <EditableFieldRow label="Spouse Address" name="spouseResidentOf" value={formData.spouseResidentOf} />
                    </div>
                  </div>
                </div>
              )}

              {(formData.marriageDate || formData.marriagePlace) && (
                <div className="mb-6">
                  <SectionTitle title="Marriage Details" icon={Calendar} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <EditableFieldRow label="Marriage Date" name="marriageDate" value={formData.marriageDate} />
                    <EditableFieldRow label="Marriage Place" name="marriagePlace" value={formData.marriagePlace} />
                    <EditableFieldRow label="Marriage According To" name="marriageAccordingTo" value={formData.marriageAccordingTo} />
                    <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace || "Delhi"} />
                    <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
                  </div>
                </div>
              )}

              {(formData.dob || formData.ageAtMarriage) && (
                <div className="mb-6">
                  <SectionTitle title="Personal Details" icon={Calendar} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <EditableFieldRow label="Date of Birth" name="dob" value={formData.dob} />
                    <EditableFieldRow label="Age at Marriage" name="ageAtMarriage" value={formData.ageAtMarriage} />
                    <EditableFieldRow label="Marital Status Before" name="maritalStatusBefore" value={formData.maritalStatusBefore} />
                    <EditableFieldRow label="Religion" name="religion" value={formData.religion} />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==================== AFTER MARRIAGE NAME CHANGE ==================== */}
          {docType === "after-marriage-name-change" && (
            <div className="mb-6">
              <SectionTitle title="Name Change Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EditableFieldRow label="Name" name="name" value={formData.name} />
                <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType} />
                <EditableFieldRow label="Relation Name" name="relationName" value={formData.relationName} />
                <EditableFieldRow label="Resident Of" name="residentOf" value={formData.residentOf} />
                <EditableFieldRow label="Name Before Marriage" name="nameBeforeMarriage" value={formData.nameBeforeMarriage} />
                <EditableFieldRow label="Name After Marriage" name="nameAfterMarriage" value={formData.nameAfterMarriage} />
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
              </div>
            </div>
          )}

          {/* ==================== NAME CHANGE / CORRECTION ==================== */}
          {(docType === "name-change" || docType === "name-correction") && (
            <div className="mb-6">
              <SectionTitle title="Name Change/Correction Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EditableFieldRow label="Name" name="name" value={formData.name} />
                <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType} />
                <EditableFieldRow label="Husband/Father Name" name="husbandName" value={formData.husbandName || formData.relationName} />
                <EditableFieldRow label="Address" name="address" value={formData.address || formData.residentOf} />
                <EditableFieldRow label="Correct Name" name="correctName" value={formData.correctName} />
                <EditableFieldRow label="Wrong Name" name="wrongName" value={formData.wrongName} />
                {formData.documentType1 && (
                  <>
                    <EditableFieldRow label="Document Type 1" name="documentType1" value={formData.documentType1} />
                    <EditableFieldRow label="Name As Per Document 1" name="nameAsPerDoc1" value={formData.nameAsPerDoc1} />
                    <EditableFieldRow label="Document Type 2" name="documentType2" value={formData.documentType2} />
                    <EditableFieldRow label="Name As Per Document 2" name="nameAsPerDoc2" value={formData.nameAsPerDoc2} />
                    <EditableFieldRow label="Old Name" name="oldName" value={formData.oldName} />
                    <EditableFieldRow label="New Name" name="newName" value={formData.newName} />
                  </>
                )}
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace || "Delhi"} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
              </div>
            </div>
          )}

          {/* ==================== ADDITIONAL NAME ==================== */}
          {docType === "additional-name" && (
            <div className="mb-6">
              <SectionTitle title="Additional Name Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EditableFieldRow label="Applicant Name" name="applicantName" value={formData.applicantName} />
                <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType} />
                <EditableFieldRow label="Father Name" name="fatherName" value={formData.fatherName} />
                <EditableFieldRow label="Address" name="address" value={formData.address} />
                <EditableFieldRow label="Son Name" name="sonName" value={formData.sonName} />
                <EditableFieldRow label="Date of Birth" name="dob" value={formData.dob} />
                <EditableFieldRow label="Old Name" name="oldName" value={formData.oldName} />
                <EditableFieldRow label="New Name" name="newName" value={formData.newName} />
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace || "Delhi"} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
              </div>
            </div>
          )}

          {/* ==================== SINGLE GIRL CHILD ==================== */}
          {docType === "single-girl" && (
            <div className="mb-6">
              <SectionTitle title="Single Girl Child Details" icon={Users} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EditableFieldRow label="Applicant Name" name="applicantName" value={formData.applicantName} />
                <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType} />
                <EditableFieldRow label="Father Name" name="fatherName" value={formData.fatherName} />
                <EditableFieldRow label="Age" name="age" value={formData.age} />
                <EditableFieldRow label="Occupation" name="occupation" value={formData.occupation} />
                <EditableFieldRow label="Address" name="address" value={formData.address} />
                <EditableFieldRow label="Girl Child Name" name="childName" value={formData.childName} />
                <EditableFieldRow label="Date of Birth" name="dob" value={formData.dob} />
                <EditableFieldRow label="Class Applied For" name="className" value={formData.className} />
                <EditableFieldRow label="Contact Number 1" name="contact1" value={formData.contact1} />
                <EditableFieldRow label="Contact Number 2" name="contact2" value={formData.contact2} />
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace || "Delhi"} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
              </div>
            </div>
          )}

          {/* ==================== FIRST BABY / BIRTH CERTIFICATE ==================== */}
          {(docType === "first-baby" || docType === "birth-certificate" || docType === "name-addition-birth-certificate") && (
            <div className="mb-6">
              <SectionTitle title="Birth/Child Details" icon={Users} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.fatherName && <EditableFieldRow label="Father Name" name="fatherName" value={formData.fatherName} />}
                {formData.motherName && <EditableFieldRow label="Mother Name" name="motherName" value={formData.motherName} />}
                {formData.name && <EditableFieldRow label="Name" name="name" value={formData.name} />}
                {formData.applicantName && <EditableFieldRow label="Applicant Name" name="applicantName" value={formData.applicantName} />}
                <EditableFieldRow label="Child Name" name="childName" value={formData.childName || formData.firstBornName} />
                <EditableFieldRow label="Date of Birth" name="birthDate" value={formData.birthDate || formData.dob} />
                <EditableFieldRow label="Place of Birth" name="birthPlace" value={formData.birthPlace} />
                <EditableFieldRow label="Class" name="className" value={formData.className} />
                <EditableFieldRow label="School Name" name="schoolName" value={formData.schoolName} />
                <EditableFieldRow label="Category" name="category" value={formData.category} />
                {formData.certificateNumber && <EditableFieldRow label="Certificate Number" name="certificateNumber" value={formData.certificateNumber} />}
                {formData.certificateDate && <EditableFieldRow label="Certificate Date" name="certificateDate" value={formData.certificateDate} />}
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace || "Delhi"} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
              </div>
            </div>
          )}

          {/* ==================== ADDRESS PROOF ==================== */}
          {docType === "address-proof" && (
            <div className="mb-6">
              <SectionTitle title="Address Details" icon={Home} />
              <div className="grid grid-cols-1 gap-3">
                <EditableFieldRow label="Name" name="name" value={formData.name} />
                <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType} />
                <EditableFieldRow label="Relation Name" name="relationName" value={formData.relationName} />
                <EditableFieldRow label="Resident Of" name="residentOf" value={formData.residentOf} />
                <EditableFieldRow label="Previous Address" name="oldAddress" value={formData.oldAddress} />
                <EditableFieldRow label="New Address" name="newAddress" value={formData.newAddress} />
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
              </div>
            </div>
          )}

          {/* ==================== SIGNATURE CHANGE ==================== */}
          {docType === "signature" && (
            <div className="mb-6">
              <SectionTitle title="Signature Change Details" icon={FileText} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EditableFieldRow label="Name" name="name" value={formData.name} />
                <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType} />
                <EditableFieldRow label="Relation Name" name="relationName" value={formData.relationName} />
                <EditableFieldRow label="Resident Of" name="residentOf" value={formData.residentOf} />
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Signature Lines:</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Signatures:</p>
                    <div className="flex gap-4 mt-2">
                      <div className="w-32 h-8 border-b border-gray-400"></div>
                      <div className="w-32 h-8 border-b border-gray-400"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">New Signatures:</p>
                    <div className="flex gap-4 mt-2">
                      <div className="w-32 h-8 border-b border-gray-400"></div>
                      <div className="w-32 h-8 border-b border-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== LOST DOCUMENT ==================== */}
          {docType === "lost-document" && (
            <div className="mb-6">
              <SectionTitle title="Lost Document Details" icon={AlertCircle} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EditableFieldRow label="Name" name="name" value={formData.name} />
                <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType} />
                <EditableFieldRow label="Relation Name" name="relationName" value={formData.relationName} />
                <EditableFieldRow label="Resident Of" name="residentOf" value={formData.residentOf} />
                <EditableFieldRow label="Lost Document Name" name="lostDocument" value={formData.lostDocument} />
                <EditableFieldRow label="Document Number" name="documentNumber" value={formData.documentNumber} />
                <EditableFieldRow label="Issued By" name="issuedBy" value={formData.issuedBy} />
                <EditableFieldRow label="Issued Date" name="issuedDate" value={formData.issuedDate} />
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate} />
              </div>
            </div>
          )}

          {/* ==================== SHORT ATTENDANCE / GAP YEAR / ANTI RAGGING / EDUCATION LOAN / INCOME ==================== */}
          {(docType === "short-attendence" || docType === "gap-year" || docType === "anti-ragging" || docType === "education-loan" || docType === "income") && (
            <div className="mb-6">
              <SectionTitle title="Student/Education Details" icon={GraduationCap} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EditableFieldRow label="Student Name" name="studentName" value={formData.name || formData.studentName} />
                <EditableFieldRow label="Father Name" name="fatherName" value={formData.fatherName} />
                <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType} />
                <EditableFieldRow label="Address" name="address" value={formData.address} />
                {formData.age && <EditableFieldRow label="Age" name="age" value={formData.age} />}
                {formData.collegeName && <EditableFieldRow label="College Name" name="collegeName" value={formData.collegeName} />}
                {formData.universityName && <EditableFieldRow label="University Name" name="universityName" value={formData.universityName} />}
                {formData.course && <EditableFieldRow label="Course" name="course" value={formData.course} />}
                {formData.year && <EditableFieldRow label="Year" name="year" value={formData.year} />}
                {formData.section && <EditableFieldRow label="Section" name="section" value={formData.section} />}
                {formData.hostelName && <EditableFieldRow label="Hostel Name" name="hostelName" value={formData.hostelName} />}
                {formData.guardianName && <EditableFieldRow label="Guardian Name" name="guardianName" value={formData.guardianName} />}
                {formData.guardianRelation && <EditableFieldRow label="Guardian Relation" name="guardianRelation" value={formData.guardianRelation} />}
                {formData.guardianAddress && <EditableFieldRow label="Guardian Address" name="guardianAddress" value={formData.guardianAddress} />}
                {formData.passedYear && <EditableFieldRow label="12th Passed Year" name="passedYear" value={formData.passedYear} />}
                {formData.gapClass && <EditableFieldRow label="Gap After Class" name="gapClass" value={formData.gapClass} />}
                {formData.gapFrom && <EditableFieldRow label="Gap From" name="gapFrom" value={formData.gapFrom} />}
                {formData.gapTo && <EditableFieldRow label="Gap To" name="gapTo" value={formData.gapTo} />}
                {formData.deponent1Name && <EditableFieldRow label="Deponent 1 Name" name="deponent1Name" value={formData.deponent1Name} />}
                {formData.deponent1Father && <EditableFieldRow label="Deponent 1 Father" name="deponent1Father" value={formData.deponent1Father} />}
                {formData.deponent2Name && <EditableFieldRow label="Deponent 2 Name" name="deponent2Name" value={formData.deponent2Name} />}
                {formData.deponent2Father && <EditableFieldRow label="Deponent 2 Father" name="deponent2Father" value={formData.deponent2Father} />}
                {formData.institute && <EditableFieldRow label="Institute Name" name="institute" value={formData.institute} />}
                {formData.income && <EditableFieldRow label="Annual Family Income" name="income" value={`₹${formData.income}`} />}
                {formData.category && <EditableFieldRow label="Category" name="category" value={formData.category} />}
                {formData.childName && <EditableFieldRow label="Child Name" name="childName" value={formData.childName} />}
                {formData.className && <EditableFieldRow label="Class" name="className" value={formData.className} />}
                {formData.schoolName && <EditableFieldRow label="School Name" name="schoolName" value={formData.schoolName} />}
                <EditableFieldRow label="Verification Place" name="verificationPlace" value={formData.verificationPlace || "Delhi"} />
                <EditableFieldRow label="Verification Date" name="verificationDate" value={formData.verificationDate || formData.date} />
              </div>
            </div>
          )}

          {/* ==================== RENTAL AGREEMENTS / RENT AGREEMENT ==================== */}
          {(docType === "rental-agreements" || docType === "rent-agreement") && (
            <>
              <div className="mb-6">
                <SectionTitle title="Owner/Licensor Details" icon={User} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <EditableFieldRow label="Owner Name" name="name" value={formData.name || formData.ownerName} />
                  <EditableFieldRow label="Relation Type" name="relationType" value={formData.relationType || formData.ownerRelation} />
                  <EditableFieldRow label="Relation Name" name="relationName" value={formData.relationName || formData.ownerRelationName} />
                  <EditableFieldRow label="Occupation" name="firstPartyOccupation" value={formData.firstPartyOccupation} />
                  <EditableFieldRow label="Restricted At" name="restrictedAt" value={formData.restrictedAt} />
                  <EditableFieldRow label="First Referred Party" name="firstReferredParty" value={formData.firstReferredParty} />
                  <EditableFieldRow label="Aadhaar Number" name="ownerAadhaar" value={formData.ownerAadhaar} />
                </div>
              </div>

              <div className="mb-6">
                <SectionTitle title="Tenant/Licensee Details" icon={Users} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <EditableFieldRow label="Tenant Name" name="tenantName" value={formData.tenantName || formData.secondPartyName} />
                  <EditableFieldRow label="Relation" name="tenantRelation" value={formData.tenantRelation || formData.relationType} />
                  <EditableFieldRow label="Relation Name" name="tenantRelationName" value={formData.tenantRelationName} />
                  <EditableFieldRow label="Father's Name" name="secondPartyFatherName" value={formData.secondPartyFatherName} />
                  <EditableFieldRow label="Age" name="secondPartyAge" value={formData.secondPartyAge} />
                  <EditableFieldRow label="Occupation" name="secondPartyOccupation" value={formData.secondPartyOccupation} />
                  <EditableFieldRow label="Address" name="tenantAddress" value={formData.tenantAddress || formData.secondPartyAddress} />
                  <EditableFieldRow label="Aadhaar Number" name="tenantAadhaar" value={formData.tenantAadhaar} />
                </div>
              </div>

              <div className="mb-6">
                <SectionTitle title="Property Details" icon={Home} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <EditableFieldRow label="Property Address" name="propertyAddress" value={formData.propertyAddress} />
                  <EditableFieldRow label="Property Area" name="propertyArea" value={formData.propertyArea} />
                  <EditableFieldRow label="Property Type" name="propertyType" value={formData.propertyType} />
                  <EditableFieldRow label="Sub-Registrar Office" name="subRegistrarOffice" value={formData.subRegistrarOffice} />
                </div>
              </div>

              <div className="mb-6">
                <SectionTitle title="License/Rent Details" icon={FileText} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FieldRow label="License Duration" value="11 months" />
                  <EditableFieldRow label="License Start Date" name="licenseStartDate" value={formData.licenseStartDate} />
                  <EditableFieldRow label="License End Date" name="licenseEndDate" value={formData.licenseEndDate} />
                  <EditableFieldRow label="Monthly Rent" name="monthlyRent" value={formData.monthlyRent ? `₹${formData.monthlyRent}` : "N/A"} />
                  <EditableFieldRow label="Monthly Rent (Words)" name="monthlyRentWords" value={formData.monthlyRentWords} />
                  <EditableFieldRow label="Maintenance Charges" name="maintenance" value={formData.maintenance ? `₹${formData.maintenance}` : "N/A"} />
                  <EditableFieldRow label="Security Amount" name="securityAmount" value={formData.securityAmount ? `₹${formData.securityAmount}` : "N/A"} />
                  <EditableFieldRow label="Rent Payable Day" name="rentDay" value={formData.rentDay} />
                  <EditableFieldRow label="Payment Mode" name="paymentMode" value={formData.paymentMode} />
                  <EditableFieldRow label="Payment Due Day" name="paymentDueDay" value={formData.paymentDueDay} />
                  <EditableFieldRow label="Notice Period" name="noticePeriod" value={formData.noticePeriod ? `${formData.noticePeriod} months` : "N/A"} />
                  <EditableFieldRow label="Rent Increment" name="increment" value={formData.increment ? `${formData.increment}%` : "N/A"} />
                  <EditableFieldRow label="Purpose of Rent" name="purpose" value={formData.purpose} />
                </div>
              </div>

              {(formData.witnessName || formData.witnessAddress) && (
                <div className="mb-6">
                  <SectionTitle title="Witness Details" icon={Users} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <EditableFieldRow label="Witness Name" name="witnessName" value={formData.witnessName} />
                    <EditableFieldRow label="Witness Address" name="witnessAddress" value={formData.witnessAddress} />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Admin Remarks Section */}
          <div className="mb-6">
            <SectionTitle title="Admin Remarks" icon={FileText} />
            <textarea
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add remarks about this order..."
            />
          </div>

          {/* Action Buttons - Approve/Reject */}
          {currentStatus !== 'approved' && currentStatus !== 'rejected' && currentStatus !== 'completed' && (
            <div className="flex gap-3 mb-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
              >
                <CheckCircle size={18} />
                {actionLoading ? "Processing..." : "✓ Approve Document"}
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
              >
                <XCircle size={18} />
                {actionLoading ? "Processing..." : "✗ Reject Document"}
              </button>
            </div>
          )}

          {/* Show status message if already approved/rejected */}
          {currentStatus === 'approved' && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">This document has been approved</p>
            </div>
          )}

          {currentStatus === 'rejected' && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 text-center">
              <XCircle size={24} className="text-red-600 mx-auto mb-2" />
              <p className="text-red-800 font-medium">This document has been rejected</p>
            </div>
          )}

          {currentStatus === 'completed' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <CheckCircle size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 font-medium">This document has been completed</p>
            </div>
          )}

          {/* PDF Download */}
          {order.pdfUrl && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <a
                href={order.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Download size={18} />
                Download Generated PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}