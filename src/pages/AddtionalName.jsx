import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  applicantName: "",
  relationType: "S/O",
  fatherName: "",
  address: "",

  sonName: "",
  dob: "",

  oldName: "",
  newName: "",

  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function AddtionalName() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Additional_Name_Affidavit.pdf",
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
            Additional Name Affidavit
          </h2>

          <Input label="Applicant Name" name="applicantName" value={data.applicantName} onChange={update} />
          <Input label="Relation Type (S/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Son Name" name="sonName" value={data.sonName} onChange={update} />
          <Input label="Date of Birth" name="dob" value={data.dob} onChange={update} />

          <Input label="Old Name (Without Surname)" name="oldName" value={data.oldName} onChange={update} />
          <Input label="New Name (With Surname)" name="newName" value={data.newName} onChange={update} />

          <Input
            label="Verification Date (DD/MM/YYYY)"
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
                    fontSize: "15pt",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginBottom: "22px",
                  }}
                >
                  AFFIDAVIT
                </div>

                {/* INTRO */}
                <p style={{ textAlign: "justify", marginBottom: "18px" }}>
                  I, <b>{data.applicantName || "____________________"}</b>{" "}
                  {data.relationType}{" "}
                  <b>{data.fatherName || "____________________"}</b>{" "}
                  R/O <b>{data.address || "____________________"}</b>, do hereby
                  solemnly affirm and declare as under:-
                </p>

                {/* POINTS */}
                <div style={{ marginLeft: "16px" }}>
                  <p style={{ margin: "12px 0", textIndent: "-16px" }}>
                    1. That I am citizen of India.
                  </p>

                  <p style={{ margin: "12px 0", textIndent: "-16px" }}>
                    2. That I am residing on above said address.
                  </p>

                  <p style={{ margin: "12px 0", textIndent: "-16px" }}>
                    3. That my son <b>{data.sonName || "____________________"}</b>{" "}
                    and his correct date of birth is{" "}
                    <b>{data.dob || "__________"}</b>.
                  </p>

                  <p style={{ margin: "12px 0", textIndent: "-16px" }}>
                    4. That my son old name is{" "}
                    <b>{data.oldName || "__________"}</b> but I want add title
                    (surname) as{" "}
                    <b>{data.newName || "__________"}</b> so now he known in future
                    new name as{" "}
                    <b>{data.newName || "__________"}</b>.
                  </p>

                  <p style={{ margin: "12px 0", textIndent: "-16px" }}>
                    5. That it is my true and correct statement.
                  </p>
                </div>

                {/* DEPONENT */}
                <div style={{ marginTop: "40px", textAlign: "right" , fontWeight:"bold" }}>
                  DEPONENT
                </div>

                {/* VERIFICATION */}
                <div style={{ marginTop: "35px" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <b>Verification:-</b>
                  </div>

                  <p style={{ textAlign: "justify" }}>
                    Verified at <b>{data.verificationPlace}</b> on this{" "}
                    <b>{data.verificationDate || "__/__/____"}</b>, that the all
                    contents of this affidavit are true and correct to the best of
                    my knowledge and belief and nothing has been concealed therein.
                  </p>

                  <div style={{ marginTop: "35px", textAlign: "right",fontWeight: "bold" }}>
                    DEPONENT
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
