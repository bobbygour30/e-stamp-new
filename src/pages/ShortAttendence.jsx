import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  name: "",
  relationType: "D/O",
  fatherName: "",
  address: "",
  collegeName: "",
  universityName: "",
  course: "",
  year: "",
  section: "",
};

export default function ShortAttendence() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Short_Attendance_Affidavit.pdf",
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
            Short Attendance Affidavit
          </h2>

          <Input label="Student Name" name="name" value={data.name} onChange={update} />
          <Input label="Relation Type (D/O / S/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="College Name" name="collegeName" value={data.collegeName} onChange={update} />
          <Input label="University Name" name="universityName" value={data.universityName} onChange={update} />
          <Input label="Course" name="course" value={data.course} onChange={update} />
          <Input label="Year" name="year" value={data.year} onChange={update} />
          <Input label="Section" name="section" value={data.section} onChange={update} />

          <button
            onClick={downloadPDF}
            className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium"
          >
            Download PDF
          </button>
        </div>

        {/* ================= PDF PREVIEW ================= */}
        <div className="bg-gray-100 rounded shadow overflow-hidden flex justify-center h-[70vh]">
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
                    marginBottom: "30px",
                  }}
                >
                  AFFIDAVIT
                </div>

                {/* BODY */}
                <p style={{ textAlign: "justify" }}>
                  I, <b>{data.name || "____________________"}</b>{" "}
                  {data.relationType}{" "}
                  <b>{data.fatherName || "____________________"}</b> address{" "}
                  <b>{data.address || "____________________"}</b> studying in{" "}
                  <b>{data.collegeName || "____________________"}</b> (
                  <b>{data.universityName || "____________________"}</b>), Delhi.
                </p>

                <p style={{ textAlign: "justify", marginTop: "14px" }}>
                  <b>{data.course || "__________"}</b> year (
                  <b>{data.section || "___"}</b>) am severally short of attendance.
                  I assure that this will not be repeated next year. I will make up
                  my attendance of the previous year as well as next year, failing
                  which I will not be allowed to appear for the examination.
                </p>

                {/* SIGNATURE */}
                <div
                  style={{
                    marginTop: "80px",
                    textAlign: "right",
                    fontWeight: "bold"
                  }}
                >
                  Signature
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
