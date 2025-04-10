import './businessDetails.css';
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from '../../../components/registrationProgress/RegistrationProgress';
import BusinessDetailCountryCode from '../../../components/businessDetailCountryCode/BusinessDetailCountryCode';
import Loader from '../../../components/loader/Loader';

import { submitBusinessDetails } from '../../../api/businessDetailService';
import { requestOTP, verifyOTP } from '../../../api/otpService';

import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { setBusinessDetails, setBankDetails, setDocumentUpload, setAddressDetails, setBrandsDetails } from '../../../redux/reducers/registrationSlice';
import { BASE_URL } from '../../../config/urls';

import { MdVerified } from "react-icons/md";


const BusinessDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sellerEmail = useSelector((state) => state.auth.sellerEmail);
    const sellerId = useSelector((state) => state.auth.sellerId);
    const accessLevel = useSelector((state) => state.auth.accessLevel);
    // const sellerName = useSelector((state) => state.auth.sellerName);
    // const sellerPhone = useSelector((state) => state.auth.sellerPhone);


    useEffect(() => {
        console.log(sellerEmail, "seller email from store");
        console.log(sellerId, "seller id from store");
        console.log(accessLevel, "accessLevel from store");

        if (sellerId && accessLevel === "REGISTRATION") {
            const fetchRegistrationDetails = async () => {
                try {
                    const response = await axios.get(
                        `${BASE_URL}/test/onboarding/registrationdetail`,
                        {
                            params: {
                                email: sellerEmail,
                            },
                        }
                    );
                    console.log(response, "registration details response");
                    console.log(response?.data?.response?.rcode, "registration details rcode");
                    console.log(response?.data?.response?.coreData?.responseData, "registration details coreData");
                    if (response?.data?.response?.rcode === 0 && response?.data?.response?.coreData?.responseData) {
                        // toast.success(response?.data?.response?.rmessage)
                        const fetchedBusinessDetails = response?.data?.response?.coreData?.responseData?.businessDetail;
                        const fetchedBankDetails = response?.data?.response?.coreData?.responseData?.bankDetail;
                        const fetchedDocuments = response?.data?.response?.coreData?.responseData?.documents;
                        const fetchedsellerAddress = response?.data?.response?.coreData?.responseData?.sellerAddress;
                        const fetchedBrandDetails = response?.data?.response?.coreData?.responseData?.brands;
                        console.log(fetchedBusinessDetails, "fetched data only business details")
                        console.log(fetchedBankDetails, "fetched data only bank details")
                        console.log(fetchedDocuments, "fetched data only Documents")
                        console.log(fetchedsellerAddress, "fetched data only seller Address")
                        console.log(fetchedBrandDetails, "fetched data only brand details")
                        dispatch(setBusinessDetails(fetchedBusinessDetails));
                        dispatch(setBankDetails(fetchedBankDetails));
                        dispatch(setDocumentUpload(fetchedDocuments));
                        dispatch(setAddressDetails(fetchedsellerAddress));
                        dispatch(setBrandsDetails(fetchedBrandDetails));
                    } else {
                        console.log(response?.data?.response?.rmessage, "registration details rmessage");
                        toast.error(response?.data?.response?.rmessage)
                    }
                } catch (error) {
                    console.log("Error fetching registration details:", error);
                }
            };

            fetchRegistrationDetails();
        }
    }, [sellerId, accessLevel, sellerEmail]);



    const business_details = useSelector((state) => state.registration?.businessDetails)
    console.log(business_details, "business_details this is from store");
    if (business_details?.alternateEmailVerified) {
        console.log(business_details, "this is from store");
    }

    const [formData, setFormData] = useState({
        gstin: "",
        pan: "",
        entityName: "",
        contactName: "",
        tradeName: "",
        address: "",
        country: "",
        pincode: "",
        state: "",
        city: "",
        tan: "",
        phoneNo: "",
        email: sellerEmail || "",
        alternateEmail: "",
        alternatePhoneNo: "",
        alternateEmailVerified: false,
        alternatePhoneNoVerified: false,
        panVerified: false,
        gstinVerified: false,
        emailVerified: !!sellerEmail,
        phoneNoVerified: false
    });

    // Track if GSTIN was previously verified
    const [wasGstinVerified, setWasGstinVerified] = useState(false);

    // Update formData when business_details changes
    useEffect(() => {
        if (business_details) {
            setFormData({
                gstin: business_details.gstin || "",
                pan: business_details.pan || "",
                entityName: business_details.entityName || "",
                contactName: business_details.contactName || "",
                tradeName: business_details.tradeName || "",
                address: business_details.address || "",
                country: business_details.country || "",
                pincode: business_details.pincode || "",
                state: business_details.state || "",
                city: business_details.city || "",
                tan: business_details.tan || "",
                phoneNo: business_details.phoneNo || "",
                email: sellerEmail || "",
                alternateEmail: business_details.alternateEmail || "",
                alternatePhoneNo: business_details.alternatePhoneNo || "",
                alternateEmailVerified: business_details.alternateEmailVerified || false,
                alternatePhoneNoVerified: business_details.alternatePhoneNoVerified || false,
                panVerified: business_details.panVerified || false,
                gstinVerified: business_details.gstinVerified || false,
                emailVerified: !!sellerEmail,
                phoneNoVerified: business_details.phoneNoVerified || false
            });
            // setIsSaved(true); // Mark as saved since we're loading existing data
            setWasGstinVerified(business_details.gstinVerified || false);
        }
    }, [business_details, sellerEmail]);

    const [altEmailLoader, setAltEmailLoader] = useState(false);
    const [altEmailVerifyLoader, setAltEmailVerifyLoader] = useState(false);


    // for gstin error message
    const [gstinValidateError, setGstinValidateError] = useState("");

    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [altEmailOtp, setAltEmailOtp] = useState("");

    const validateGSTIN = (gst) => {
        let errorFlag = false;
        let errorMessage = "";
        let pan = "";

        if (gst.length !== 15) {
            errorMessage = 'Invalid Length of GSTIN.';
            errorFlag = true;
        } else {
            const stateCode = parseInt(gst.substring(0, 2));
            if (stateCode < 1 || stateCode > 38 || isNaN(stateCode)) {
                errorMessage = 'Invalid First Two Characters of GSTIN.';
                errorFlag = true;
            }
            pan = gst.substring(2, 12).toUpperCase();
            const panRegex = /[A-Z]{3}[PCHFATBLJG]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(pan)) {
                errorMessage = 'Invalid PAN of GSTIN.';
                errorFlag = true;
            }
            if (gst[13].toUpperCase() !== "Z") {
                errorMessage = "14th character of GSTIN should be 'Z'";
                errorFlag = true;
            }
        }
        return { errorFlag, errorMessage, pan };
    };

    const [gstinLoading, setGstinLoading] = useState(false);

    // Function to fetch business details by GSTIN
    const fetchBusinessDetailsByGSTIN = async (gstin) => {
        try {
            setGstinLoading(true);
            const response = await axios.get(
                `https://80t82fiur2.execute-api.ap-south-1.amazonaws.com/test/autofill/businessdetails?gstNumber=${gstin}`
            );

            if (response.data?.response?.rcode === 0) {
                const businessData = response.data.response.coreData.responseData;
                console.log(response, "GSTIN RESPONSE FOR BUSINESS DETAILS");
                // Update form data with the fetched values
                setFormData(prev => ({
                    ...prev,
                    entityName: businessData.entityName || prev.entityName,
                    tradeName: businessData.tradeName || prev.tradeName,
                    address: businessData.address || prev.address,
                    pincode: businessData.pincode || prev.pincode,
                    state: businessData.state || prev.state,
                    city: businessData.city || prev.city,
                    gstinVerified: true,
                    pan: businessData.pan || prev.pan,
                    panVerified: true
                }));
                setWasGstinVerified(true);
                toast.success("Business details auto-filled successfully");
            } else {
                toast.error(response.data?.response?.rmessage || "Error fetching business details");
            }
        } catch (error) {
            console.error("Error fetching business details:", error);
            toast.error("Failed to fetch business details");
        } finally {
            setGstinLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If changing GSTIN after it was previously verified
        if (name === "gstin" && wasGstinVerified) {
            // Reset all fields that were auto-filled by GSTIN
            setFormData(prev => ({
                ...prev,
                [name]: value,
                entityName: "",
                tradeName: "",
                address: "",
                pincode: "",
                state: "",
                city: "",
                gstinVerified: false,
                pan: "",
                panVerified: false
            }));
            setWasGstinVerified(false);
            setGstinValidateError("");
            return;
        }

        let newFormData = { ...formData, [name]: value };

        if (name === "gstin") {
            const { errorFlag, errorMessage, pan } = validateGSTIN(value);
            if (!errorFlag) {
                newFormData = {
                    ...newFormData,
                    pan,
                    panVerified: true,
                    // gstinVerified: true
                };
                setGstinValidateError("");

                // Fetch business details when valid GSTIN is entered
                fetchBusinessDetailsByGSTIN(value);
            } else {
                // toast.error(errorMessage);
                setGstinValidateError(errorMessage);
                // setTimeout(() => {
                //     setGstinValidateError("");
                // }, 2000);
            }
        }
        setFormData(newFormData);
    };

    const validateForm = () => {
        // const requiredFields = ["gstin", "entityName", "contactName", "address", "tradeName", "country", "pincode", "state", "city", "phoneNo", "email", "tan"];
        const requiredFields = ["gstin", "contactName", "phoneNo", "email", "pincode", "address", "tradeName"];
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${field} field is required`);
                return false;
            }
        }
        if (formData.alternateEmail && !formData.alternateEmailVerified) {
            toast.error("Alternate Email needs verification");
            return false;
        }
        // if (formData.alternatePhoneNo && !formData.alternatePhoneNoVerified) {
        //     toast.error("Alternate Phone Number needs verification");
        //     return false;
        // }
        return true;
    };


    // Function to send OTP
    const handleRequestOTP = async () => {
        if (formData.email === formData.alternateEmail) {
            toast.warning("Alternate Email should be different");
            return;
        }
        setAltEmailLoader(true);
        const success = await requestOTP(formData.alternateEmail);
        if (success) {
            toast.success("OTP sent. Please check your email.");
            setAltEmailLoader(false);
        } else {
            setAltEmailLoader(false);
        }
    };

    // Function to verify OTP
    const handleVerifyOTP = async () => {
        setAltEmailVerifyLoader(true);
        const success = await verifyOTP(formData.alternateEmail, altEmailOtp);
        if (success) {
            setFormData({ ...formData, alternateEmailVerified: true }); // ✅ Set email verified
            setAltEmailVerifyLoader(false);
        } else {
            setAltEmailVerifyLoader(false);
        }
    };



    const handleFormSubmit = async () => {
        console.log(formData, "this is before formdata when submit")
        if (!validateForm()) {
            return;
        }
        if (formData.email === formData.alternateEmail) {
            toast.warning("Alternate Email should be different");
            return;
        }


        try {
            setLoading(true);
            const responseData = await submitBusinessDetails(formData);

            if (responseData) {
                setLoading(false);
                console.log(responseData, "business respones ok")

                if (responseData?.response?.rcode === 0 && responseData?.response?.coreData?.responseData) {
                    const responseSellerData = responseData?.response?.coreData?.responseData;
                    console.log(responseSellerData, "response business Seller Data .");
                    dispatch(setBusinessDetails(responseSellerData));
                    toast.success(responseData?.response?.rmessage || "Business details saved successfully");
                    setIsSaved(true);
                } else {
                    toast.error(responseData?.response?.rmessage || "Oops something went wrong");
                }
            } else {
                setLoading(false);
                throw new Error("Something went wrong.");
            }
        } catch (error) {
            setLoading(false);
            console.log("business details catch error", error)
            if (error.code === "ERR_NETWORK") {
                toast.error(error.message || "Check your internet connection");
            } else {
                toast.error(error?.message);
            }
        }
    };


    // Handle Next button click
    const handleNext = async () => {
        console.log(isSaved, "before is save");

        if (!validateForm()) {
            toast.error("Please fill all details before procceding");
            return;
        }

        if (!isSaved) {
            console.log(isSaved, "after is save");
            await handleFormSubmit();
            // if (!isSaved) return; // If still not saved, stop navigation
        }
        // if (!isSaved && !business_details) {
        //     toast.error("Please save the business details before proceeding.");
        //     return;
        // }
        navigate('/registration/bank-details');
    };


    return (
        <>
            {loading && <Loader />}

            <div className="business-details-section position-relative overflow-x-hidden overflow-y-auto vh-100">

                <div className="registration-header overflow-hidden">
                    <RegistrationHeader />
                </div>
                <div className="registration-progress">
                    <RegistrationProgress color="#1F8505" active="#fff" step={1} />
                </div>
                <div className="business-details-main-section mt-2">

                    <div className="row mb-3">
                        <div className="col-12">
                            <h3 className="text-center">Business Details</h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column position-relative">
                                <label className="mb-1">GSTIN:<span className='star-inde'>*</span> </label>
                                {
                                    gstinValidateError ? <p className='mb-0 gstin-error-msg'>{gstinValidateError}</p> : ""
                                }
                                {formData.gstinVerified && (
                                    <small className="text-success">GSTIN fetched successfully</small>
                                )}
                                <div className='position-relative'>
                                    <input type="text" placeholder="Enter GSTIN" name="gstin" className="business-detail-input-one w-100" value={formData.gstin} onChange={handleChange} />
                                    {gstinLoading && (
                                        <div className="position-absolute top-50 end-0 translate-middle-y pe-2">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className="verified-symbol">
                                    {/* <MdVerified color='green' size={18} /> */}
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Entity Name: </label>
                                <input type="text" placeholder="Enter Entity" name="entityName" className="business-detail-input-one" value={formData.entityName} onChange={handleChange} disabled={formData.gstinVerified && formData.entityName} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Contact Name:<span className='star-inde'>*</span> </label>
                                <input type="text" placeholder="Enter your contact" name="contactName" className="business-detail-input-one" value={formData.contactName} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Display name:<span className='star-inde'>*</span> </label>
                                <input type="text" placeholder="Enter display name" name="tradeName" className="business-detail-input-one" value={formData.tradeName} onChange={handleChange} disabled={formData.gstinVerified && formData.tradeName} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Country: </label>
                                <input type="text" placeholder="Enter country" name="country" className="business-detail-input-one" value={formData.country} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Pincode:<span className='star-inde'>*</span> </label>
                                <input type="number" placeholder="Enter pincode" name="pincode" className="business-detail-input-one" value={formData.pincode} onChange={handleChange} disabled={formData.gstinVerified && formData.pincode} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">State: </label>
                                <input type="text" placeholder="Enter state" name="state" className="business-detail-input-one" value={formData.state} onChange={handleChange} disabled={formData.gstinVerified && formData.state} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">City: </label>
                                <input type="text" placeholder="Enter city" name="city" className="business-detail-input-one" value={formData.city} onChange={handleChange} disabled={formData.gstinVerified && formData.city} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">TAN: </label>
                                <input type="text" placeholder="Enter TAN" name="tan" className="business-detail-input-one" value={formData.tan} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">PAN: </label>
                                <input type="text" placeholder="Enter PAN" name="pan" className="business-detail-input-one" value={formData.pan} onChange={handleChange} disabled />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Address:<span className='star-inde'>*</span> </label>
                                <input type="text" placeholder="Enter your Address" className="business-detail-input-one" name="address" value={formData.address} onChange={handleChange} disabled={formData.gstinVerified && formData.address} />
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-lg-6 col-md-4 d-flex align-items-center justify-content-center mb-3">
                                    <div className="business-detail-input-box position-relative d-flex flex-column">
                                        <label className="mb-1">Phone no.:<span className='star-inde'>*</span> </label>
                                        <div className="d-flex w-100" style={{ gap: "5%" }}>
                                            <div className="business-detail-select-option">
                                                <BusinessDetailCountryCode />
                                            </div>
                                            <input type="number" placeholder="Enter phone" name="phoneNo" className="business-detail-input-one business-detail-phone-input" value={formData.phoneNo} onChange={handleChange} />
                                        </div>
                                        <span className="verified-symbol">
                                            {/* <MdVerified color='green' size={18} /> */}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 business-detail-main-otp-box d-flex align-items-end mb-3">
                                    {/* <div className="business-detail-otp-box d-flex justify-content-center">
                                    <button className="otp-send-btn">Send OTP</button>
                                    <input type="number" placeholder="Enter OTP" value="" name="phone_otp" className="mx-2 business-detail-otp-input" />
                                    <button className="otp-verify-btn">Verify</button>
                                </div> */}
                                </div>

                                <div className="col-lg-6 col-md-4 d-flex align-items-center justify-content-center mb-3">
                                    <div className="business-detail-input-box position-relative d-flex flex-column">
                                        <label className="mb-1">Email id:<span className='star-inde'>*</span> </label>
                                        <input type="email" placeholder="Enter phone" name="email" className="business-detail-input-one" value={formData.email} onChange={handleChange} disabled={!!sellerEmail} />
                                        <span className="verified-symbol">
                                            {sellerEmail && <MdVerified color='green' size={18} />}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 business-detail-main-otp-box d-flex align-items-end mb-3">
                                    {sellerEmail ? "" :
                                        <div className="business-detail-otp-box d-flex justify-content-center">
                                            <button className="otp-send-btn">Send OTP</button>
                                            <input type="number" placeholder="Enter OTP" value="" name="email_otp" className="mx-2 business-detail-otp-input" />
                                            <button className="otp-verify-btn">Verify</button>
                                        </div>
                                    }
                                </div>

                                <div className="col-lg-6 col-md-4 d-flex align-items-center justify-content-center mb-3">
                                    <div className="business-detail-input-box position-relative d-flex flex-column">
                                        <label className="mb-1">Alt Phone no.: </label>
                                        <div className="d-flex w-100" style={{ gap: "5%" }}>
                                            <div className="business-detail-select-option">
                                                <BusinessDetailCountryCode />
                                            </div>
                                            <input type="number" placeholder="Enter phone" name="alternatePhoneNo" className="business-detail-input-one business-detail-phone-input" value={formData.alternatePhoneNo} onChange={handleChange} />
                                        </div>
                                        <span className="verified-symbol">
                                            {/* <MdVerified color='green' size={18} /> */}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 business-detail-main-otp-box d-flex align-items-end mb-3">
                                    {/* <div className="business-detail-otp-box d-flex justify-content-center">
                                    <button className="otp-send-btn ">Send OTP</button>
                                    <input type="number" placeholder="Enter OTP" value="" name="alt_phone_otp" className="mx-2 business-detail-otp-input" />
                                    <button className="otp-verify-btn">Verify</button>
                                </div> */}
                                </div>

                                <div className="col-lg-6 col-md-4 d-flex align-items-center justify-content-center mb-3">
                                    <div className="business-detail-input-box position-relative d-flex flex-column">
                                        <label className="mb-1">Alt Email id: </label>
                                        <input type="email" placeholder="Enter Email" name="alternateEmail" className="business-detail-input-one" value={formData.alternateEmail || business_details?.alternateEmail} onChange={handleChange} />
                                        <span className="verified-symbol">
                                            {(business_details?.alternateEmailVerified || formData.alternateEmailVerified) && (
                                                <MdVerified color="green" size={18} />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 business-detail-main-otp-box d-flex align-items-end mb-3">
                                    {formData.alternateEmail && !formData.alternateEmailVerified && (
                                        <div className="business-detail-otp-box d-flex justify-content-center">
                                            <button className="otp-send-btn" onClick={handleRequestOTP}>{altEmailLoader ? "Sending..." : "Send OTP"}</button>
                                            <input type="number" placeholder="Enter OTP" name="alt_email_otp" className="mx-2 business-detail-otp-input" value={altEmailOtp} onChange={(e) => setAltEmailOtp(e.target.value)} />
                                            <button className="otp-verify-btn" onClick={handleVerifyOTP}>{altEmailVerifyLoader ? "Verifing" : "Verify"}</button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                        <div className="col-lg-4"></div>
                    </div>

                    <div className="row my-4">
                        <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-center gap-5">
                            <button className="save-btn" style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}} onClick={handleFormSubmit} disabled={loading || isSaved || gstinValidateError}>
                                {loading ? "Saving..." : isSaved ? "Saved" : "Save"}
                            </button>
                            <button className="next-btn" onClick={handleNext} disabled={gstinValidateError}>Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default BusinessDetails;