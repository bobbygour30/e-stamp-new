import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  name: "",
  relationType: "S/O",
  fatherName: "",
  address: "",

  passedYear: "",
  gapClass: "",
  gapFrom: "",
  gapTo: "",

  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function GapYear() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Gap_Year_Affidavit.pdf",
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
        pagebreak: { mode: [] }, // ✅ force single page
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Gap Year Affidavit
          </h2>

          <Input label="Your Name" name="name" value={data.name} onChange={update} />
          <Input label="Relation Type (S/O, D/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="12th Passed Year" name="passedYear" value={data.passedYear} onChange={update} />
          <Input label="Gap After Class (e.g. 12th)" name="gapClass" value={data.gapClass} onChange={update} />
          <Input label="Gap From (Month/Year)" name="gapFrom" value={data.gapFrom} onChange={update} />
          <Input label="Gap To (Month/Year)" name="gapTo" value={data.gapTo} onChange={update} />

          <Input
            label="Verification Date (e.g. 22nd November 2021)"
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
                  I, <b>{data.name || "____________________"}</b>{" "}
                  {data.relationType}{" "}
                  <b>{data.fatherName || "____________________"}</b>{" "}
                  R/O <b>{data.address || "____________________"}</b>, do hereby
                  solemnly affirm and declare as under:-
                </p>

                {/* POINTS */}
                <div style={{ marginLeft: "20px", marginTop: "16px" }}>
                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    1. That I am citizen of India.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    2. That I have passed 12<sup>th</sup> class Examination in the
                    year <b>{data.passedYear || "______"}</b> from CBSE board Delhi.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    3. That after passing{" "}
                    <b>{data.gapClass || "__"}</b> class examination I did not taken
                    admission in any other college/Institution in Delhi or anywhere
                    in India.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    4. That during the Gap period of{" "}
                    <b>{data.gapFrom || "______"}</b> to{" "}
                    <b>{data.gapTo || "______"}</b> I was at home and preparing for
                    competition exam.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    5. That during the Gap Period I was not involved in any
                    civil/criminal activities.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    6. That it is my true and correct statement.
                  </p>
                </div>

                {/* DEPONENT */}
                <div style={{ marginTop: "40px", textAlign: "right" }}>
                  DEPONENT
                </div>

                {/* VERIFICATION */}
                <div style={{ marginTop: "30px" }}>
                  <p>
                    <b>VERIFICATION:-</b>
                  </p>
                  <p style={{ textAlign: "justify", marginTop: "10px" }}>
                    Verified at <b>{data.verificationPlace}</b> on{" "}
                    <b>{data.verificationDate || "__________"}</b>, that the contents
                    of this affidavit are true and correct to the best of my
                    knowledge and belief.
                  </p>
                </div>

                <div style={{ marginTop: "35px", textAlign: "right" }}>
                  DEPONENT
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
