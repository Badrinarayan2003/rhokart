import React, { useState } from "react";
import "./bankDetails.css";
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";


const BankDetails = () => {

    const [bankType, setBankType] = useState("current");


    return (
        <div className="bank-details-section overflow-x-hidden overflow-y-auto vh-100">
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
                                    <input type="text" placeholder="Enter name" value="" name="acc_holder_name" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Account Number:* </label>
                                    <input type="text" placeholder="Enter acc No." value="" name="acc_number" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Confirm Account Number:* </label>
                                    <input type="text" placeholder="Enter Accounut No." value="" name="confirm_acc_number" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">IFSC Code:* </label>
                                    <input type="text" placeholder="Enter IFSC code" value="" name="ifsc_code" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Bank Name: </label>
                                    <input type="text" placeholder="Enter Bank Name" value="" name="bank_name" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Branch Name: </label>
                                    <input type="text" placeholder="Enter Branch Name" value="" name="branch_name" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column">
                                    <label className="mb-1">Branch City Name: </label>
                                    <input type="text" placeholder="Enter Branch City" value="" name="branch_city" className="bank-detail-input-one" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 d-flex align-items-end justify-content-center mb-3">
                                <div className="bank-detail-input-box d-flex flex-column custom-select-one">
                                    <label className="mb-1">Account Type:* </label>
                                    <select value={bankType} onChange={(e) => setBankType(e.target.value)}>
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
                        <button className="save-btn">Save</button>
                        <button className="next-btn">Next</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BankDetails;