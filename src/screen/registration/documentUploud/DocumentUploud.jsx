import { useState, useRef } from "react";

import './documentUploud.css';
import RegistrationHeader from '../../../components/registrationHeader/RegistrationHeader';
import RegistrationProgress from '../../../components/registrationProgress/RegistrationProgress';

const DocumentUploud = () => {

    const allowedExtensions = ["pdf", "jpeg", "jpg", "png"];
    const [isAcknowledge, setIsAcknowledge] = useState(false);

    const [files, setFiles] = useState({
        panCard: null,
        gstinCertificate: null,
        cancelledCheque: null,
        certificateOfIncorporation: null,
        businessAddressProof: null,
        signature: null,
    });

    const panCardRef = useRef(null);
    const gstinCertificateRef = useRef(null);
    const cancelledChequeRef = useRef(null);
    const certificateOfIncorporationRef = useRef(null);
    const businessAddressProofRef = useRef(null);
    const signatureRef = useRef(null);

    const handleFileChange = (event, fieldName) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

            if (allowedExtensions.includes(fileExtension)) {
                setFiles((prevFiles) => ({
                    ...prevFiles,
                    [fieldName]: selectedFile,
                }));
            } else {
                alert(`Invalid file format for ${fieldName}! Please upload a PDF, JPEG, JPG, or PNG.`);
                event.target.value = ""; // Reset input
                setFiles((prevFiles) => ({
                    ...prevFiles,
                    [fieldName]: null,
                }));
            }
        }
    };

    const handleCheckboxChange = () => {
        setIsAcknowledge(!isAcknowledge);
        console.log("Checkbox value:", !isAcknowledge); // Logs the updated value
    };

    return (
        <div className="document-uploud-section overflow-y-auto overflow-x-hidden vh-100">
            <div className="registration-header overflow-hidden">
                <RegistrationHeader />
            </div>
            <div className="registration-progress">
                <RegistrationProgress color="#1F8505" active="#fff" step={3} />
            </div>
            <div className="document-details-main-section mt-2">

                <div className="row mb-3">
                    <div className="col-12">
                        <h3 className="text-center">Business Documents</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-3 col-md-3"></div>
                    <div className="col-lg-6 col-md-6">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 mb-3">
                                <div className="document-details-input-container">
                                    <label className="mb-1">PAN Card of Owner:</label>
                                    <div className="document-details-input-box d-flex justify-content-between">
                                        <div className={`document-name-box ${files.panCard ? "document-name-box-active" : ""}`}>
                                            <p className="mb-0"> {files.panCard ? files.panCard.name : "Upload (pdf, jpeg, png, jpg)"}</p>
                                        </div>
                                        <input type="file" accept=".pdf, .jpeg, .jpg, .png" ref={panCardRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e, "panCard")} />
                                        <button className="document-uploud-button" onClick={() => panCardRef.current.click()}>Upload</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 mb-3">
                                <div className="document-details-input-container">
                                    <label className="mb-1">GSTIN Certificate:*</label>
                                    <div className="document-details-input-box d-flex justify-content-between">
                                        <div className={`document-name-box ${files.gstinCertificate ? "document-name-box-active" : ""}`}>
                                            <p className="mb-0"> {files.gstinCertificate ? files.gstinCertificate.name : "Upload (pdf, jpeg, png, jpg)"}</p>
                                        </div>
                                        <input type="file" accept=".pdf, .jpeg, .jpg, .png" ref={gstinCertificateRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e, "gstinCertificate")} />
                                        <button className="document-uploud-button" onClick={() => gstinCertificateRef.current.click()}>Upload</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 mb-3">
                                <div className="document-details-input-container">
                                    <label className="mb-1">Cancelled Cheque:*</label>
                                    <div className="document-details-input-box d-flex justify-content-between">
                                        <div className={`document-name-box ${files.cancelledCheque ? "document-name-box-active" : ""}`}>
                                            <p className="mb-0"> {files.cancelledCheque ? files.cancelledCheque.name : "Upload (pdf, jpeg, png, jpg)"}</p>
                                        </div>
                                        <input type="file" accept=".pdf, .jpeg, .jpg, .png" ref={cancelledChequeRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e, "cancelledCheque")} />
                                        <button className="document-uploud-button" onClick={() => cancelledChequeRef.current.click()}>Upload</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 mb-3">
                                <div className="document-details-input-container">
                                    <label className="mb-1">Certificate of Incorporation (MCA):*</label>
                                    <div className="document-details-input-box d-flex justify-content-between">
                                        <div className={`document-name-box ${files.certificateOfIncorporation ? "document-name-box-active" : ""}`}>
                                            <p className="mb-0"> {files.certificateOfIncorporation ? files.certificateOfIncorporation.name : "Upload (pdf, jpeg, png, jpg)"}</p>
                                        </div>
                                        <input type="file" accept=".pdf, .jpeg, .jpg, .png" ref={certificateOfIncorporationRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e, "certificateOfIncorporation")} />
                                        <button className="document-uploud-button" onClick={() => certificateOfIncorporationRef.current.click()}>Upload</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 mb-3">
                                <div className="document-details-input-container">
                                    <label className="mb-1">Business Address Proof:*</label>
                                    <div className="document-details-input-box d-flex justify-content-between">
                                        <div className={`document-name-box ${files.businessAddressProof ? "document-name-box-active" : ""}`}>
                                            <p className="mb-0"> {files.businessAddressProof ? files.businessAddressProof.name : "Upload (pdf, jpeg, png, jpg)"}</p>
                                        </div>
                                        <input type="file" accept=".pdf, .jpeg, .jpg, .png" ref={businessAddressProofRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e, "businessAddressProof")} />
                                        <button className="document-uploud-button" onClick={() => businessAddressProofRef.current.click()}>Upload</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 mb-3">
                                <div className="document-details-input-container">
                                    <label className="mb-1">Signature:*</label>
                                    <div className="document-details-input-box d-flex justify-content-between">
                                        <div className={`document-name-box ${files.signature ? "document-name-box-active" : ""}`}>
                                            <p className="mb-0"> {files.signature ? files.signature.name : "Upload (pdf, jpeg, png, jpg)"}</p>
                                        </div>
                                        <input type="file" accept=".pdf, .jpeg, .jpg, .png" ref={signatureRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e, "signature")} />
                                        <button className="document-uploud-button" onClick={() => signatureRef.current.click()}>Upload</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3"></div>
                </div>

                <div className="row">
                    <div className="col-lg-1 col-md-1"></div>
                    <div className="col-lg-10 col-md-10 d-flex align-items-center">
                        <input type="checkbox" id="agree" checked={isAcknowledge} onChange={handleCheckboxChange} />
                        <label htmlFor="agree" className="acknowledge">I Acknowledge</label>
                    </div>
                    <div className="col-lg-1 col-md-1"></div>
                </div>

                <div className="row my-4">
                    <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-evenly">
                        <button className="back-btn">Back</button>
                        <button className="save-btn">Save</button>
                        <button className="next-btn">Next</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DocumentUploud;