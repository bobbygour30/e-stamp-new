import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  name: "",
  fatherName: "",
  residentOf: "",

  spouseName: "",
  spouseFatherName: "",
  spouseResidentOf: "",

  marriageDate: "",
  marriagePlace: "",
  marriageAccordingTo: "",

  dob: "",
  maritalStatusBefore: "",
  religion: "",

  verificationPlace: "",
  verificationDay: "",
  verificationMonth: "",
};

export default function MarriageRegistration() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Marriage_Registration_Affidavit.pdf",
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
        pagebreak: { mode: ["css"] }, // ✅ allow page breaks
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Marriage Registration Affidavit
          </h2>

          <Input label="Your Name" name="name" value={data.name} onChange={update} />
          <Input label="Father's Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Resident Of" name="residentOf" value={data.residentOf} onChange={update} />

          <hr className="my-4" />

          <Input label="Spouse Name" name="spouseName" value={data.spouseName} onChange={update} />
          <Input label="Spouse Father Name" name="spouseFatherName" value={data.spouseFatherName} onChange={update} />
          <Input label="Spouse Resident Of" name="spouseResidentOf" value={data.spouseResidentOf} onChange={update} />

          <hr className="my-4" />

          <Input label="Marriage Date" name="marriageDate" value={data.marriageDate} onChange={update} />
          <Input label="Marriage Place" name="marriagePlace" value={data.marriagePlace} onChange={update} />
          <Input label="Marriage According To" name="marriageAccordingTo" value={data.marriageAccordingTo} onChange={update} />

          <Input label="Date of Birth" name="dob" value={data.dob} onChange={update} />
          <Input label="Marital Status Before Marriage" name="maritalStatusBefore" value={data.maritalStatusBefore} onChange={update} />
          <Input label="Religion" name="religion" value={data.religion} onChange={update} />

          <div className="grid grid-cols-3 gap-3">
            <Input label="Verification Place" name="verificationPlace" value={data.verificationPlace} onChange={update} />
            <Input label="Day" name="verificationDay" value={data.verificationDay} onChange={update} />
            <Input label="Month" name="verificationMonth" value={data.verificationMonth} onChange={update} />
          </div>

          <button
            onClick={downloadPDF}
            className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium"
          >
            Download PDF
          </button>
        </div>

        {/* ================= PDF PREVIEW ================= */}
        <div className="bg-gray-100 rounded shadow flex justify-center h-screen overflow-y-auto">

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
              <div ref={pdfRef}>

                {/* ================= PAGE 1 ================= */}
                <div className="bg-white my-6 shadow-xl"
                  style={{
                    width: "210mm",
                    minHeight: "297mm",
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "12pt",
                    lineHeight: "1.55",
                    padding: "25px",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", fontSize: "15pt", marginBottom: "20px" }}>
                    AFFIDAVIT
                  </div>

                  <p>
                    I, <b>{data.name || "____________________"}</b> S/O{" "}
                    <b>{data.fatherName || "____________________"}</b> Resident of{" "}
                    <b>{data.residentOf || "____________________"}</b> do hereby
                    solemnly affirm and declare as under:-
                  </p>

                  <p style={{ marginTop: "14px" }}>
                    1. That I got married <b>{data.spouseName || "____________________"}</b>{" "}
                    D/O <b>{data.spouseFatherName || "____________________"}</b>{" "}
                    R/O <b>{data.spouseResidentOf || "____________________"}</b>{" "}
                    on <b>{data.marriageDate || "__________"}</b> at{" "}
                    <b>{data.marriagePlace || "____________________"}</b>{" "}
                    according to <b>{data.marriageAccordingTo || "__________"}</b>.
                  </p>

                  <p>2. That my date of birth is <b>{data.dob || "__________"}</b>.</p>

                  <p>
                    3. That I was <b>{data.maritalStatusBefore || "__________"}</b>{" "}
                    till the time of marriage and or I did not have any other living
                    spouse at the time of marriage.
                  </p>

                  <p>
                    4. That at the time of marriage I was not related to{" "}
                    <b>____________________</b> with the prohibited degree of
                    relationship and not spinals as per <b>__________</b>.
                  </p>

                  <p>5. That I belong to <b>{data.religion || "__________"}</b>.</p>

                  <p>6. That I am citizen of India.</p>

                  <div style={{ marginTop: "40px", textAlign: "right", fontWeight: "bold" }}>
                    DEPONENT
                  </div>
                </div>

                {/* ================= PAGE BREAK ================= */}
                <div style={{ pageBreakAfter: "always" }} />

                {/* ================= PAGE 2 ================= */}
                <div
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
                  <div style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "12px" }}>
                    VERIFICATION:
                  </div>

                  <p>
                    Verified at <b>{data.verificationPlace || "__________"}</b> on{" "}
                    <b>{data.verificationDay || "__"}</b> day of{" "}
                    <b>{data.verificationMonth || "__________"}</b>, 2025 that the
                    contents of this above affidavit are true and correct to the best
                    of my knowledge and belief and nothing has been concealed
                    therefrom.
                  </p>

                  <div style={{ marginTop: "60px", textAlign: "right", fontWeight: "bold" }}>
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
