import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  deponent1Name: "",
  deponent1Relation: "S/O",
  deponent1Father: "",

  deponent2Name: "",
  deponent2Relation: "S/O",
  deponent2Father: "",

  address: "",

  studentName: "",
  course: "B.TECH",
  duration: "4",
  institute: "",

  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function EducationLoan() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Education_Loan_Affidavit.pdf",
        margin: 0,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
          scrollY: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: [] }, // ✅ single page only
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Education Loan Affidavit
          </h2>

          <Input label="Deponent (1) Name" name="deponent1Name" value={data.deponent1Name} onChange={update} />
          <Input label="Deponent (1) Father Name" name="deponent1Father" value={data.deponent1Father} onChange={update} />

          <Input label="Deponent (2) Name" name="deponent2Name" value={data.deponent2Name} onChange={update} />
          <Input label="Deponent (2) Father Name" name="deponent2Father" value={data.deponent2Father} onChange={update} />

          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Student Name" name="studentName" value={data.studentName} onChange={update} />
          <Input label="Institute Name" name="institute" value={data.institute} onChange={update} />

          <Input
            label="Verification Date (e.g. 3rd August 2018)"
            name="verificationDate"
            value={data.verificationDate}
            onChange={update}
          />

          <button
            onClick={downloadPDF}
            className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium"
          >
            Download PDF
          </button>
        </div>

        {/* ================= PDF PREVIEW ================= */}
        <div className="bg-gray-100 rounded shadow overflow-hidden flex justify-center h-screen">
          <div className="flex justify-center"
            style={{
              width: "100%",
              maxWidth: "100%",
            }}>
            <div style={{
              width: "100%",
              maxWidth: "820px",   // 👈 desktop limit
              aspectRatio: "210 / 297",
              display: "flex",
              justifyContent: "center",
            }}>

              <div
                ref={pdfRef}
                style={{
                  width: "210mm",
                  height: "297mm",
                  backgroundColor: "#fff",
                  color: "#000",
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: "12pt",
                  lineHeight: "1.55",
                  padding: "25px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                {/* TITLE */}
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginBottom: "22px",
                    fontSize: "15pt",
                  }}
                >
                  AFFIDAVIT
                </div>

                {/* INTRO */}
                <p style={{ textAlign: "justify" }}>
                  We, (1) <b>{data.deponent1Name || "____________________"}</b>{" "}
                  S/O <b>{data.deponent1Father || "____________________"}</b> (2){" "}
                  <b>{data.deponent2Name || "____________________"}</b> S/O{" "}
                  <b>{data.deponent2Father || "____________________"}</b> both R/o{" "}
                  <b>{data.address || "____________________"}</b>, do hereby
                  solemnly affirm and declare as under:-
                </p>

                {/* POINTS */}
                <div style={{ marginLeft: "20px", marginTop: "16px" }}>
                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    (I) That we are citizen of India.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    (II) That we are bonafide resident of{" "}
                    <b>{data.address || "____________________"}</b>.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    (III) That neither we nor any member of our family has applied
                    for/availed any type of Education Loan for any member of the
                    family from any bank / financial Institution.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    (IV) That we have applied for an education loan from State Bank
                    of India for{" "}
                    <b>{data.studentName || "____________________"}</b> for{" "}
                    <b>{data.course}</b> ({data.duration} years) from{" "}
                    <b>{data.institute || "____________________"}</b>.
                  </p>

                  <p style={{ marginTop: "6px" }}>
                    That this is a true statement.
                  </p>
                </div>

                {/* DEPONENTS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "45px",
                  }}
                >
                  <div>Deponent (1)</div>
                  <div>Deponent (2)</div>
                </div>

                {/* VERIFICATION */}
                <div style={{ marginTop: "30px" }}>
                  <p>
                    <b>Verification:-</b>
                  </p>
                  <p style={{ textAlign: "justify", marginTop: "10px" }}>
                    Verified at <b>{data.verificationPlace}</b> on{" "}
                    <b>{data.verificationDate || "__________"}</b> that the contents
                    of the above affidavit are true and correct to the best of my
                    knowledge and belief.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "40px",
                  }}
                >
                  <div>Deponent (1)</div>
                  <div>Deponent (2)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-purple-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}
