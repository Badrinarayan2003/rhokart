import './businessDetails.css';
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from '../../../components/registrationProgress/RegistrationProgress';
import BusinessDetailCountryCode from '../../../components/businessDetailCountryCode/BusinessDetailCountryCode';
import Loader from '../../../components/loader/Loader';

import { submitBusinessDetails } from '../../../api/businessDetailService';
import { requestOTP, verifyOTP } from '../../../api/otpService';

import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from "react-redux";
import { setBusinessDetails } from '../../../redux/reducers/registrationSlice';

import { MdVerified } from "react-icons/md";


const BusinessDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sellerEmail = useSelector((state) => state.auth.sellerEmail);
    // const sellerPhone = useSelector((state) => state.auth.sellerPhone);

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
            if (stateCode < 1 || stateCode > 37 || isNaN(stateCode)) {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        if (name === "gstin") {
            const { errorFlag, errorMessage, pan } = validateGSTIN(value);
            if (!errorFlag) {
                newFormData = { ...newFormData, pan, panVerified: true, gstinVerified: true };
            } else {
                // toast.error(errorMessage);
                setGstinValidateError(errorMessage);
                setTimeout(() => {
                    setGstinValidateError("");
                }, 2000);
            }
        }
        setFormData(newFormData);
    };

    const validateForm = () => {
        const requiredFields = ["gstin", "entityName", "contactName", "tradeName", "country", "pincode", "state", "city", "phoneNo", "email", "tan"];
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
        const success = await requestOTP(formData.alternateEmail);
        if (success) {
            toast.success("OTP sent. Please check your email.");
        }
    };

    // Function to verify OTP
    const handleVerifyOTP = async () => {
        const success = await verifyOTP(formData.alternateEmail, altEmailOtp);
        if (success) {
            setFormData({ ...formData, alternateEmailVerified: true }); // ✅ Set email verified
        }
    };



    const handleFormSubmit = async () => {
        if (!validateForm()) {
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
                    console.log(responseSellerData, "response business Seller Data ");
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
    const handleNext = () => {
        if (!isSaved) {
            toast.error("Please save the business details before proceeding.");
            return;
        }
        navigate('/registration/bank-details', { state: { email: formData?.email } });
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
                                <label className="mb-1">GSTIN:* </label>
                                {
                                    gstinValidateError ? <p className='mb-0 gstin-error-msg'>{gstinValidateError}</p> : ""
                                }
                                <input type="text" placeholder="Enter GSTIN" name="gstin" className="business-detail-input-one" value={formData.gstin} onChange={handleChange} />
                                <span className="verified-symbol">
                                    {/* <MdVerified color='green' size={18} /> */}
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Entity Name: </label>
                                <input type="text" placeholder="Enter Entity" name="entityName" className="business-detail-input-one" value={formData.entityName} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Contact Name:* </label>
                                <input type="text" placeholder="Enter your contact" name="contactName" className="business-detail-input-one" value={formData.contactName} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">Trade Name: </label>
                                <input type="text" placeholder="Enter trade name" name="tradeName" className="business-detail-input-one" value={formData.tradeName} onChange={handleChange} />
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
                                <label className="mb-1">Pincode: </label>
                                <input type="text" placeholder="Enter pincode" name="pincode" className="business-detail-input-one" value={formData.pincode} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">State: </label>
                                <input type="text" placeholder="Enter state" name="state" className="business-detail-input-one" value={formData.state} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                            <div className="business-detail-input-box d-flex flex-column">
                                <label className="mb-1">City: </label>
                                <input type="text" placeholder="Enter city" name="city" className="business-detail-input-one" value={formData.city} onChange={handleChange} />
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
                        {/* <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">Address: </label>
                            <input type="text" placeholder="Enter your Address" value="" name="business_address" className="business-detail-input-one" />
                        </div>
                    </div> */}

                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-lg-6 col-md-4 d-flex align-items-center justify-content-center mb-3">
                                    <div className="business-detail-input-box position-relative d-flex flex-column">
                                        <label className="mb-1">Phone no.: </label>
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
                                        <label className="mb-1">Email id: </label>
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
                                        <input type="email" placeholder="Enter Email" name="alternateEmail" className="business-detail-input-one" value={formData.alternateEmail} onChange={handleChange} />
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
                                            <button className="otp-send-btn" onClick={handleRequestOTP}>Send OTP</button>
                                            <input type="number" placeholder="Enter OTP" name="alt_email_otp" className="mx-2 business-detail-otp-input" value={altEmailOtp} onChange={(e) => setAltEmailOtp(e.target.value)} />
                                            <button className="otp-verify-btn" onClick={handleVerifyOTP}>Verify</button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                        <div className="col-lg-4"></div>
                    </div>

                    <div className="row my-4">
                        <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-center gap-5">
                            <button className="save-btn" style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}} onClick={handleFormSubmit} disabled={loading || isSaved}>
                                {loading ? "Saving..." : isSaved ? "Saved" : "Save"}
                            </button>
                            <button className="next-btn" onClick={handleNext}>Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default BusinessDetails;