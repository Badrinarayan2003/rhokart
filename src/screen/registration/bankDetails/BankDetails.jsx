import React, { useState } from "react";
import "./bankDetails.css";
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";
import Loader from "../../../components/loader/Loader";

import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { submitBankDetails } from "../../../api/bankDetailService";


const BankDetails = () => {

    const location = useLocation();
    // console.log(location?.state?.email);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const businessDetails = useSelector((state) => state.registration.businessDetails);
    // console.log(businessDetails, "getting from redux store"); // This will log the stored business details

    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false); // Track if data is saved

    const [formData, setFormData] = useState({
        accountHolderName: "",
        accountNo: "",
        confirm_acc_number: "",
        ifscCode: "",
        bankName: "",
        branchName: "",
        branchCityName: "",
        accountType: "current",
        "ifscVerified": false
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    // Validate form before submission
    const validateForm = () => {
        const requiredFields = [
            "accountHolderName",
            "accountNo",
            "confirm_acc_number",
            "ifscCode",
            "bankName",
            "branchName",
            "branchCityName",
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

        return true;
    };


    // Handle form submission
    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const responesData = await submitBankDetails(formData, location?.state?.email);
            if (responesData?.response?.rcode === 0 && responesData?.response?.coreData?.responseData) {
                const responseSellerBankData = responesData?.response?.coreData?.responseData;

                toast.success(responesData?.response?.rmessage || "Bank details saved successfully");
                setIsSaved(true); // Mark data as saved
                console.log(responesData, "bank respones");
            } else {
                toast.error(responesData?.response?.rmessage || "Oops something went wrong");
            }
        } catch (error) {
            console.log("bank details catch error")
            if (error.code === "ERR_NETWORK") {
                toast.error(error.message || "Check your internet connection");
            } else {
                toast.error(error?.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Next button click
    const handleNext = () => {
        if (!isSaved) {
            toast.error("Please save the bank details before proceeding.");
            return;
        }
        navigate("/registration/document-uploud"); // Change this to the actual next step route
    };





    return (
        <div className="bank-details-section overflow-x-hidden overflow-y-auto vh-100 position-relative">
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
                                    <label className="mb-1">Account Holder Name:* </label>
                                    <input type="text" placeholder="Enter name" value={formData.accountHolderName} onChange={handleChange} name="accountHolderName" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Account Number:* </label>
                                    <input type="text" placeholder="Enter acc No." value={formData.accountNo} onChange={handleChange} name="accountNo" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Confirm Account Number:* </label>
                                    <input type="text" placeholder="Enter Accounut No." value={formData.confirm_acc_number} onChange={handleChange} name="confirm_acc_number" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">IFSC Code:* </label>
                                    <input type="text" placeholder="Enter IFSC code" value={formData.ifscCode} onChange={handleChange} name="ifscCode" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Bank Name: </label>
                                    <input type="text" placeholder="Enter Bank Name" value={formData.bankName} onChange={handleChange} name="bankName" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Branch Name: </label>
                                    <input type="text" placeholder="Enter Branch Name" value={formData.branchName} onChange={handleChange} name="branchName" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Branch City Name: </label>
                                    <input type="text" placeholder="Enter Branch City" value={formData.branchCityName} onChange={handleChange} name="branchCityName" className="bank-detail-input-one" />
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
                        <button className="back-btn">Back</button>
                        <button className="save-btn" style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}} onClick={handleFormSubmit} disabled={loading || isSaved}>
                            {loading ? "Saving..." : isSaved ? "Saved" : "Save"}
                        </button>
                        <button className="next-btn" onClick={handleNext}>Next</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BankDetails;