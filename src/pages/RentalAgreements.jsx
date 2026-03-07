import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const initialData = {
    name: "",
    relationType: "S/O",
    relationName: "",
    firstPartyOccupation: "",
    restrictedAt: "",
    firstReferredParty: "",
    secondPartyName: "",
    secondPartyFatherName: "",
    secondPartyAge: "",
    secondPartyOccupation: "",
    secondPartyAddress: "",
    propertyAddress: "",
    propertyArea: "",
    propertyType: "",
    subRegistrarOffice: "",
    secondPartyRole: "",
    secondlicenseType: "",
    licensePurpose: "",
    licenseDurationMonths: "",
    licenseStartDate: "",
    licenseEndDate: "",
    monthlyRent: "",
    monthlyRentWords: "",
    paymentMode: "",
    paymentDueDay: "",
    witnessAddress: "",
    witnessName: "",
    verificationMonth: "",
};

export default function RentalAgreements() {
    const [data, setData] = useState(initialData);
    const pdfRef = useRef(null);

    const update = (e) =>
        setData({ ...data, [e.target.name]: e.target.value });

    const downloadPDF = () => {
        html2pdf()
            .from(pdfRef.current)
            .set({
                filename: "Rental_Agreement.pdf",
                margin: 0,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,                // ✅ reduced to avoid rounding overflow
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    logging: false,
                    dpi: 300,
                    letterRendering: true,
                    scrollY: 0,
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                },
                pagebreak: { mode: [] },   // ✅ no auto page breaks
            })
            .save();
    };

    return (
        <div className="min-h-screen bg-[#f3f1fa] p-6 border border-red-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                {/* ================= FORM ================= */}
                <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">
                        Rental Argeements
                    </h2>
                    {/* party first */}
                    <Input label="First Party Name" name="name" value={data.name} onChange={update} />

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Relation Type (S/D/W/O)" name="relationType" value={data.relationType} onChange={update} />
                        <Input label="Frist Relation Name" name="relationName" value={data.relationName} onChange={update} />
                        <Input label="Occupation" name="firstPartyOccupation" value={data.firstPartyOccupation} onChange={update} />
                    </div>

                    <Input label="RestrictedAt (R/at)" name="restrictedAt" value={data.restrictedAt} onChange={update} />
                    <Input label="First Referred Party" name="firstReferredParty" value={data.firstReferredParty} onChange={update} />
                    {/* <Input label="First Party Name" name="firstPartyName" value={data.firstPartyName} onChange={update} /> */}

                    {/* <div className="grid grid-cols-3 gap-3">
                        <Input label="Verification Place" name="verificationPlace" value={data.verificationPlace} onChange={update} />
                        <Input label="Day" name="verificationDay" value={data.verificationDay} onChange={update} />
                        <Input label="Month" name="verificationMonth" value={data.verificationMonth} onChange={update} />
                    </div> */}
                    {/* second party */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Second Party Name" name="secondPartyName" value={data.secondPartyName} onChange={update} />
                        <Input label="Father’s Name" name="secondPartyFatherName" value={data.secondPartyFatherName} onChange={update} />
                        <Input label="Age" name="secondPartyAge" value={data.secondPartyAge} onChange={update} />
                        <Input label="Occupation" name="secondPartyOccupation" value={data.secondPartyOccupation} onChange={update} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Residential Address" name="secondPartyAddress" value={data.secondPartyAddress} onChange={update} />
                        {/* <Input label="Occupation" name="firstPartyOccupation" value={data.firstPartyOccupation} onChange={update} /> */}
                    </div>
                    {/* second party property */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Flat Address" name="propertyAddress" value={data.propertyAddress} onChange={update} />
                        <Input label="Flat Area (sq.ft.)" name="propertyArea" value={data.propertyArea} onChange={update} />
                        <Input label="Flat Type (1BHK / 2BHK)" name="propertyType" value={data.propertyType} onChange={update} />
                        <Input label="Sub-Registrar Office" name="subRegistrarOffice" value={data.subRegistrarOffice} onChange={update} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="License Purpose" name="licensePurpose" value={data.licensePurpose} onChange={update} />
                        <Input label="License Duration Months" name="licenseDurationMonths" value={data.licenseDurationMonths} onChange={update} />
                        <Input label="License Type" name="secondlicenseType" value={data.secondlicenseType} onChange={update} />
                        <Input label="License Start Date" name="licenseStartDate" type="date" value={data.licenseStartDate} onChange={update} />
                        <Input label="License End Date" name="licenseEndDate" type="date" value={data.licenseEndDate} onChange={update} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Monthly Rent" name="monthlyRent" type="number" value={data.monthlyRent} onChange={update} />
                        <Input label="Monthly Rent Words" name="monthlyRentWords" type="text" value={data.monthlyRentWords} onChange={update} />
                        <Input label="Payment DueDay" name="paymentDueDay" type="number" value={data.paymentDueDay} onChange={update} />
                        <div>
                            <label htmlFor="">Select Payment Mode</label>
                            <select name="paymentMode" value={data.paymentMode} onChange={update} className="w-full border rounded p-2">
                                <option value="">Select Payment Mode</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Cash">Cash</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                    </div>

                    <h3 className="mb-3" style={{ fontSize: "18px" }}>In the presence of 👇</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Name" name="witnessName" type="text" value={data.witnessName} onChange={update} />
                        <Input label="Address" name="witnessAddress" type="text" value={data.witnessAddress} onChange={update} />

                    </div>


                    <button
                        onClick={downloadPDF}
                        className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium"
                    >
                        Download PDF
                    </button>
                </div>  

                {/* ================= PDF PREVIEW ================= */}
                <div className="bg-gray-100  rounded shadow h-[120vh] overflow-y-auto">
                    <div
                        ref={pdfRef}
                        className="bg-white w-full  mx-auto font-serif text-black text-[12pt] leading-[1.55] p-6 box-border"
                    >
                        {/* TITLE */}
                        <div style={{
                            textAlign: "center",
                            marginBottom: "24px",
                            fontSize: "14pt",
                            fontWeight: "bold",
                            textDecoration: "underline",
                            letterSpacing: "0.4px",
                        }}>
                            Rental Argeements
                        </div>

                        {/* INTRO */}
                        <div style={{ marginBottom: "16px", textAlign: "justify" }}>
                            <b>{data.name || "______________"}</b>{" "}
                            <b>{data.relationType || "S/D/W/O"}</b>{" "}
                            <b>{data.relationName || "_____________"}</b>

                            <div style={{ marginTop: "8px" }}>
                                Occupation – <b>{data.firstPartyOccupation || "_____________"}</b>
                            </div>

                            <div style={{ marginTop: "8px" }}>
                                R/at <b>{data.restrictedAt || "____________"}</b> referred to as the{" "}
                                <b>{data.firstReferredParty || "____________"}</b>
                            </div>

                            <div style={{ marginTop: "8px" }}>
                                (Which expression shall unless repugnant to the context of meaning
                                thereof mean & include his/her/their legal heirs, executors,
                                administrators & assigns etc.)… <b>OF THE FIRST PART.</b>
                            </div>
                        </div>
                        {/* second party */}
                        <div style={{ marginTop: "15px", textAlign: "justify" }}>
                            <div className="text-center font-bold mb-3">AND</div>

                            <div>
                                <b>{data.secondPartyName || "_____________"} S/o {data.secondPartyFatherName || "_____________"}</b>
                            </div>

                            <div style={{ marginTop: "6px" }}>
                                Age: <b>{data.secondPartyAge || "_____________"}</b> Years,
                                Occupation – <b>{data.secondPartyOccupation || "_____________"}</b>
                            </div>

                            <div style={{ marginTop: "6px" }}>
                                R/at : <b>{data.secondPartyAddress || "____________"}</b>
                            </div>
                        </div>
                        {/* second party property */}
                        <div className="mt-3">

                            <p className="text-center"><b>HEREINAFTER referred to as the “{data.secondPartyFatherName}”</b></p><br />
                            (Which expression shall unless repugnant to the context thereof mean
                            & include his/her/their legal heirs, executors, administrators & assigns etc.)
                            … <b>OF THE SECOND PART</b>.
                            <p>WHEREAS the Licensor is the lawful Owner of flat situated at
                                <b>{" "}{data.propertyAddress || "____________"}</b>{" "} admeasuring about area <b>{data.propertyArea || "____________"}{" "}</b> sq.ft.
                                <b>{data.propertyType || "____________"}</b> (hereinafter referred to as the Said Flat),
                                within jurisdiction of Sub-Registrar <b>{" "}{data.subRegistrarOffice || "____________"}{" "}</b>
                                hereinafter referred to as the “SAID PREMISES”.
                            </p>
                            <p>The Licensee has approached the Licensor with request to permit
                                him/her to use & occupy the said premises wit h fixtures and fittings,
                                on <b>{data.secondlicenseType || "____________"}</b> basis as <b>{data.licensePurpose || "____________"} Purpose</b> for the
                                use of Licensee for a period of {data.licenseDurationMonths} months.
                            </p>

                            <h2 className="font-bold my-3 text-center fs-4">NOW THEREFORE THESE PRESENT WITNESSTH THIS
                                AGREEMENT AND IT IS HEREBY AGREED BY AND
                                BETWEEN THE PARTIES HERE TO AS FOLLOWS:
                            </h2>
                        </div>
                        {/* POINTS */}
                        <div style={{ marginLeft: "12px" }}>
                            <div style={{ margin: "12px 0", textIndent: "-12px" }}>
                                <p className="mt-3">1. The Licensor agrees to demise up to the Licensee and the
                                    License hereby accepts the said premises, with its fixtures and
                                    fittings as per schedule “A” attached to hold unto a period of
                                    <b> {data.licenseDurationMonths || "____"} Months </b> with effect from{" "}
                                    <b>{data.licenseStartDate || "____"}</b> to{" "}
                                    <b>{data.licenseEndDate || "____"}</b> on Leave and License basis from
                                    the day the Licensee has been allowed the use and occupation of
                                    the said premises.
                                </p>
                                <p className="mt-3">
                                    2. During the tenure of the license period, the Licensee shall pay
                                    to the Licensor an amount of Rs.{" "}
                                    <b>{data.monthlyRent || "____"}</b>/-
                                    (Rupees <b>{data.monthlyRentWords || "________"}</b> Only) per month
                                    by way of <b>{data.paymentMode || "Cheque / Cash / Online"}</b> on or
                                    before <b>{data.paymentDueDay || "__"}</b> of every month.
                                </p>

                                <p className="mt-3">
                                    3. <b>Electricity bills</b> shall be paid and cleared by the Licensee.
                                </p>
                                <p className="mt-3">
                                    4.It is agreed between the parties that at all times the judicial
                                    possession of the said premises shall be of Licensor and the Licensee has been merely granted the License to make use of
                                    the said premises for a <b>limited period only</b>. The Licensee shall
                                    hand over vacant exclusive and peaceful possession of the said
                                    premises to the Licensor after expiry of this license.
                                </p>
                                <p className="mt-3">
                                    5. It is hereby agreed between the parties here to that if the
                                    Licensee commits any default in payments of the monthly
                                    compensation as agreed aforesaid or non – payment of Electric
                                    bills, or commits breach of any of the terms, covenant contained
                                    in this Agreement the Licensor shall be entitled to revoke this
                                    License for with and serve a notice of one month for vacation of
                                    the said premises to the Licensee as provided in para 9 (d)
                                    herein.
                                </p>
                                <p className="mt-3">
                                    6. The Licensee covenant with the Licensor that the obligations
                                    hereby granted shall continue throughout the terms of this
                                    License period for the proper performance of the <b>terms and
                                        condition</b> of this LEAVE AND LICENSE Agreement as
                                    follow:

                                </p>
                                <p className="mt-3">
                                    [a] The Licensee shall pay all the charges for the electricity bill as
                                    per meter that may be charged in respect of the said premises.
                                    But the Licensor shall pay the property taxes and society
                                    charges of the said premises.
                                </p>
                                <p className="mt-3">
                                    [b] To keep interior of the said premises in good order and maintain
                                    it in proper condition, as they were on the day of the occupation
                                    during the License period as mentioned here in above.
                                </p>
                                <p className="mt-3">
                                    [c] Not to make any alternation to the said premises or remove any
                                    door window or other fixtures and fittings from it.
                                </p>
                                <p className="mt-3">
                                    [d]  Not to assign transfer, sub – let or any part with possession of
                                    the said premises or any part they’re of any thereof at any time
                                    during continuance of this License period.
                                </p>
                                <p className="mt-3">
                                    [e] To permit the Licensor or his family member to enter, inspect
                                    the said premises and fixtures, fittings after giving a prior notice
                                    / intimidation.
                                </p>
                                <p className="mt-3">
                                    [f] To Licensee shall use the said premises for his residential
                                    purposes only for no other purposes whatsoever.
                                </p>
                                <p className="mt-3">
                                    [g] The said parties are making this leave and License Agreement
                                    as provided in section 4 (1A) and 13(A2) of Bombay Rent
                                    Control Act 1987 (Amended) Maharashtra Rent Act 1999
                                    section 55/1 as amended. The Licensee shall never claim to be a
                                    tenant and the agreement always be treated as an Agreement of
                                    LEAVE AND LICENSE.
                                </p>
                                <p className="mt-3">
                                    If the Licensee fails to vacate the said premises within the
                                    stipulated period of the License shall evicted by the said
                                    premises within the stipulated period of the License shall
                                    evicted by the Licensor without recourse to the court of law and
                                    he/she shall be treated as <b>TRESSPASSER</b>.
                                </p>

                                <p className="mt-3">
                                    <b>THE WITNESS WHERE OF</b>, the parties here to set and subscribe
                                    their respective hands on the day and year mentioned here in above
                                </p>
                                <p className="mt-3">
                                    SIGNED AND DELIVERD BY THE
                                </p>
                                <p>
                                    WITHIN NAMED LICENSOR
                                </p>


                                <p className="text-end">
                                    <b>{data.name || "______________"}</b><br />
                                    <b>LICENSOR</b>
                                </p>

                                <p>
                                    SIGNED SEALED AND DELIVERD
                                </p>
                                <p>BY THE WITHIN NAMED LICENSE</p>
                                <p className="text-end">
                                    <b>{data.secondPartyName || "______________"}</b><br />
                                    <b>LICENSOR</b>
                                </p>
                                <p>In the presence of</p>

                                <p>
                                    Name : <b>{data.witnessName || "____________________"}</b>
                                </p>

                                <p>
                                    Address : <b>{data.witnessAddress || "____________________"}</b>
                                </p>

                                <p>
                                    Signature : ____________________
                                </p>
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