import React, { useState, useEffect, useRef } from "react";
import "./bankDetails.css";
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";
import Loader from "../../../components/loader/Loader";

import { useSelector, useDispatch } from "react-redux";
import { setBankDetails } from "../../../redux/reducers/registrationSlice";
import { BASE_URL } from "../../../config/urls";

import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from "axios";

import { submitBankDetails } from "../../../api/bankDetailService";

const BankDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const businessDetails = useSelector((state) => state.registration.businessDetails);
    const bankDetailsFromStore = useSelector((state) => state.registration.bankDetails)

    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [ifscLoading, setIfscLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false); //last change for track changes


    // const [formData, setFormData] = useState({
    //     accountHolderName: bankDetailsFromStore?.accountHolderName || "",
    //     accountNo: bankDetailsFromStore?.accountNo || "",
    //     confirm_acc_number: "",
    //     ifscCode: bankDetailsFromStore?.ifscCode || "",
    //     bankName: bankDetailsFromStore?.bankName || "",
    //     branchName: bankDetailsFromStore?.branchName || "",
    //     branchCityName: bankDetailsFromStore?.branchCityName || "",
    //     accountType: bankDetailsFromStore?.accountType || "current",
    //     ifscVerified: bankDetailsFromStore?.ifscVerified || false
    // });


    //last change for track changes start
    const initialFormData = useRef({
        accountHolderName: bankDetailsFromStore?.accountHolderName || "",
        accountNo: bankDetailsFromStore?.accountNo || "",
        confirm_acc_number: "",
        ifscCode: bankDetailsFromStore?.ifscCode || "",
        bankName: bankDetailsFromStore?.bankName || "",
        branchName: bankDetailsFromStore?.branchName || "",
        branchCityName: bankDetailsFromStore?.branchCityName || "",
        accountType: bankDetailsFromStore?.accountType || "current",
        ifscVerified: bankDetailsFromStore?.ifscVerified || false
    });

    const [formData, setFormData] = useState({
        ...initialFormData.current
    });

    // Track form changes
    useEffect(() => {
        const currentData = {
            accountHolderName: formData.accountHolderName,
            accountNo: formData.accountNo,
            ifscCode: formData.ifscCode,
            bankName: formData.bankName,
            branchName: formData.branchName,
            branchCityName: formData.branchCityName,
            accountType: formData.accountType,
            ifscVerified: formData.ifscVerified
        };

        const changesDetected = Object.keys(currentData).some(key => {
            return currentData[key] !== initialFormData.current[key];
        });

        setHasChanges(changesDetected);
    }, [formData]);

    //last change for track changes end

    // Handle IFSC code auto-fill
    useEffect(() => {
        const fetchBankDetails = async () => {
            if (formData.ifscCode.length >= 8) { // Only trigger when IFSC is likely complete
                try {
                    setIfscLoading(true);
                    const response = await axios.get(
                        `${BASE_URL}/autofill/bankdetails?ifsc=${formData.ifscCode}`
                    );
                    console.log(response, "ifsc response")
                    if (response.data?.response?.rcode === 0) {
                        const bankData = response?.data?.response?.coreData?.responseData;
                        setFormData(prev => ({
                            ...prev,
                            bankName: bankData.bankName || prev.bankName,
                            branchName: bankData.branchName || prev.branchName,
                            branchCityName: bankData.branchCityName || prev.branchCityName,
                            ifscVerified: bankData.ifscVerified || false
                        }));

                        if (bankData.ifscVerified) {
                            // toast.success("Bank details auto-filled successfully");
                        }
                    } else {
                        // toast.error(`${response.data?.response?.rmessage}` || "error getting bank details");
                    }
                } catch (error) {
                    console.error("IFSC validation failed:", error);
                    // Don't show error toast as user might still be typing
                } finally {
                    setIfscLoading(false);
                }
            }
        };

        // Add debounce to prevent too many API calls
        const debounceTimer = setTimeout(() => {
            if (formData.ifscCode && formData.ifscCode.length >= 8) {
                fetchBankDetails();
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [formData.ifscCode]);

    const [accountMatch, setAccountMatch] = useState(null); // null: not checked, true: match, false: mismatch

    const handleChange = (e) => {
        // setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'ifscCode' && formData.ifscVerified) {
            // Reset verification status when user modifies the IFSC
            setFormData({
                ...formData,
                ifscCode: e.target.value,
                ifscVerified: false,
                bankName: '',
                branchName: '',
                branchCityName: ''
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };


    // Add this new handler for confirm account number blur
    const handleConfirmAccountBlur = () => {
        if (formData.accountNo && formData.confirm_acc_number) {
            const isMatch = formData.accountNo === formData.confirm_acc_number;
            setAccountMatch(isMatch);
            if (!isMatch) {
                // toast.error("Account numbers do not match!");
            }
        }
    };

    const validateForm = () => {
        const requiredFields = [
            "accountHolderName",
            "accountNo",
            "confirm_acc_number",
            "ifscCode",
        ];

        for (let field of requiredFields) {
            if (!formData[field].trim()) {
                toast.error(`${field.replace(/_/g, " ")} is required`);
                return false;
            }
        }

        if (formData.accountNo !== formData.confirm_acc_number) {
            toast.error("Account numbers do not match!");
            return false;
        }

        if (!formData.ifscVerified) {
            toast.error("Please verify your IFSC code");
            return false;
        }

        return true;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const responesData = await submitBankDetails(formData, businessDetails?.email);
            console.log(responesData, "bank details api response")
            if (responesData?.response?.rcode === 0 && responesData?.response?.coreData?.responseData) {
                const responseSellerBankData = responesData?.response?.coreData?.responseData;
                dispatch(setBankDetails(responseSellerBankData));
                toast.success(responesData?.response?.rmessage || "Bank details saved successfully");
                setIsSaved(true);

                //last change for track changes start
                // Update initialFormData after successful save
                initialFormData.current = {
                    accountHolderName: responseSellerBankData.accountHolderName || formData.accountHolderName,
                    accountNo: responseSellerBankData.accountNo || formData.accountNo,
                    ifscCode: responseSellerBankData.ifscCode || formData.ifscCode,
                    bankName: responseSellerBankData.bankName || formData.bankName,
                    branchName: responseSellerBankData.branchName || formData.branchName,
                    branchCityName: responseSellerBankData.branchCityName || formData.branchCityName,
                    accountType: responseSellerBankData.accountType || formData.accountType,
                    ifscVerified: responseSellerBankData.ifscVerified || formData.ifscVerified
                };
                setHasChanges(false);
                //last change for track changes end

            } else {
                toast.error(responesData?.response?.rmessage || "Oops something went wrong");
            }
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error(error.message || "Check your internet connection");
            } else {
                toast.error(error?.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (!validateForm()) {
            // toast.error("Please fill all required field before procceding");
            return;
        }

        if (!isSaved) {
            await handleFormSubmit();
        }
        navigate("/registration/document-uploud");
    };

    return (
        <div className="bank-details-section overflow-x-hidden overflow-y-auto vh-100 position-relative">
            {/* {(loading || ifscLoading) && <Loader />} */}
            {loading && <Loader />}
            <div className="registration-header overflow-hidden">
                <RegistrationHeader />
            </div>
            <div className="registration-progress">
                <RegistrationProgress color="#1F8505" active="#fff" step={2} />
            </div>
            <div className="bank-details-main-section mt-2">
                <div className="row mb-3">
                    <div className="col-12">
                        <h3 className="text-center">Bank Details</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-2 col-md-2"></div>
                    <div className="col-lg-8 col-md-8">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Account Holder Name:<span className='star-inde'>*</span> </label>
                                    <input type="text" placeholder="Enter name" value={formData.accountHolderName} onChange={handleChange} name="accountHolderName" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Account Number:<span className='star-inde'>*</span> </label>
                                    <input type="number" placeholder="Enter acc No." value={formData.accountNo} onChange={handleChange} name="accountNo" className="bank-detail-input-one" />
                                </div>
                            </div>

                            {/* <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Confirm Account Number:<span className='star-inde'>*</span> </label>
                                    <input type="text" placeholder="Enter Accounut No." value={formData.confirm_acc_number} onChange={handleChange} name="confirm_acc_number" className="bank-detail-input-one" />
                                </div>
                            </div> */}

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Confirm Account Number:<span className='star-inde'>*</span> </label>
                                    <div className="position-relative">
                                        <input
                                            type="password"
                                            placeholder="Enter Account No."
                                            value={formData.confirm_acc_number}
                                            onChange={handleChange}
                                            onBlur={handleConfirmAccountBlur}
                                            name="confirm_acc_number"
                                            className="bank-detail-input-one w-100"
                                        />
                                        {accountMatch !== null && (
                                            <div className="position-absolute top-50 end-0 translate-middle-y pe-2">
                                                {accountMatch ? (
                                                    <FaCheckCircle className="text-success" />
                                                ) : (
                                                    <FaTimesCircle className="text-danger" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {accountMatch === false && (
                                        <small className="text-danger">Account numbers don't match</small>
                                    )}
                                    {accountMatch === true && (
                                        <small className="text-success">Account numbers matched</small>
                                    )}
                                </div>
                            </div>


                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">IFSC Code:<span className='star-inde'>*</span> </label>
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            placeholder="Enter IFSC code"
                                            value={formData.ifscCode}
                                            onChange={handleChange}
                                            name="ifscCode"
                                            className="bank-detail-input-one w-100"
                                        />
                                        {ifscLoading && (
                                            <div className="position-absolute top-50 end-0 translate-middle-y pe-2">
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* {formData.ifscVerified && (
                                        <small className="text-success">IFSC verified successfully</small>
                                    )} */}
                                    {formData.ifscCode.length >= 8 && !ifscLoading && (
                                        <>
                                            {formData.ifscVerified ? (
                                                <small className="text-success">IFSC verified successfully</small>
                                            ) : (
                                                <small className="text-danger">IFSC verification failed.</small>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Bank Name: </label>
                                    <input type="text" placeholder="Enter Bank Name" value={formData.bankName} onChange={handleChange} name="bankName" className="bank-detail-input-one" readOnly={!!formData.bankName && formData.ifscVerified} />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Branch Name: </label>
                                    <input type="text" placeholder="Enter Branch Name" value={formData.branchName} onChange={handleChange} name="branchName" className="bank-detail-input-one" readOnly={!!formData.branchName && formData.ifscVerified} />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Branch City Name: </label>
                                    <input type="text" placeholder="Enter Branch City" value={formData.branchCityName} onChange={handleChange} name="branchCityName" className="bank-detail-input-one" readOnly={!!formData.branchCityName && formData.ifscVerified} />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-end justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column custom-select-one">
                                    <label className="mb-1">Account Type:* </label>
                                    <select name="accountType" value={formData.accountType} onChange={handleChange}>
                                        <option value="current">Current</option>
                                        <option value="saving">Saving</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-2"></div>
                </div>

                <div className="row my-4">
                    <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-evenly">
                        <button className="back-btn" onClick={() => navigate("/registration/business-details")}>Back</button>
                        <button className="save-btn"
                            // style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}}
                            // onClick={handleFormSubmit} disabled={loading || isSaved}
                            //last change for track changes start
                            style={isSaved && !hasChanges ? { background: "#7e7e7e", cursor: "not-allowed" } : {}}
                            onClick={handleFormSubmit}
                            disabled={loading || (isSaved && !hasChanges)}
                        >
                            {/* {loading ? "Saving..." : isSaved ? "Saved" : "Save"} */}
                            {/* last change for track changes start */}
                            {loading ? "Saving..." : isSaved && !hasChanges ? "Saved" : "Save"}
                        </button>
                        <button className="next-btn" onClick={handleNext}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankDetails;