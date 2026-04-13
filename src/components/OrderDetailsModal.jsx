import React from 'react';
import { X, Calendar, MapPin, User, FileText, Download, GraduationCap, Home, Building, Users, Phone, Mail, Briefcase, Truck, DollarSign, AlertCircle } from 'lucide-react';

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const formData = order.formData || {};
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper to render field rows
  const FieldRow = ({ label, value }) => (
    <div className="py-3 border-b border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value || 'N/A'}</p>
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
      <Icon size={18} className="text-indigo-600" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );

  // Determine document type to show relevant sections
  const docType = order.documentType;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={24} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
              {docType?.replace(/-/g, ' ')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {/* Order Information - Common for ALL documents */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="text-sm font-mono font-medium text-gray-900">{order.orderId || order._id.slice(-8)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Document Type</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{docType?.replace(/-/g, ' ') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Order Status</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="text-sm font-medium text-gray-900">₹{order.paymentAmount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Submitted On</p>
                <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* ==================== MARRIAGE REGISTER / MARRIAGE REGISTRATION ==================== */}
          {(docType === 'marriage-register' || docType === 'marriage-registration') && (
            <>
              {/* Groom Details */}
              {(formData.groomName || formData.name) && (
                <div className="mb-6">
                  <SectionTitle title="Groom Details" icon={User} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldRow label="Groom Name" value={formData.groomName || formData.name} />
                    <FieldRow label="Groom Father Name" value={formData.groomFather || formData.fatherName} />
                    <div className="col-span-2">
                      <FieldRow label="Groom Address" value={formData.groomAddress || formData.residentOf} />
                    </div>
                  </div>
                </div>
              )}

              {/* Bride Details */}
              {formData.brideName && (
                <div className="mb-6">
                  <SectionTitle title="Bride Details" icon={User} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldRow label="Bride Name" value={formData.brideName} />
                    <FieldRow label="Bride Father Name" value={formData.brideFather} />
                    <div className="col-span-2">
                      <FieldRow label="Bride Address" value={formData.brideAddress} />
                    </div>
                  </div>
                </div>
              )}

              {/* Spouse Details (for marriage-registration) */}
              {formData.spouseName && (
                <div className="mb-6">
                  <SectionTitle title="Spouse Details" icon={User} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldRow label="Spouse Name" value={formData.spouseName} />
                    <FieldRow label="Spouse Father Name" value={formData.spouseFatherName} />
                    <div className="col-span-2">
                      <FieldRow label="Spouse Address" value={formData.spouseResidentOf} />
                    </div>
                  </div>
                </div>
              )}

              {/* Marriage Details */}
              {(formData.marriageDate || formData.marriagePlace) && (
                <div className="mb-6">
                  <SectionTitle title="Marriage Details" icon={Calendar} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldRow label="Marriage Date" value={formatDate(formData.marriageDate)} />
                    <FieldRow label="Marriage Place" value={formData.marriagePlace} />
                    <FieldRow label="Marriage According To" value={formData.marriageAccordingTo} />
                    <FieldRow label="Verification Place" value={formData.verificationPlace || 'Delhi'} />
                    <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
                  </div>
                </div>
              )}

              {/* Personal Details */}
              {(formData.dob || formData.ageAtMarriage) && (
                <div className="mb-6">
                  <SectionTitle title="Personal Details" icon={Calendar} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldRow label="Date of Birth" value={formatDate(formData.dob)} />
                    <FieldRow label="Age at Marriage" value={formData.ageAtMarriage} />
                    <FieldRow label="Marital Status Before" value={formData.maritalStatusBefore} />
                    <FieldRow label="Religion" value={formData.religion} />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==================== AFTER MARRIAGE NAME CHANGE ==================== */}
          {docType === 'after-marriage-name-change' && (
            <div className="mb-6">
              <SectionTitle title="Name Change Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldRow label="Name" value={formData.name} />
                <FieldRow label="Relation Type" value={formData.relationType} />
                <FieldRow label="Relation Name" value={formData.relationName} />
                <FieldRow label="Resident Of" value={formData.residentOf} />
                <FieldRow label="Name Before Marriage" value={formData.nameBeforeMarriage} />
                <FieldRow label="Name After Marriage" value={formData.nameAfterMarriage} />
                <FieldRow label="Verification Place" value={formData.verificationPlace} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
              </div>
            </div>
          )}

          {/* ==================== NAME CHANGE / CORRECTION ==================== */}
          {(docType === 'name-change' || docType === 'name-correction') && (
            <div className="mb-6">
              <SectionTitle title="Name Change/Correction Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldRow label="Name" value={formData.name} />
                <FieldRow label="Relation Type" value={formData.relationType} />
                <FieldRow label="Husband/Father Name" value={formData.husbandName || formData.relationName} />
                <FieldRow label="Address" value={formData.address || formData.residentOf} />
                <FieldRow label="Correct Name" value={formData.correctName} />
                <FieldRow label="Wrong Name" value={formData.wrongName} />
                {formData.documentType1 && (
                  <>
                    <FieldRow label="Document Type 1" value={formData.documentType1} />
                    <FieldRow label="Name As Per Document 1" value={formData.nameAsPerDoc1} />
                    <FieldRow label="Document Type 2" value={formData.documentType2} />
                    <FieldRow label="Name As Per Document 2" value={formData.nameAsPerDoc2} />
                    <FieldRow label="Old Name" value={formData.oldName} />
                    <FieldRow label="New Name" value={formData.newName} />
                  </>
                )}
                <FieldRow label="Verification Place" value={formData.verificationPlace || 'Delhi'} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
              </div>
            </div>
          )}

          {/* ==================== ADDITIONAL NAME ==================== */}
          {docType === 'additional-name' && (
            <div className="mb-6">
              <SectionTitle title="Additional Name Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldRow label="Applicant Name" value={formData.applicantName} />
                <FieldRow label="Relation Type" value={formData.relationType} />
                <FieldRow label="Father Name" value={formData.fatherName} />
                <FieldRow label="Address" value={formData.address} />
                <FieldRow label="Son Name" value={formData.sonName} />
                <FieldRow label="Date of Birth" value={formatDate(formData.dob)} />
                <FieldRow label="Old Name" value={formData.oldName} />
                <FieldRow label="New Name" value={formData.newName} />
                <FieldRow label="Verification Place" value={formData.verificationPlace || 'Delhi'} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
              </div>
            </div>
          )}

          {/* ==================== SINGLE GIRL CHILD ==================== */}
          {docType === 'single-girl' && (
            <div className="mb-6">
              <SectionTitle title="Single Girl Child Details" icon={Users} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldRow label="Applicant Name" value={formData.applicantName} />
                <FieldRow label="Relation Type" value={formData.relationType} />
                <FieldRow label="Father Name" value={formData.fatherName} />
                <FieldRow label="Age" value={formData.age} />
                <FieldRow label="Occupation" value={formData.occupation} />
                <FieldRow label="Address" value={formData.address} />
                <FieldRow label="Girl Child Name" value={formData.childName} />
                <FieldRow label="Date of Birth" value={formatDate(formData.dob)} />
                <FieldRow label="Class Applied For" value={formData.className} />
                <FieldRow label="Contact Number 1" value={formData.contact1} />
                <FieldRow label="Contact Number 2" value={formData.contact2} />
                <FieldRow label="Verification Place" value={formData.verificationPlace || 'Delhi'} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
              </div>
            </div>
          )}

          {/* ==================== FIRST BABY / BIRTH CERTIFICATE ==================== */}
          {(docType === 'first-baby' || docType === 'birth-certificate' || docType === 'name-addition-birth-certificate') && (
            <div className="mb-6">
              <SectionTitle title="Birth/Child Details" icon={Users} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.fatherName && <FieldRow label="Father Name" value={formData.fatherName} />}
                {formData.motherName && <FieldRow label="Mother Name" value={formData.motherName} />}
                {formData.name && <FieldRow label="Name" value={formData.name} />}
                {formData.applicantName && <FieldRow label="Applicant Name" value={formData.applicantName} />}
                <FieldRow label="Child Name" value={formData.childName || formData.firstBornName} />
                <FieldRow label="Date of Birth" value={formatDate(formData.birthDate || formData.dob)} />
                <FieldRow label="Place of Birth" value={formData.birthPlace} />
                <FieldRow label="Class" value={formData.className} />
                <FieldRow label="School Name" value={formData.schoolName} />
                <FieldRow label="Category" value={formData.category} />
                {formData.certificateNumber && <FieldRow label="Certificate Number" value={formData.certificateNumber} />}
                {formData.certificateDate && <FieldRow label="Certificate Date" value={formatDate(formData.certificateDate)} />}
                <FieldRow label="Verification Place" value={formData.verificationPlace || 'Delhi'} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
              </div>
            </div>
          )}

          {/* ==================== ADDRESS PROOF ==================== */}
          {docType === 'address-proof' && (
            <div className="mb-6">
              <SectionTitle title="Address Details" icon={Home} />
              <div className="grid grid-cols-1 gap-3">
                <FieldRow label="Name" value={formData.name} />
                <FieldRow label="Relation Type" value={formData.relationType} />
                <FieldRow label="Relation Name" value={formData.relationName} />
                <FieldRow label="Resident Of" value={formData.residentOf} />
                <FieldRow label="Previous Address" value={formData.oldAddress} />
                <FieldRow label="New Address" value={formData.newAddress} />
                <FieldRow label="Verification Place" value={formData.verificationPlace} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
              </div>
            </div>
          )}

          {/* ==================== SIGNATURE CHANGE ==================== */}
          {docType === 'signature' && (
            <div className="mb-6">
              <SectionTitle title="Signature Change Details" icon={FileText} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldRow label="Name" value={formData.name} />
                <FieldRow label="Relation Type" value={formData.relationType} />
                <FieldRow label="Relation Name" value={formData.relationName} />
                <FieldRow label="Resident Of" value={formData.residentOf} />
                <FieldRow label="Verification Place" value={formData.verificationPlace} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
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
          {docType === 'lost-document' && (
            <div className="mb-6">
              <SectionTitle title="Lost Document Details" icon={AlertCircle} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldRow label="Name" value={formData.name} />
                <FieldRow label="Relation Type" value={formData.relationType} />
                <FieldRow label="Relation Name" value={formData.relationName} />
                <FieldRow label="Resident Of" value={formData.residentOf} />
                <FieldRow label="Lost Document Name" value={formData.lostDocument} />
                <FieldRow label="Document Number" value={formData.documentNumber} />
                <FieldRow label="Issued By" value={formData.issuedBy} />
                <FieldRow label="Issued Date" value={formatDate(formData.issuedDate)} />
                <FieldRow label="Verification Place" value={formData.verificationPlace} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate)} />
              </div>
            </div>
          )}

          {/* ==================== SHORT ATTENDANCE / GAP YEAR / ANTI RAGGING / EDUCATION LOAN ==================== */}
          {(docType === 'short-attendence' || docType === 'gap-year' || docType === 'anti-ragging' || docType === 'education-loan' || docType === 'income') && (
            <div className="mb-6">
              <SectionTitle title="Student/Education Details" icon={GraduationCap} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldRow label="Student Name" value={formData.name || formData.studentName} />
                <FieldRow label="Father Name" value={formData.fatherName} />
                <FieldRow label="Relation Type" value={formData.relationType} />
                <FieldRow label="Address" value={formData.address} />
                {formData.age && <FieldRow label="Age" value={formData.age} />}
                {formData.collegeName && <FieldRow label="College Name" value={formData.collegeName} />}
                {formData.universityName && <FieldRow label="University Name" value={formData.universityName} />}
                {formData.course && <FieldRow label="Course" value={formData.course} />}
                {formData.year && <FieldRow label="Year" value={formData.year} />}
                {formData.section && <FieldRow label="Section" value={formData.section} />}
                {formData.hostelName && <FieldRow label="Hostel Name" value={formData.hostelName} />}
                {formData.guardianName && <FieldRow label="Guardian Name" value={formData.guardianName} />}
                {formData.guardianRelation && <FieldRow label="Guardian Relation" value={formData.guardianRelation} />}
                {formData.guardianAddress && <FieldRow label="Guardian Address" value={formData.guardianAddress} />}
                {formData.passedYear && <FieldRow label="12th Passed Year" value={formData.passedYear} />}
                {formData.gapClass && <FieldRow label="Gap After Class" value={formData.gapClass} />}
                {formData.gapFrom && <FieldRow label="Gap From" value={formData.gapFrom} />}
                {formData.gapTo && <FieldRow label="Gap To" value={formData.gapTo} />}
                {formData.deponent1Name && <FieldRow label="Deponent 1 Name" value={formData.deponent1Name} />}
                {formData.deponent1Father && <FieldRow label="Deponent 1 Father" value={formData.deponent1Father} />}
                {formData.deponent2Name && <FieldRow label="Deponent 2 Name" value={formData.deponent2Name} />}
                {formData.deponent2Father && <FieldRow label="Deponent 2 Father" value={formData.deponent2Father} />}
                {formData.institute && <FieldRow label="Institute Name" value={formData.institute} />}
                {formData.income && <FieldRow label="Annual Family Income" value={`₹${formData.income}`} />}
                {formData.category && <FieldRow label="Category" value={formData.category} />}
                {formData.childName && <FieldRow label="Child Name" value={formData.childName} />}
                {formData.className && <FieldRow label="Class" value={formData.className} />}
                {formData.schoolName && <FieldRow label="School Name" value={formData.schoolName} />}
                <FieldRow label="Verification Place" value={formData.verificationPlace || 'Delhi'} />
                <FieldRow label="Verification Date" value={formatDate(formData.verificationDate || formData.date)} />
              </div>
            </div>
          )}

          {/* ==================== RENTAL AGREEMENTS / RENT AGREEMENT ==================== */}
{(docType === 'rental-agreements' || docType === 'rent-agreement') && (
  <>
    <div className="mb-6">
      <SectionTitle title="Owner/Licensor Details" icon={User} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldRow label="Owner Name" value={formData.name || formData.ownerName} />
        <FieldRow label="Relation Type" value={formData.relationType || formData.ownerRelation} />
        <FieldRow label="Relation Name" value={formData.relationName || formData.ownerRelationName} />
        <FieldRow label="Occupation" value={formData.firstPartyOccupation} />
        <FieldRow label="Restricted At" value={formData.restrictedAt} />
        <FieldRow label="First Referred Party" value={formData.firstReferredParty} />
        <FieldRow label="Aadhaar Number" value={formData.ownerAadhaar} />
      </div>
    </div>

    <div className="mb-6">
      <SectionTitle title="Tenant/Licensee Details" icon={Users} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldRow label="Tenant Name" value={formData.tenantName || formData.secondPartyName} />
        <FieldRow label="Relation" value={formData.tenantRelation || formData.relationType} />
        <FieldRow label="Relation Name" value={formData.tenantRelationName} />
        <FieldRow label="Father's Name" value={formData.secondPartyFatherName} />
        <FieldRow label="Age" value={formData.secondPartyAge} />
        <FieldRow label="Occupation" value={formData.secondPartyOccupation} />
        <FieldRow label="Address" value={formData.tenantAddress || formData.secondPartyAddress} />
        <FieldRow label="Aadhaar Number" value={formData.tenantAadhaar} />
      </div>
    </div>

    <div className="mb-6">
      <SectionTitle title="Property Details" icon={Home} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldRow label="Property Address" value={formData.propertyAddress} />
        <FieldRow label="Property Area" value={formData.propertyArea} />
        <FieldRow label="Property Type" value={formData.propertyType} />
        <FieldRow label="Sub-Registrar Office" value={formData.subRegistrarOffice} />
      </div>
    </div>

    <div className="mb-6">
      <SectionTitle title="License/Rent Details" icon={FileText} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldRow label="License Duration" value="11 months" />
        <FieldRow label="License Start Date" value={formatDate(formData.licenseStartDate)} />
        <FieldRow label="License End Date" value={formatDate(formData.licenseEndDate)} />
        <FieldRow label="Monthly Rent" value={formData.monthlyRent ? `₹${formData.monthlyRent}` : 'N/A'} />
        <FieldRow label="Monthly Rent (Words)" value={formData.monthlyRentWords} />
        <FieldRow label="Maintenance Charges" value={formData.maintenance ? `₹${formData.maintenance}` : 'N/A'} />
        <FieldRow label="Security Amount" value={formData.securityAmount ? `₹${formData.securityAmount}` : 'N/A'} />
        <FieldRow label="Rent Payable Day" value={formData.rentDay} />
        <FieldRow label="Payment Mode" value={formData.paymentMode} />
        <FieldRow label="Payment Due Day" value={formData.paymentDueDay} />
        <FieldRow label="Notice Period" value={formData.noticePeriod ? `${formData.noticePeriod} months` : 'N/A'} />
        <FieldRow label="Rent Increment" value={formData.increment ? `${formData.increment}%` : 'N/A'} />
        <FieldRow label="Purpose of Rent" value={formData.purpose} />
      </div>
    </div>

    {/* Witness Details */}
    {(formData.witnessName || formData.witnessAddress) && (
      <div className="mb-6">
        <SectionTitle title="Witness Details" icon={Users} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldRow label="Witness Name" value={formData.witnessName} />
          <FieldRow label="Witness Address" value={formData.witnessAddress} />
        </div>
      </div>
    )}
  </>
)}

          {/* Admin Remarks */}
          {order.adminRemarks && (
            <div className="mb-6">
              <SectionTitle title="Admin Remarks" icon={FileText} />
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{order.adminRemarks}</p>
              </div>
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