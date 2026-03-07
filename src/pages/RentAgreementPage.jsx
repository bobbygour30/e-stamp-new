import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  ownerName: "",
  ownerRelation: "S/O",
  ownerRelationName: "",
  ownerAddress: "",
  ownerAadhaar: "",

  tenantName: "",
  tenantRelation: "S/O",
  tenantRelationName: "",
  tenantAddress: "",
  tenantAadhaar: "",

  propertyAddress: "",
  monthlyRent: "",
  maintenance: "",
  rentDay: "",
  securityAmount: "",

  paymentMethod: "Cash",
  duration: "",
  startDate: "",
  endDate: "",
  noticePeriod: "",
  increment: "",
  purpose: "",
};

export default function RentAgreementPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const previewRef = useRef();

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    const element = previewRef.current;

    html2pdf()
      .from(element)
      .set({
        margin: [8, 6, 8, 6], // even tighter margins
        filename: "Rent_Agreement.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 794,
          backgroundColor: "#fffdf5", // force background in canvas
          allowTaint: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT - FORM */}
        <div className="bg-[#fbf5e6] p-6 rounded shadow">
          <div className="mb-4">
            <div className="text-sm mb-1">Step {step} of 4</div>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="h-2 bg-orange-400 rounded"
                style={{ width: `${step * 25}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <>
              <Input label="Owner Name" name="ownerName" value={data.ownerName} onChange={update} />
              <Input label="Relation" name="ownerRelation" value={data.ownerRelation} onChange={update} />
              <Input label="Related Person Name" name="ownerRelationName" value={data.ownerRelationName} onChange={update} />
              <Input label="Permanent Address" name="ownerAddress" value={data.ownerAddress} onChange={update} />
              <Input label="Aadhaar Number" name="ownerAadhaar" value={data.ownerAadhaar} onChange={update} />
            </>
          )}

          {step === 2 && (
            <>
              <Input label="Tenant Name" name="tenantName" value={data.tenantName} onChange={update} />
              <Input label="Relation" name="tenantRelation" value={data.tenantRelation} onChange={update} />
              <Input label="Related Person Name" name="tenantRelationName" value={data.tenantRelationName} onChange={update} />
              <Input label="Permanent Address" name="tenantAddress" value={data.tenantAddress} onChange={update} />
              <Input label="Aadhaar Number" name="tenantAadhaar" value={data.tenantAadhaar} onChange={update} />
            </>
          )}

          {step === 3 && (
            <>
              <Input label="Property Address" name="propertyAddress" value={data.propertyAddress} onChange={update} />
              <Input label="Monthly Rent" name="monthlyRent" value={data.monthlyRent} onChange={update} />
              <Input label="Maintenance Charges" name="maintenance" value={data.maintenance} onChange={update} />
              <Input label="Rent Payable Day" name="rentDay" value={data.rentDay} onChange={update} />
              <Input label="Security Amount" name="securityAmount" value={data.securityAmount} onChange={update} />
            </>
          )}

          {step === 4 && (
            <>
              <Input label="Security Payment Method" name="paymentMethod" value={data.paymentMethod} onChange={update} />
              <Input label="Duration (Months)" name="duration" value={data.duration} onChange={update} />
              <Input label="Start Date" name="startDate" value={data.startDate} onChange={update} />
              <Input label="End Date" name="endDate" value={data.endDate} onChange={update} />
              <Input label="Notice Period (Months)" name="noticePeriod" value={data.noticePeriod} onChange={update} />
              <Input label="Rent Increment (%)" name="increment" value={data.increment} onChange={update} />
              <Input label="Purpose of Rent" name="purpose" value={data.purpose} onChange={update} />
            </>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
              >
                Next
              </button>
            ) : (
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download PDF
              </button>
            )}
          </div>
        </div>

        {/* RIGHT - PREVIEW */}
        <div className="bg-gray-100 p-4 rounded shadow overflow-y-auto max-h-[90vh]">
          <div
            ref={previewRef}
            style={{
              position: "relative",
              width: "210mm",
              height: "594mm", // exactly 2 A4 pages
              backgroundColor: "#fffdf5",
              color: "#111827",
              fontFamily: "monospace",
              padding: "12mm 10mm", // tighter padding
              boxSizing: "border-box",
              margin: "0 auto",
              fontSize: "9.8pt", // smaller font to fit
              lineHeight: "1.3",
              overflow: "hidden",
            }}
          >
            {/* Full-page background filler (invisible div to ensure color covers empty space) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#fffdf5",
                zIndex: -1,
              }}
            />

            <h1
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "15pt",
                margin: "0 0 10px 0",
              }}
            >
              RENT AGREEMENT
            </h1>

            <p style={{ margin: "0 0 8px 0", fontSize: "9.5pt" }}>
              THIS AGREEMENT IS MADE AND EXECUTED AT{" "}
              <b>{data.propertyAddress || "__________"}</b> ON THIS{" "}
              <b>{data.startDate || "__________"}</b>, BY AND BETWEEN:
            </p>

            <p style={{ margin: "6px 0" }}>
              <b>{data.ownerName || "__________"}</b>{" "}
              ({data.ownerRelation || "___"} {data.ownerRelationName || "__________"}){" "}
              (Aadhaar No. <b>{data.ownerAadhaar || "__________"}</b>)
              <br />
              (Hereinafter called the First Party/Owner)
            </p>

            <p style={{ margin: "8px 0", fontWeight: "bold", textAlign: "center" }}>
              AND
            </p>

            <p style={{ margin: "6px 0" }}>
              <b>{data.tenantName || "__________"}</b>{" "}
              ({data.tenantRelation || "___"} {data.tenantRelationName || "__________"}){" "}
              (Aadhaar No. <b>{data.tenantAadhaar || "__________"}</b>)
              <br />
              (Hereinafter called the Second Party/Tenant)
            </p>

            <p style={{ margin: "8px 0 10px 0", fontSize: "9.5pt" }}>
              The expression of both the parties shall mean and include their respective legal heirs, executors, administrators, representatives and legal assigns.
            </p>

            <p style={{ margin: "0 0 8px 0" }}>
              WHEREAS the first party is the true and lawful owner of{" "}
              <b>{data.propertyAddress || "__________"}</b> (hereinafter called the property) and WHEREAS on the request of the second party the first party wants to let out the said property on the following terms and conditions:
            </p>

            <ol style={{ margin: "8px 0 0 0", paddingLeft: "16px", listStyleType: "decimal" }}>
              <li style={{ marginBottom: "4px" }}>
                Monthly rent is fixed at ₹<b>{data.monthlyRent || "______"}</b>/- payable in advance on or before <b>{data.rentDay || "___"}</b> of each English calendar month.
              </li>
              <li style={{ marginBottom: "4px" }}>
                The tenancy is for <b>{data.duration || "___"}</b> months w.e.f. <b>{data.startDate || "________"}</b>. Tenant to vacate after expiry.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Second Party shall pay Water & Electricity bills as per consumption (extra).
              </li>
              <li style={{ marginBottom: "4px" }}>House tax shall be paid by First Party.</li>
              <li style={{ marginBottom: "4px" }}>
                Maintenance charges ₹<b>{data.maintenance || "______"}</b> payable by Second Party.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Security deposit of ₹<b>{data.securityAmount || "______"}</b>/- received via <b>{data.paymentMethod || "________"}</b>. Refundable without interest on vacating.
              </li>
              <li style={{ marginBottom: "4px" }}>
                If First Party wants early termination, <b>{data.noticePeriod || "___"}</b> months' notice shall be given.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Tenancy may be extended by mutual consent with <b>{data.increment || "___"}</b>% rent increase.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Second Party shall not sublet the premises or any part thereof.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Non-payment of rent for one month shall lead to automatic cancellation.
              </li>
              <li style={{ marginBottom: "4px" }}>Second Party to abide by all statutory rules.</li>
              <li style={{ marginBottom: "4px" }}>
                Premises to be used only for <b>{data.purpose || "________"}</b> purpose.
              </li>
              <li style={{ marginBottom: "4px" }}>No additions/alterations without permission.</li>
              <li style={{ marginBottom: "4px" }}>Minor repairs by tenant, major by owner.</li>
              <li style={{ marginBottom: "4px" }}>No illegal/unlawful activities.</li>
              <li style={{ marginBottom: "4px" }}>No inflammable/explosive materials.</li>
              <li style={{ marginBottom: "4px" }}>First Party may inspect premises with prior notice.</li>
              <li style={{ marginBottom: "4px" }}>No loan/credit card applications using premises address.</li>
              <li style={{ marginBottom: "4px" }}>
                Breach allows First Party to evict and take possession.
              </li>
              <li style={{ marginBottom: "2px" }}>
                Disputes subject to __________ jurisdiction.
              </li>
            </ol>

            {/* Force page break to page 2 for signatures */}
            <div style={{ pageBreakAfter: "always", margin: "0" }}></div>

            <p style={{ margin: "8px 0 6px 0" }}>
              IN WITNESS WHEREOF the parties have signed this agreement on the day and year first above written.
            </p>

            <div style={{ marginTop: "12px" }}>
              <p style={{ margin: "3px 0" }}>WITNESSES:</p>
              <p style={{ margin: "3px 0" }}>1. ____________________ (FIRST PARTY)</p>
              <p style={{ margin: "3px 0" }}>2. ____________________ (SECOND PARTY)</p>
            </div>

            {/* Filler to ensure page 2 is fully colored if content is short */}
            <div style={{ height: "200mm", marginTop: "20px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="text-sm block mb-1 font-medium">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}