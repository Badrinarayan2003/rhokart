import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";
import './registrationReview.css';

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { submitRegistration } from "../../../redux/reducers/registrationSlice";

import { FaLocationDot } from "react-icons/fa6";
import { toast } from "react-toastify";

const RegistrationReview = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { businessDetails, bankDetails, addressDetails, brandsDetails, documentUpload, } = useSelector((state) => state.registration);
    console.log(businessDetails, "business details from store! in review");
    console.log(bankDetails, "bank details from store! in review");
    console.log(addressDetails, "address details from store! in review");
    console.log(documentUpload, "document details from store! in review success...");
    console.log(brandsDetails, "brand details from store! in review");


    const [checkboxes, setCheckboxes] = useState({
        acceptPrivacyPolicy: false,
        receiveInfo: false,
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckboxes((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };


    const handleSubmit = () => {
        if (!checkboxes.acceptPrivacyPolicy) {
            toast.error("You must accept the Privacy Policy to continue.");
            return;
        }

        // If the required checkbox is checked, navigate to the success page
        dispatch(submitRegistration());
        navigate("/registration-success");
    };

    return (
        <div className="reg-review-details-section overflow-y-auto overflow-x-hidden vh-100">
            <div className="registration-header overflow-hidden">
                <RegistrationHeader />
            </div>
            <div className="registration-progress">
                <RegistrationProgress color="#1F8505" active="#fff" step={6} />
            </div>
            <div className="row">
                <div className="col-12">
                    <h4 className="text-center fw-bold mt-2">Review details</h4>
                </div>
            </div>
            <div className="reg-review-details-main-section mt-2 px-5">

                <div className="review-business-detail-sub-section">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="text-center mt-2 mb-4">Business details</h3>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-lg-4 col-md-4 col-12">
                            <div className="row">
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                GSTIN:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{businessDetails?.gstin}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Trade Name:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{businessDetails?.tradeName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                State:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{businessDetails?.state}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                PAN:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{businessDetails?.pan}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Phone No:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{businessDetails?.phoneNo}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Email:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{businessDetails?.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4 col-12">
                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0 ">
                                            Entity Name:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.entityName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0 ">
                                            Country:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.country}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0 ">
                                            City:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.city}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0 ">
                                            Alternate Phone No:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.alternatePhoneNo || "XXXXXXXXXX"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0 ">
                                            Alternate Email:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.alternateEmail || "XXXXXXXXXXXX"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4  col-12">
                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0 ">
                                            Contact Name:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.contactName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0 ">
                                            Pincode:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.pincode}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0">
                                            TAN:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.tan}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 review-business-detail-title-container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <p className="review-business-detail-title-box mb-0">
                                            Address:
                                        </p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                        <span className="review-business-detail-title-value">{businessDetails?.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="review-bank-account-detail-sub-section mb-4">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="text-center my-4">Bank Account details</h3>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="row">
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Account Holder Name:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{bankDetails?.accountHolderName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Bank Name:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{bankDetails?.bankName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Branch Name:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{bankDetails?.branchName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Branch City Name:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{bankDetails?.branchCityName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="row">
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Account Number:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{bankDetails?.accountNo}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                IFSC Code:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{bankDetails?.ifscCode}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 review-business-detail-title-container">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <p className="review-business-detail-title-box mb-0 ">
                                                Account Type:
                                            </p>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <span className="review-business-detail-title-value">{bankDetails?.accountType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="review-business-document-detail-sub-section">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="text-center my-4">Business documents</h3>
                        </div>
                    </div>

                    <div className="row mb-4">

                        {
                            documentUpload.map((item, index) => {
                                const fileuri = item?.fileUrl?.split("/").pop().split("_");
                                const mainFileName = fileuri?.length > 1 ? fileuri.pop() : fileuri

                                return (
                                    <div className="col-12 mb-2" key={index}>
                                        <div className="row">
                                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 d-flex align-items-center">
                                                <p className="mb-2 fw-bold">{item?.fileName}</p>
                                            </div>
                                            <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12">
                                                <div className="review-business-doc-value">
                                                    <a href={item?.fileUrl} className="mb-0 ">{mainFileName}</a>
                                                </div>
                                            </div>
                                            <div className="col-xxl-4 col-xl-4 col-lg-3 col-md-3 col-sm-0 col-0"></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>


                <div className="review-address-details-sub-section position-relative">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="text-center my-4">Address details</h3>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12">
                            <h4 className="text-start my-3">Business address:</h4>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Address:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{businessDetails?.address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Pincode:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{businessDetails?.pincode}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 ">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">City:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{businessDetails?.city}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">State:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{businessDetails?.state}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Country:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{businessDetails?.country}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-12">
                            <h4 className="text-start my-3">Billing address:</h4>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Address Line1:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.billingAddress?.addressLine1}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Address Line2:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.billingAddress?.addressLine2}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Nearest landmark:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.billingAddress?.landmark}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Country:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.billingAddress?.country}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">State:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.billingAddress?.state}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">District:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.billingAddress?.district}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">City:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.billingAddress?.city}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Pincode:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.billingAddress?.pincode}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                    </div>


                    <div className="row mb-2">
                        <div className="col-12">
                            <h4 className="text-start my-3">Pick-up address-1:</h4>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Address Line1:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.pickupAddress?.addressLine1}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Address Line2:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.pickupAddress?.addressLine2}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Nearest landmark:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.pickupAddress?.landmark}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Country:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.pickupAddress?.country}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">State:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.pickupAddress?.state}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">District:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.pickupAddress?.district}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">City:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.pickupAddress?.city}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Pincode:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">{addressDetails?.pickupAddress?.pincode}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="review-location-container">
                        <p className="mb-1"><FaLocationDot size={40} color='#1F8505' /></p>
                    </div> */}

                </div>



                <div className="review-brand-details-sub-section position-relative">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="text-center my-4">Brand details</h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <h5 className="text-start my-4">The brands that you chose to sell here:</h5>
                        </div>
                        <div className="col-12 overflow-x-auto">
                            <div className="row mb-3">
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                    <p className="mb-0 fw-bold review-brand-detail-title-value">Brand</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                    <p className="mb-0 fw-bold review-brand-detail-title-value">Type of association with the brand</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                    <p className="mb-0 fw-bold review-brand-detail-title-value">Uploaded documents</p>
                                </div>
                            </div>

                            {
                                brandsDetails.map((item, index) => {
                                    const docFileuri = item?.certificationUrl?.split("/").pop().split("_");
                                    const finalDocFileName = docFileuri.length > 1 ? docFileuri.pop() : docFileuri;

                                    return (
                                        <div className="row mb-3" key={index}>
                                            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                                <p className="mb-0 review-brand-detail-title-value">{item?.brandName}</p>
                                            </div>
                                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                                <p className="mb-0 review-brand-detail-title-value">{item?.associationType}</p>
                                            </div>
                                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                                <a href="#" className="mb-0 review-brand-detail-title-value">{finalDocFileName}</a>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <div className="form-group checkbox-group review-check-box">
                            <label>
                                <input
                                    type="checkbox"
                                    name="acceptPrivacyPolicy"
                                    checked={checkboxes.acceptPrivacyPolicy}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                {" "}I accept the{" "}
                                <a href="https://www.rhokart.com/privacy-policy" target="_blank" rel="noopener noreferrer">
                                    Privacy Policy for Rhokart
                                </a>.
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="receiveInfo"
                                    checked={checkboxes.receiveInfo}
                                    onChange={handleCheckboxChange}
                                />
                                {" "}I want to receive personalized information from Rhokart.
                            </label>
                        </div>
                    </div>
                </div>


                <div className="row my-5">
                    <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-evenly">
                        <button className="back-btn" onClick={() => navigate("/registration/brand-details")}>Back</button>
                        <button className="save-btn" style={!checkboxes.acceptPrivacyPolicy ? { background: "#5d5d5d", cursor: 'not-allowed' } : {}} disabled={!checkboxes.acceptPrivacyPolicy} onClick={handleSubmit}>Submit</button>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default RegistrationReview;