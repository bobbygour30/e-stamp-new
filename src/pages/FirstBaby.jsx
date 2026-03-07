import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  fatherName: "",
  motherName: "",
  residentOf: "",

  childName: "",
  className: "",
  category: "",
  schoolName: "",

  firstBornName: "",
  birthDate: "",
  birthPlace: "",

  verificationPlace: "Delhi",
  verificationDay: "",
};

export default function FirstBaby() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "First_Born_Child_Affidavit.pdf",
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
        pagebreak: { mode: [] }, // force single page
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            First Born Child Affidavit
          </h2>

          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Mother Name" name="motherName" value={data.motherName} onChange={update} />
          <Input label="Resident Of (R/O)" name="residentOf" value={data.residentOf} onChange={update} />

          <hr className="my-4" />

          <Input label="Name of Child (Applied For Admission)" name="childName" value={data.childName} onChange={update} />
          <Input label="Class" name="className" value={data.className} onChange={update} />
          <Input label="Category" name="category" value={data.category} onChange={update} />
          <Input label="School Name" name="schoolName" value={data.schoolName} onChange={update} />

          <hr className="my-4" />

          <Input label="First Born Child Name" name="firstBornName" value={data.firstBornName} onChange={update} />
          <Input label="Date of Birth" name="birthDate" value={data.birthDate} onChange={update} />
          <Input label="Place of Birth" name="birthPlace" value={data.birthPlace} onChange={update} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Verification Place" name="verificationPlace" value={data.verificationPlace} onChange={update} />
            <Input label="Day" name="verificationDay" value={data.verificationDay} onChange={update} />
          </div>

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
                    fontSize: "15pt",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginBottom: "22px",
                  }}
                >
                  AFFIDAVIT
                </div>

                {/* INTRO */}
                <p style={{ textAlign: "justify", marginBottom: "16px" }}>
                  We{" "}
                  <b>{data.fatherName || "____________________"}</b>{" "}
                  &{" "}
                  <b>{data.motherName || "____________________"}</b>{" "}
                  R/O{" "}
                  <b>{data.residentOf || "____________________"}</b>{" "}
                  do hereby solemnly affirm and declare as under:
                </p>

                {/* POINTS */}
                <div style={{ marginLeft: "14px" }}>
                  <p style={{ margin: "12px 0", textIndent: "-14px" }}>
                    1. That we have applied for admission of our ward{" "}
                    <b>{data.childName || "____________________"}</b>{" "}
                    in class{" "}
                    <b>{data.className || "__________"}</b>{" "}
                    under{" "}
                    <b>{data.category || "__________"}</b>{" "}
                    category in{" "}
                    <b>{data.schoolName || "____________________"}</b>.
                  </p>

                  <p style={{ margin: "12px 0", textIndent: "-14px" }}>
                    2. That{" "}
                    <b>{data.firstBornName || "____________________"}</b>{" "}
                    is our first born child having born on{" "}
                    <b>{data.birthDate || "__________"}</b>{" "}
                    at{" "}
                    <b>{data.birthPlace || "____________________"}</b>.
                  </p>
                </div>

                {/* SIGNATURES */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "40px",
                    fontWeight: "bold",
                  }}
                >
                  <div>(FATHER)</div>
                  <div>(MOTHER)</div>
                </div>

                <div style={{ textAlign: "center", marginTop: "12px", fontWeight: "bold" }}>
                  DEPONENT (S)
                </div>

                {/* VERIFICATION */}
                <div style={{ marginTop: "35px" }}>
                  <div style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "10px" }}>
                    VERIFICATION:
                  </div>

                  <p style={{ textAlign: "justify" }}>
                    Verified at{" "}
                    <b>{data.verificationPlace || "Delhi"}</b>{" "}
                    on this{" "}
                    <b>{data.verificationDay || "__"}</b>{" "}
                    day of{" "}
                    <b>__________</b>, 2011 that the contents of my above affidavit are
                    true to my knowledge; no part of it is false and nothing has been
                    concealed therefrom.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "35px",
                      fontWeight: "bold",
                    }}
                  >
                    <div>(FATHER)</div>
                    <div>(MOTHER)</div>
                  </div>

                  <div style={{ textAlign: "center", marginTop: "12px", fontWeight: "bold" }}>
                    DEPONENT (S)
                  </div>
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
