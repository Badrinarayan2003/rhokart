import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./brandsDetails.css";
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";
import Loader from "../../../components/loader/Loader";


import { MdKeyboardArrowRight } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

import { AWS_MULTIPART_DOC_UPLOAD_URL, BASE_URL } from "../../../config/urls";
import { categories } from "../../../constants/data";
import { setBrandsDetails } from "../../../redux/reducers/registrationSlice";

const BrandsDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const businessDetails = useSelector((state) => state.registration?.businessDetails);
    console.log(businessDetails, "business details in brands detail");

    const bankDetails = useSelector((state) => state.registration?.bankDetails);
    console.log(bankDetails, "bankDetails details in brands detail");

    const documentDetails = useSelector((state) => state.registration?.documentUpload);
    console.log(documentDetails, "documentUpload details in brands detail");

    const addressDetails = useSelector((state) => state.registration?.addressDetails);
    console.log(addressDetails, "addressDetails in brands detail");

    const brandDetails = useSelector((state) => state.registration?.brandsDetails);
    console.log(brandDetails, "brandDetails details in brands detail");

    const [brands, setBrands] = useState([]); // State to store API brands
    // Fetch brands from API
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/test/onboarding/brandlist`);
                if (response) {
                    setBrands(response?.data);
                    console.log(response?.data, "brand list ")
                } else {
                    toast.error("Failed to fetch brands.");
                }
            } catch (error) {
                toast.error("Error fetching brands. Try again later.");
            }
        };

        fetchBrands();
    }, []);


    const [groups, setGroups] = useState([
        { brand: "", category: "", file: null, certificationUrl: "" },
        { brand: "", category: "", file: null, certificationUrl: "" },
        { brand: "", category: "", file: null, certificationUrl: "" },
        { brand: "", category: "", file: null, certificationUrl: "" },
        { brand: "", category: "", file: null, certificationUrl: "" },
        { brand: "", category: "", file: null, certificationUrl: "" },
    ]);

    const handleAddMoreBrands = () => {
        setGroups([...groups, { brand: "", category: "", file: null, certificationUrl: "" }]);
    };

    const [loading, setLoading] = useState(false);
    const [fileLoading, setFileLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Handle Brand Selection
    const handleBrandChange = (index, value) => {
        const newGroups = [...groups];
        newGroups[index].brand = value;
        setGroups(newGroups);
    };

    // Handle Category Selection
    const handleCategoryChange = (index, value) => {
        const newGroups = [...groups];
        newGroups[index].category = value;
        newGroups[index].file = null; // Reset file if category changes
        newGroups[index].certificationUrl = ""; // Reset file URL
        setGroups(newGroups);
    };

    // Handle File Upload to AWS
    const handleFileUpload = async (index, event) => {
        const uploadedFile = event.target.files[0];

        if (!uploadedFile || uploadedFile.type !== "application/pdf") {
            toast.warning("Please upload a valid PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append("files", uploadedFile);

        try {
            setFileLoading(true);

            const response = await axios.post(AWS_MULTIPART_DOC_UPLOAD_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response?.data?.response?.rcode === 0) {
                const uploadedFiles = response.data.response.coreData.responseData.uploadedFiles;
                const fileUrl = uploadedFiles[0]?.url || "";

                if (fileUrl) {
                    // Update the state with the uploaded file URL
                    const newGroups = [...groups];
                    newGroups[index].file = uploadedFile;
                    newGroups[index].certificationUrl = fileUrl;
                    setGroups(newGroups);

                    toast.success("File uploaded successfully!");
                }
            } else {
                toast.error("File upload failed. Please try again.");
            }
        } catch (error) {
            toast.error("Error uploading document. Try again later.");
        } finally {
            setFileLoading(false);
        }
    };

    // Validate Fields Before Save
    const validateFields = () => {
        for (const group of groups) {
            // if (group.brand.trim() === "" || group.category.trim() === "") {
            //     toast.error("Please select both brand and category for all fields.");
            //     return false;
            // }
            if ((group.category === "2" || group.category === "3") && !group.certificationUrl) {
                toast.error("Please upload a document for required categories.");
                return false;
            }

        }
        return true;
    };

    // Handle Save
    const handleSave = async () => {

        if (!validateFields()) return;

        setLoading(true);
        try {
            // Prepare Data
            // const formattedData = groups.map((group) => ({
            //     brandName: group.brand,
            //     associationType: categories.find((cat) => cat.id === group.category)?.name || "",
            //     certificationUrl: group.certificationUrl || "",
            // }));
            const formattedData = groups
                .filter(group => group.brand.trim() !== "" && group.category.trim() !== "") // Only keep filled groups
                .map(group => ({
                    brandName: group.brand,
                    associationType: categories.find(cat => cat.id === group.category)?.name || "",
                    certificationUrl: group.certificationUrl || "",
                }));

            console.log("Formatted Data:", formattedData);

            // Send Data to Backend
            const serverResponse = await axios.post(
                `${BASE_URL}/test/onboarding/branddetails?email=${businessDetails?.email}`,
                { brands: formattedData },
                { headers: { "Content-Type": "application/json" } }
            );

            if (serverResponse?.data?.response?.rcode === 0) {
                const brandResMainData = serverResponse?.data?.response?.coreData?.responseData?.brands;
                dispatch(setBrandsDetails(brandResMainData));
                toast.success("Brand details saved successfully!");
                console.log(brandResMainData, "backend server res final main data")
                setIsSaved(true);
            } else {
                toast.error(serverResponse?.data?.response?.rmessage || "Failed to save data.");
            }
        } catch (error) {
            toast.error("Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };


    // Handle Next button click
    const handleNext = async () => {
        // if (!isSaved && !brandDetails || brandDetails.length === 0) {
        //     toast.error("Please upload the documents before proceeding.");
        //     return;
        // }

        if (!validateFields()) {
            toast.error("Please upload a document for required categories.");
            return;
        }

        if (!isSaved) {
            await handleSave();
        }
        navigate('/review-status');
    };

    return (
        <>
            {loading && <Loader />}
            {fileLoading && <Loader message="Uploading File..." />}

            <div className="brand-details-section overflow-y-auto overflow-x-hidden vh-100">
                <div className="registration-header overflow-hidden">
                    <RegistrationHeader />
                </div>
                <div className="registration-progress">
                    <RegistrationProgress color="#1F8505" active="#fff" step={5} />
                </div>
                <div className="brand-details-main-section mt-5 overflow-x-auto">
                    <div className="row mb-3">
                        <div className="col-12 d-flex position-relative brand-details-top-heading-box">
                            <p className="brand-details-text">Select the brands that you would like to sell here</p>
                            <p className="brand-details-skip" onClick={() => navigate('/review-status')}>
                                Skip <MdKeyboardArrowRight size={20} color="red" />
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-1'></div>
                        <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3">
                            <p className="brand-detail-headers">Brand:</p>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-5">
                            <p className="brand-detail-headers">Type of association with the brand:</p>
                        </div>
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-4">
                            <p className="brand-detail-headers">Upload required document:</p>
                        </div>
                        <div className="col-xxl-1 col-xl-1 col-lg-1 col-md-1"></div>
                    </div>

                    {groups.map((group, index) => {
                        const isUploadAllowed = group.category === "2" || group.category === "3";

                        return (
                            <div key={index} className="row mt-2">
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-1"></div>
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3">
                                    <select className="brand-type" value={group.brand} onChange={(e) => handleBrandChange(index, e.target.value)}>
                                        <option value="">Brand</option>
                                        {brands.map((brand, i) => (
                                            <option key={i} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-5">
                                    <select className="association-type"
                                        value={group.category}
                                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                                        disabled={!group.brand}
                                    >
                                        <option value="">Choose Type of association</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-4 d-flex gap-4">
                                    <button
                                        onClick={() => document.getElementById(`fileInput-${index}`).click()}
                                        disabled={!isUploadAllowed}
                                        style={{ backgroundColor: isUploadAllowed ? "#40444C" : "#ccc", color: isUploadAllowed ? "#fff" : "#000" }}
                                        className="upload-button"
                                    >
                                        Upload
                                    </button>

                                    {group.file && <p className="mb-0">{group.file.name}</p>}
                                </div>

                                <input
                                    id={`fileInput-${index}`}
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFileUpload(index, e)}
                                    disabled={!isUploadAllowed}
                                />
                                <div className="col-xxl-1 col-xl-1 col-lg-1 col-md-1"></div>
                            </div>
                        );
                    })}
                    <div className="row my-3">
                        <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-1 col-sm-12 col-12'></div>
                        <div className="col-xxl-10 col-xl-10 col-lg-10 col-md-11 col-sm-12 col-12 d-flex justify-content-start">
                            <button className="brand-pickup-btn" onClick={handleAddMoreBrands}>
                                <span><IoIosAddCircleOutline size={19} color='#fff' /></span>
                                Add more brands </button>
                        </div>
                    </div>

                    <div className="row my-4">
                        <div className="col-lg-12 d-flex justify-content-evenly">
                            <button className="back-btn" onClick={() => navigate("/registration/address-details")}>Back</button>
                            <button className="save-btn" style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}} onClick={handleSave} disabled={loading || isSaved}>
                                {loading ? "Saving..." : isSaved ? "Saved" : "Save"}
                            </button>
                            <button className="next-btn" onClick={handleNext}>Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default BrandsDetails;
