import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  studentName: "",
  relationType: "D/O",
  fatherName: "",
  address: "",
  age: "",
  hostelName: "",

  guardianName: "",
  guardianRelation: "Father",
  guardianAddress: "",
  date: "",
};

export default function AntiRagging() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Anti_Ragging_Undertaking_Affidavit.pdf",
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
            Anti Ragging Undertaking
          </h2>

          <Input label="Student Name" name="studentName" value={data.studentName} onChange={update} />
          <Input label="Relation Type (S/O, D/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Age" name="age" value={data.age} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />
          <Input label="Hostel Name" name="hostelName" value={data.hostelName} onChange={update} />

          <hr className="my-4" />

          <Input label="Guardian Name" name="guardianName" value={data.guardianName} onChange={update} />
          <Input label="Guardian Relation" name="guardianRelation" value={data.guardianRelation} onChange={update} />
          <Input label="Guardian Address" name="guardianAddress" value={data.guardianAddress} onChange={update} />
          <Input label="Date (DD/MM/YYYY)" name="date" value={data.date} onChange={update} />

          <button
            onClick={downloadPDF}
            className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium"
          >
            Download PDF
          </button>
        </div>

        {/* ================= PDF PREVIEW ================= */}
        <div className="bg-gray-100 rounded shadow overflow-hidden flex justify-center h-[120vh]">
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
                <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "6px" }}>
                  ANTI RAGGING
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginBottom: "18px",
                  }}
                >
                  UNDERTAKING AFFIDAVIT
                </div>

                {/* INTRO */}
                <p style={{ textAlign: "justify" }}>
                  I, <b>{data.studentName || "____________________"}</b>{" "}
                  {data.relationType}{" "}
                  <b>{data.fatherName || "____________________"}</b>{" "}
                  R/O <b>{data.address || "____________________"}</b>, aged{" "}
                  <b>{data.age || "__"}</b> years, presently residing in allotted
                  room in <b>{data.hostelName || "____________________"}</b> hostel,
                  do hereby solemnly affirm, undertake, and declare as under:-
                </p>

                {/* POINTS */}
                <div style={{ marginLeft: "16px", marginTop: "14px" }}>
                  <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                    1. That my parents and I have obtained and read the prospectus,
                    hostel book containing Anti Ragging regulations of the
                    University and have read them thoroughly, undertake to abide by
                    them in letter and spirit. I understand that my failure to abide
                    by any of them shall make me liable to disciplinary action
                    including rustication by the college authorities. I understand
                    that the decision by the administration in this regard shall be
                    binding and final for me.
                  </p>

                  <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                    2. That I understand that Ragging is an offence and punishable by
                    law as per the direction of the Hon’ble Supreme Court of India.
                  </p>

                  <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                    3. That I understand that Ragging in any form is strictly
                    prohibited.
                  </p>

                  <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                    4. I have read the relevant instruction/regulations regarding
                    Ragging and understand that it is punishable as per law. If I
                    indulge in Ragging of any sort in hostel/campus and been found
                    guilty the Administration can take action as stipulated by law
                    and FIR may be lodge.
                  </p>

                  <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                    5. I will abide with the rules of the Hostel and will not indulge
                    in any type of ragging activities.
                  </p>
                </div>

                <p style={{ marginTop: "14px" }}>
                  I have also read and understood the above contents.
                </p>

                {/* SIGNATURES */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "25px",
                  }}
                >
                  <div>Signature of Guardian/parent:</div>
                  <div>Signature of Student</div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "18px",
                  }}
                >
                  <div>
                    Name: <b>{data.guardianName || "____________________"}</b>
                    <br />
                    Relation: <b>{data.guardianRelation}</b>
                    <br />
                    Address: <b>{data.guardianAddress || "____________________"}</b>
                    <br />
                    Dated: <b>{data.date || "__/__/____"}</b>
                  </div>
                  <div>
                    Name: <b>{data.studentName || "____________________"}</b>
                    <br />
                    Date: <b>{data.date || "__/__/____"}</b>
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
