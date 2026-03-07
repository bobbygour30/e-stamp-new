import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
  groomName: "",
  groomFather: "",
  groomAddress: "",

  brideName: "",
  brideFather: "",
  brideAddress: "",

  marriageDate: "",
  marriagePlace: "",

  dob: "",
  ageAtMarriage: "",

  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function MarriageRegister() {
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
          scrollY: 0,
          backgroundColor: "#ffffff",
          // scrollY: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: [] }, // ✅ one page only
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

          <Input label="Groom Name" name="groomName" value={data.groomName} onChange={update} />
          <Input label="Groom Father Name" name="groomFather" value={data.groomFather} onChange={update} />
          <Input label="Groom Address" name="groomAddress" value={data.groomAddress} onChange={update} />

          <hr className="my-4" />

          <Input label="Bride Name" name="brideName" value={data.brideName} onChange={update} />
          <Input label="Bride Father Name" name="brideFather" value={data.brideFather} onChange={update} />
          <Input label="Bride Address" name="brideAddress" value={data.brideAddress} onChange={update} />

          <hr className="my-4" />

          <Input label="Marriage Date" name="marriageDate" value={data.marriageDate} onChange={update} />
          <Input label="Marriage Place" name="marriagePlace" value={data.marriagePlace} onChange={update} />
          <Input label="Your Date of Birth" name="dob" value={data.dob} onChange={update} />
          <Input label="Age at Marriage" name="ageAtMarriage" value={data.ageAtMarriage} onChange={update} />

          <Input
            label="Verification Date (e.g. 22nd October 2019)"
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
        <div className="bg-gray-100 rounded shadow overflow-y-auto flex justify-center h-screen">
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
                  I, <b>{data.groomName || "____________________"}</b> Son of Shri{" "}
                  <b>{data.groomFather || "____________________"}</b> R/O{" "}
                  <b>{data.groomAddress || "____________________"}</b>, do hereby
                  take oath and solemnly affirm and declare as under:-
                </p>

                {/* POINTS */}
                <div style={{ marginLeft: "20px", marginTop: "16px" }}>
                  <p style={{ textIndent: "-20px", marginBottom: "8px" }}>
                    I. That I got married to{" "}
                    <b>{data.brideName || "____________________"}</b> D/O Shri{" "}
                    <b>{data.brideFather || "____________________"}</b> R/O{" "}
                    <b>{data.brideAddress || "____________________"}</b> on{" "}
                    <b>{data.marriageDate || "__________"}</b> at{" "}
                    <b>{data.marriagePlace || "____________________"}</b>.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "8px" }}>
                    II. That my date of Birth is <b>{data.dob || "__________"}</b>{" "}
                    and I have completed <b>{data.ageAtMarriage || "__"}</b> years
                    of age at the time of marriage.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "8px" }}>
                    III. That I was unmarried till the time of marriage on{" "}
                    <b>{data.marriageDate || "__________"}</b> and I did not have a
                    spouse living at the time of marriage.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "8px" }}>
                    IV. That the marriage was conducted as per <b>Hindu</b> Rites.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "8px" }}>
                    V. That I belong to <b>Hindu</b> religion.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "8px" }}>
                    VI. That at the time of marriage, I was capable of giving valid
                    consent and of sound mind, not suffering from any mental
                    disorder/insanity.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "8px" }}>
                    VII. That until the time of marriage I was not related to{" "}
                    <b>{data.brideName || "____________________"}</b> D/O Shri{" "}
                    <b>{data.brideFather || "____________________"}</b> within the
                    prohibited degree of relationship and not spinals as per{" "}
                    <b>Hindu Marriage Act</b>.
                  </p>

                  <p style={{ textIndent: "-20px", marginBottom: "8px" }}>
                    VIII. That I am an Indian citizen.
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
                    <b>{data.verificationDate || "__________"}</b> that the above
                    content are true and correct to the best of my knowledge and
                    belief and nothing has been concealed therein.
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
