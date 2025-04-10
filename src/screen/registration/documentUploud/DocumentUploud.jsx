import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setDocumentUpload } from "../../../redux/reducers/registrationSlice";

import './documentUploud.css';
import RegistrationHeader from '../../../components/registrationHeader/RegistrationHeader';
import RegistrationProgress from '../../../components/registrationProgress/RegistrationProgress';
import Loader from "../../../components/loader/Loader";
import { AWS_MULTIPART_DOC_UPLOAD_URL, BASE_URL } from "../../../config/urls";

const DocumentUploud = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const businessDetails = useSelector((state) => state.registration.businessDetails);
    const documentDetails = useSelector((state) => state.registration.documentUpload);

    console.log(documentDetails, "this documentDetails in doc page")

    const allowedExtensions = ["pdf", "jpeg", "jpg", "png"];
    const [files, setFiles] = useState({
        panCard: null,
        gstinCertificate: null,
        cancelledCheque: null,
        certificateOfIncorporation: null,
        // businessAddressProof: null,
        signature: null,
    });
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Initialize files with existing documents
    useEffect(() => {
        if (documentDetails && documentDetails.length > 0) {
            const updatedFiles = { ...files };
            documentDetails.forEach(doc => {
                if (updatedFiles.hasOwnProperty(doc.fileName)) {
                    updatedFiles[doc.fileName] = {
                        name: doc.fileName,
                        url: doc.fileUrl,
                        isExisting: true // Flag to identify existing documents
                    };
                }
            });
            setFiles(updatedFiles);
            setIsSaved(true); // Mark as saved since we're showing existing docs
        }
    }, [documentDetails]);

    // References for file inputs
    const fileRefs = {
        panCard: useRef(null),
        gstinCertificate: useRef(null),
        cancelledCheque: useRef(null),
        certificateOfIncorporation: useRef(null),
        // businessAddressProof: useRef(null),
        signature: useRef(null),
    };

    // const handleFileChange = (event, fieldName) => {
    //     const selectedFile = event.target.files[0];
    //     if (selectedFile) {
    //         const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    //         if (allowedExtensions.includes(fileExtension)) {
    //             setFiles(prev => ({
    //                 ...prev,
    //                 [fieldName]: selectedFile
    //             }));
    //             setIsSaved(false); // Mark as unsaved when changing a file
    //         } else {
    //             toast.warning(`Invalid file format for ${fieldName}! Please upload a PDF, JPEG, JPG, or PNG.`);
    //             event.target.value = "";
    //         }
    //     }
    // };

    const handleFileChange = (event, fieldName) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
            
            // Special handling for signature field (only image formats)
            if (fieldName === "signature") {
                const allowedImageExtensions = ["jpeg", "jpg", "png"];
                if (!allowedImageExtensions.includes(fileExtension)) {
                    toast.warning("Signature must be in JPG, JPEG, or PNG format!");
                    event.target.value = "";
                    return;
                }
            } 
            // Handling for other fields (PDF and images)
            else {
                const allowedExtensions = ["pdf", "jpeg", "jpg", "png"];
                if (!allowedExtensions.includes(fileExtension)) {
                    toast.warning(`Invalid file format for ${fieldName}! Please upload a PDF, JPEG, JPG, or PNG.`);
                    event.target.value = "";
                    return;
                }
            }

            setFiles(prev => ({
                ...prev,
                [fieldName]: selectedFile
            }));
            setIsSaved(false);
        }
    };

    const handleSave = async () => {
        // Check if all required files are present
        const requiredFields = Object.keys(files).filter(key => key !== "panCard"); // panCard is optional
        const missingFiles = requiredFields.filter(field => !files[field]);

        if (missingFiles.length > 0) {
            toast.error(`Please upload all required documents: ${missingFiles.join(", ")}`);
            return;
        }

        setLoading(true);

        try {
            // Prepare FormData with only new/changed files
            const formData = new FormData();
            const filesToUpload = [];

            Object.entries(files).forEach(([fieldName, file]) => {
                if (file && !file.isExisting) { // Only upload new files
                    formData.append("files", file);
                    filesToUpload.push(fieldName);
                }
            });

            let uploadedFiles = [];

            if (filesToUpload.length > 0) {
                // Upload new files to AWS
                const uploadResponse = await axios.post(
                    AWS_MULTIPART_DOC_UPLOAD_URL,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (uploadResponse?.data?.response?.rcode === 0) {
                    uploadedFiles = uploadResponse.data.response.coreData.responseData.uploadedFiles;
                } else {
                    throw new Error(uploadResponse?.data?.response?.rmessage || "Upload failed");
                }
            }

            // Combine existing and new files
            const allDocuments = [
                ...(documentDetails || []).filter(doc =>
                    !filesToUpload.includes(doc.fileName) // Keep existing docs that weren't replaced
                ),
                ...filesToUpload.map((fieldName, index) => ({
                    fileName: fieldName,
                    fileUrl: uploadedFiles[index].url
                }))
            ];

            // Save to server
            const serverResponse = await axios.post(
                `${BASE_URL}/test/onboarding/businessdocuments?email=${businessDetails?.email}`,
                { businessDocuments: allDocuments }
            );

            if (serverResponse?.data?.response?.rcode === 0) {
                dispatch(setDocumentUpload(allDocuments));
                toast.success("Documents saved successfully");
                setIsSaved(true);
            } else {
                throw new Error(serverResponse?.data?.response?.rmessage || "Save failed");
            }
        } catch (error) {
            console.error("Document upload error:", error);
            toast.error(error.message || "Failed to save documents");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        const requiredFields = Object.keys(files).filter(key => key !== "panCard");
        const missingFiles = requiredFields.filter(field => !files[field]);

        if (missingFiles.length > 0) {
            toast.error(`Please upload all required documents: ${missingFiles.join(", ")}`);
            return;
        }

        if (!isSaved) {
            await handleSave();
        }
        navigate('/registration/address-details');
    };

    return (
        <>
            {loading && <Loader />}
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

                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8">
                            {Object.keys(files).map((fieldName) => (
                                <div className="mb-3" key={fieldName}>
                                    <div className="document-details-input-container">
                                        <label className="mb-1 text-capitalize">
                                            {fieldName.replace(/([A-Z])/g, " $1")}:
                                            {fieldName !== "panCard" && <span className='star-inde'>*</span>}
                                        </label>
                                        <div className="document-details-input-box d-flex justify-content-between">
                                            <div className={`document-name-box ${files[fieldName] ? "document-name-box-active" : ""}`}>
                                                <p className="mb-0">
                                                    {files[fieldName] ? (
                                                        files[fieldName].url ? (
                                                            <a
                                                                href={files[fieldName].url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary"
                                                            >
                                                                {files[fieldName].name || "View Document"}
                                                            </a>
                                                        ) : (
                                                            files[fieldName].name
                                                        )
                                                    ) : (
                                                        // "Upload (pdf, jpeg, png, jpg)"
                                                        fieldName === "signature"
                                                            ? "Upload (jpeg, jpg, png)"
                                                            : "Upload (pdf, jpeg, jpg, png)"
                                                    )}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                // accept=".pdf, .jpeg, .jpg, .png"
                                                accept={fieldName === "signature" ? ".jpeg, .jpg, .png" : ".pdf, .jpeg, .jpg, .png"}
                                                ref={fileRefs[fieldName]}
                                                style={{ display: "none" }}
                                                onChange={(e) => handleFileChange(e, fieldName)}
                                            />
                                            <button
                                                className="document-uploud-button"
                                                onClick={() => fileRefs[fieldName].current.click()}
                                            >
                                                {files[fieldName] ? "Replace" : "Upload"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="row my-4">
                        <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-evenly">
                            <button className="back-btn" onClick={() => navigate("/registration/bank-details")}>
                                Back
                            </button>
                            <button
                                className="save-btn"
                                style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}}
                                onClick={handleSave}
                                disabled={loading || isSaved}
                            >
                                {loading ? "Saving..." : isSaved ? "Saved" : "Save"}
                            </button>
                            <button className="next-btn" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentUploud;


















// ---------------THIS IS PREVIOUS CODE START-----------------


// import { useState, useRef } from "react";
// import axios from "axios"; // Import Axios for API requests
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { setDocumentUpload } from "../../../redux/reducers/registrationSlice";

// import './documentUploud.css';
// import RegistrationHeader from '../../../components/registrationHeader/RegistrationHeader';
// import RegistrationProgress from '../../../components/registrationProgress/RegistrationProgress';
// import Loader from "../../../components/loader/Loader";
// import { AWS_MULTIPART_DOC_UPLOAD_URL, BASE_URL } from "../../../config/urls";

// const DocumentUploud = () => {

//     const navigate = useNavigate();
//     const dispatch = useDispatch();


//     const businessDetails = useSelector((state) => state.registration.businessDetails);
//     console.log(businessDetails, "businessDetails getting from redux store"); // This will log the stored business details

//     const bankDetails = useSelector((state) => state.registration.bankDetails);
//     console.log(bankDetails, "bankDetails getting from redux store"); // This will log the stored business details

//     const documentDetails = useSelector((state) => state.registration.documentUpload);
//     console.log(documentDetails, "documentDetails getting from redux store"); // This will log the stored business details

//     const allowedExtensions = ["pdf", "jpeg", "jpg", "png"];
//     const [files, setFiles] = useState({
//         panCard: null,
//         gstinCertificate: null,
//         cancelledCheque: null,
//         certificateOfIncorporation: null,
//         businessAddressProof: null,
//         signature: null,
//     });
//     const [loading, setLoading] = useState(false); // Loading state
//     const [isSaved, setIsSaved] = useState(false);

//     // References for file inputs
//     const fileRefs = {
//         panCard: useRef(null),
//         gstinCertificate: useRef(null),
//         cancelledCheque: useRef(null),
//         certificateOfIncorporation: useRef(null),
//         businessAddressProof: useRef(null),
//         signature: useRef(null),
//     };

//     const handleFileChange = (event, fieldName) => {
//         const selectedFile = event.target.files[0];

//         if (selectedFile) {
//             const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
//             if (allowedExtensions.includes(fileExtension)) {
//                 setFiles((prevFiles) => ({
//                     ...prevFiles,
//                     [fieldName]: selectedFile,
//                 }));
//             } else {
//                 toast.warning(`Invalid file format for ${fieldName}! Please upload a PDF, JPEG, JPG, or PNG.`);
//                 event.target.value = ""; // Reset input
//                 setFiles((prevFiles) => ({
//                     ...prevFiles,
//                     [fieldName]: null,
//                 }));
//             }
//         }
//     };

//     const handleSave = async () => {
//         // 1. Check if all files are uploaded
//         const missingFiles = Object.entries(files).filter(([_, file]) => !file);
//         if (missingFiles.length > 0) {
//             toast.error(`Please upload all required documents.`);
//             return;
//         }

//         // // Filter required files (excluding panCard)
//         // const requiredFiles = Object.entries(files).filter(
//         //     ([key, file]) => key !== "panCard" && !file
//         // );

//         // if (requiredFiles.length > 0) {
//         //     toast.error(`Please upload all required documents.`);
//         //     return;
//         // }


//         setLoading(true); // Start loading

//         try {
//             // 2. Prepare FormData for file upload
//             const formData = new FormData();
//             Object.values(files).forEach(file => {
//                 formData.append("files", file);
//             });

//             // 3. Upload files to first API
//             const uploadResponse = await axios.post(
//                 AWS_MULTIPART_DOC_UPLOAD_URL,
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             console.log(uploadResponse, "url file_name response!")

//             if (uploadResponse?.data?.response?.rcode === 0 && uploadResponse?.data?.response?.coreData?.responseData?.uploadedFiles) {
//                 const uploadedFiles = uploadResponse?.data?.response?.coreData?.responseData?.uploadedFiles;
//                 console.log(uploadedFiles, "uploaded file from aws. raw file upload respones");

//                 // 4. Extract file names and URLs from response
//                 const formattedFiles = uploadedFiles?.map((file, index) => ({
//                     fileName: Object.keys(files)[index], // Use the field name as fileName
//                     fileUrl: file.url, // Extract URL from API response
//                 }));

//                 try {
//                     // 5. Send URLs and filenames to the second API
//                     const serverResponse = await axios.post(
//                         `${BASE_URL}/test/onboarding/businessdocuments?email=${businessDetails?.email}`,
//                         { businessDocuments: formattedFiles },
//                         { headers: { "Content-Type": "application/json" } }
//                     );
//                     console.log(serverResponse, "this is server response when sending urls and filename");

//                     if (serverResponse?.data?.response?.rcode === 0 && serverResponse?.data?.response?.coreData?.responseData?.businessDocuments) {
//                         const serverResData = serverResponse?.data?.response?.coreData?.responseData?.businessDocuments;
//                         console.log(serverResData, "actual response data from server!")
//                         dispatch(setDocumentUpload(serverResData));
//                         toast.success("Documents saved Successfully" || serverResponse?.data?.response?.rmessage);
//                         setIsSaved(true);
//                     } else {
//                         toast.error(serverResponse?.data?.response?.rmessage || "Failed to upload documents. Please try again.");
//                     }

//                 } catch (error) {
//                     toast.error("server busy when uploading documents. Please try again.");
//                     console.log(error, "server error when sending urls and filename")
//                 }




//             } else {
//                 toast.error(uploadResponse?.data?.response?.rmessage || "Failed to upload documents. Please try again.");
//                 console.log("differnt r message when uploading to aws")
//             }

//             // alert("Documents uploaded successfully!");
//         } catch (error) {
//             console.log("Error uploading documents:", error);
//             toast.error("Failed to upload documents. Please try again.");
//         } finally {
//             setLoading(false); // Stop loading
//         }
//     };

//     // Handle Next button click
//     const handleNext = async () => {
//         // if (!isSaved && (!documentDetails || documentDetails.length === 0)) {
//         //     toast.error("Please upload the documents before proceeding.");
//         //     return;
//         // }

//         const missingFiles = Object.entries(files).filter(([_, file]) => !file);
//         if (missingFiles.length > 0) {
//             toast.error(`Please upload all required documents.`);
//             return;
//         }

//         // // Filter required files (excluding panCard)
//         // const requiredFiles = Object.entries(files).filter(
//         //     ([key, file]) => key !== "panCard" && !file
//         // );

//         // if (requiredFiles.length > 0) {
//         //     toast.error(`Please upload all required documents.`);
//         //     return;
//         // }

//         if (!isSaved) {
//             await handleSave();
//         }
//         navigate('/registration/address-details');
//     };


//     return (
//         <>
//             {loading && <Loader />}

//             <div className="document-uploud-section overflow-y-auto overflow-x-hidden vh-100">
//                 <div className="registration-header overflow-hidden">
//                     <RegistrationHeader />
//                 </div>
//                 <div className="registration-progress">
//                     <RegistrationProgress color="#1F8505" active="#fff" step={3} />
//                 </div>
//                 <div className="document-details-main-section mt-2">
//                     <div className="row mb-3">
//                         <div className="col-12">
//                             <h3 className="text-center">Business Documents</h3>
//                         </div>
//                     </div>

//                     <div className="row justify-content-center">
//                         <div className="col-lg-6 col-md-8">
//                             {Object.keys(files).map((fieldName, index) => (
//                                 <div className="mb-3" key={index}>
//                                     <div className="document-details-input-container">
//                                         {/* {fieldName === "panCard" ? '' : '*'} */}
//                                         <label className="mb-1 text-capitalize">{fieldName.replace(/([A-Z])/g, " $1")}:*</label>
//                                         <div className="document-details-input-box d-flex justify-content-between">
//                                             <div className={`document-name-box ${files[fieldName] ? "document-name-box-active" : ""}`}>
//                                                 <p className="mb-0">{files[fieldName] ? files[fieldName].name : "Upload (pdf, jpeg, png, jpg)"}</p>
//                                             </div>
//                                             <input
//                                                 type="file"
//                                                 accept=".pdf, .jpeg, .jpg, .png"
//                                                 ref={fileRefs[fieldName]}
//                                                 style={{ display: "none" }}
//                                                 onChange={(e) => handleFileChange(e, fieldName)}
//                                             />
//                                             <button className="document-uploud-button" onClick={() => fileRefs[fieldName].current.click()}>Upload</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="row my-4">
//                         <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-evenly">
//                             <button className="back-btn" onClick={() => navigate("/registration/bank-details")}>Back</button>
//                             <button className="save-btn" style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}} onClick={handleSave} disabled={loading || isSaved}>
//                                 {loading ? "Saving..." : isSaved ? "Saved" : "Save"}
//                             </button>
//                             <button className="next-btn" onClick={handleNext}>Next</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default DocumentUploud;



// ---------------------THIS IS PREVIOUS CODE END------------------