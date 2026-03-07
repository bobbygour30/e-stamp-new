import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  name: "",
  relationType: "W/O",
  husbandName: "",
  address: "",

  correctName: "",
  wrongName: "",

  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function NameChange() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Name_Change_Affidavit.pdf",
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
        pagebreak: { mode: [] }, // ✅ single-page only
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Name Change Affidavit
          </h2>

          <Input label="Your Name" name="name" value={data.name} onChange={update} />
          <Input label="Relation Type (W/O, S/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Husband / Father Name" name="husbandName" value={data.husbandName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Correct Name" name="correctName" value={data.correctName} onChange={update} />
          <Input label="Wrong Name (as in record)" name="wrongName" value={data.wrongName} onChange={update} />

          <Input
            label="Verification Date (e.g. 05th October 2020)"
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
                  padding: "20mm 22mm",
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
                  <b>{data.husbandName || "____________________"}</b>{" "}
                  R/O <b>{data.address || "____________________"}</b>, do hereby
                  solemnly affirm and declare as under:-
                </p>

                {/* POINTS */}
                <div style={{ marginLeft: "20px", marginTop: "16px" }}>
                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    1. That I am citizen of India.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    2. That I am residing on above said address.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    3. That my name mentioned in my son school record{" "}
                    <b>{data.correctName || "__________"}</b> as{" "}
                    <b>{data.wrongName || "__________"}</b> which is not correct.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    4. That I want to change my name in my son school record as{" "}
                    <b>{data.correctName || "__________"}</b> for all purposes in
                    future.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                    5. That it is my true and correct statement.
                  </p>
                </div>

                {/* DEPONENT */}
                <div style={{ marginTop: "40px", textAlign: "right", fontWeight: "bold" }}>
                  DEPONENT 
                </div>

                {/* VERIFICATION */}
                <div style={{ marginTop: "30px" }}>
                  <p>
                    <b>Verification:-</b>
                  </p>
                  <p style={{ textAlign: "justify", marginTop: "10px" }}>
                    Verified at <b>{data.verificationPlace}</b> on{" "}
                    <b>{data.verificationDate || "__________"}</b>, that the all
                    contents of this affidavit are true to the best of my knowledge
                    and belief.
                  </p>
                </div>

                <div style={{ marginTop: "35px", textAlign: "right", fontWeight: "bold" }}>
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

/* INPUT */
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
