import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  applicantName: "",
  relationType: "D/O",
  fatherName: "",
  age: "",
  occupation: "",
  address: "",
  childName: "",
  dob: "",
  className: "",
  admissionGuidelines: "KVS Admission Guidelines 2020",

  contact1: "",
  contact2: "",

  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function SingleGirl() {
  const [data, setData] = useState(initialData);
  const pdfRef = useRef(null);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Single_Girl_Child_Affidavit.pdf",
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
            Single Girl Child Affidavit
          </h2>

          <Input label="Applicant Name" name="applicantName" value={data.applicantName} onChange={update} />
          <Input label="Relation Type (D/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Age" name="age" value={data.age} onChange={update} />
          <Input label="Occupation" name="occupation" value={data.occupation} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Girl Child Name" name="childName" value={data.childName} onChange={update} />
          <Input label="Date of Birth" name="dob" value={data.dob} onChange={update} />
          <Input label="Class Applied For" name="className" value={data.className} onChange={update} />

          <hr className="my-4" />

          <Input label="Contact Number 1" name="contact1" value={data.contact1} onChange={update} />
          <Input label="Contact Number 2" name="contact2" value={data.contact2} onChange={update} />

          <Input label="Verification Date (DD/MM/YYYY)" name="verificationDate" value={data.verificationDate} onChange={update} />

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
                    marginBottom: "20px",
                  }}
                >
                  SINGLE GIRL CHILD
                </div>

                {/* BODY */}
                <p style={{ textAlign: "justify" }}>
                  I, <b>{data.applicantName || "____________________"}</b>{" "}
                  <b>{data.relationType}</b>{" "}
                  <b>{data.fatherName || "____________________"}</b>{" "}
                  aged <b>{data.age || "__"}</b> years, Indian Inhabitant, occupation{" "}
                  <b>{data.occupation || "____________________"}</b>, Service
                  Resident of <b>{data.address || "____________________"}</b> is
                  mother/father of{" "}
                  <b>{data.childName || "____________________"}</b> Date of Birth{" "}
                  <b>{data.dob || "__________"}</b> submitting my undertaking to the
                  Head of the Institution in Class{" "}
                  <b>{data.className || "__"}</b>th vide{" "}
                  <b>{data.admissionGuidelines}</b>.
                </p>

                <div style={{ marginTop: "18px" }}>
                  <p>
                    1) I hereby declare that Miss{" "}
                    <b>{data.childName || "____________________"}</b> is the only
                    girl child in my family (with no male/female sibling). I
                    understand that it shall be my sole responsibility to inform
                    you about any change in status of single girl child in the
                    family immediately, if and when it occurs.
                  </p>

                  <p style={{ marginTop: "12px" }}>
                    2) I am also aware that in case it is detected at any time that
                    the affidavit sworn by me is false, appropriate action will be
                    taken by the school authorities and KVS against me.
                  </p>
                </div>

                {/* SIGNATURES */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "35px",
                  }}
                >
                  <div>Signature of father</div>
                  <div>Signature of mother</div>
                </div>

                {/* ADDRESS & CONTACT */}
                <p style={{ marginTop: "25px" }}>
                  Residential address with{" "}
                  <b>{data.address || "____________________"}</b>
                </p>
                <p>
                  with Contact number:{" "}
                  <b>{data.contact1 || "__________"}</b>{" "}
                  {data.contact2 && ` / ${data.contact2}`}
                </p>

                {/* VERIFICATION */}
                <div style={{ marginTop: "25px" }}>
                  <p>
                    Solemnly affirmed at <b>{data.verificationPlace}</b>
                  </p>
                  <p>This 1st day of December 2020.</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    <div>VERIFICATION:-</div>
                    <div>DEPONENT</div>
                  </div>

                  <p style={{ marginTop: "10px" }}>
                    Verified at <b>{data.verificationPlace}</b> on this{" "}
                    <b>{data.verificationDate || "__/__/____"}</b>, that the contents
                    of this affidavit are true and correct to the best of my
                    knowledge and belief.
                  </p>

                  <div style={{ textAlign: "right", marginTop: "25px", fontWeight: "bold" }}>
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
