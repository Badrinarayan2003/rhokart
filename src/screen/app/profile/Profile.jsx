import '../../registration/registrationReview/registrationReview.css';
import "./profile.css"

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";


import { toast } from "react-toastify";

const Profile = () => {
    const navigate = useNavigate();

    const email = useSelector((state) => state.auth?.sellerEmail)

    const [loading, setLoading] = useState(true);
    const [apiData, setApiData] = useState(null);


    useEffect(() => {
        const fetchRegistrationDetails = async () => {
            try {
                const response = await axios.get(
                    `https://sellerapi.rhoselect.com/onboarding/registrationdetail?email=${email}`
                );
                setApiData(response.data.response.coreData.responseData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching registration details:", error);
                toast.error("Failed to fetch registration details");
                setLoading(false);
            }
        };

        fetchRegistrationDetails();
    }, []);

    if (loading) {
        return <div className="text-center text-dark mt-5">Loading...</div>;
    }

    if (!apiData) {
        return <div className="text-center text-dark mt-5">No registration data found</div>;
    }

    // Destructure the API data for easier access
    const {
        businessDetail: businessDetails,
        bankDetail: bankDetails,
        sellerAddress: addressDetails,
        brands: brandsDetails,
        documents: documentUpload
    } = apiData;

    console.log(apiData)

    return (
        // <div className="reg-review-details-section overflow-y-auto overflow-x-hidden vh-100">
        <>
            <div className="row">
                <div className="col-12">
                    <h4 className="text-center fw-bold mt-2 text-dark">Seller Profile</h4>
                </div>
            </div>
            <div className="reg-review-details-main-section pt-0">

                <div className="review-business-detail-sub-section">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="text-center mt-2 mb-4 text-dark">Business details</h3>
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
                            <h3 className="text-center my-4 text-dark">Bank Account details</h3>
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
                            <h3 className="text-center my-4 text-dark">Business documents</h3>
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
                                                <p className="mb-2 fw-bold text-dark">{item?.fileName}</p>
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
                            <h3 className="text-center my-4 text-dark">Address details</h3>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12">
                            <h4 className="text-start my-3 text-dark">Business address:</h4>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold text-dark">Address:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{businessDetails?.address}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Pincode:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{businessDetails?.pincode}</p>
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
                                            <p className="mb-0 fw-bold text-dark">City:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{businessDetails?.city}</p>
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
                                            <p className="mb-0 fw-bold text-dark">State:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{businessDetails?.state}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Country:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{businessDetails?.country}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-12">
                            <h4 className="text-start my-3 text-dark">Billing address:</h4>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold text-dark">Address Line1:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.billingAddress?.addressLine1}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Address Line2:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.billingAddress?.addressLine2}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Nearest landmark:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.billingAddress?.landmark}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Country:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.billingAddress?.country}</p>
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
                                            <p className="mb-0 fw-bold text-dark">State:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.billingAddress?.state}</p>
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
                                            <p className="mb-0 fw-bold text-dark">District:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.billingAddress?.district}</p>
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
                                            <p className="mb-0 fw-bold text-dark">City:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.billingAddress?.city}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Pincode:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.billingAddress?.pincode}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                    </div>


                    <div className="row mb-2">
                        <div className="col-12">
                            <h4 className="text-start my-3 text-dark">Pick-up address-1:</h4>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold text-dark">Address Line1:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.pickupAddress?.addressLine1}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Address Line2:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.pickupAddress?.addressLine2}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Nearest landmark:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.pickupAddress?.landmark}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Country:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.pickupAddress?.country}</p>
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
                                            <p className="mb-0 fw-bold text-dark">State:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.pickupAddress?.state}</p>
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
                                            <p className="mb-0 fw-bold text-dark">District:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.pickupAddress?.district}</p>
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
                                            <p className="mb-0 fw-bold text-dark">City:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.pickupAddress?.city}</p>
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
                                            <p className="mb-0 fw-bold text-dark">Pincode:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 greene">{addressDetails?.pickupAddress?.pincode}</p>
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
                            <h3 className="text-center my-4 text-dark">Brand details</h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <h5 className="text-start my-4 text-dark">The brands that you chose to sell here:</h5>
                        </div>
                        <div className="col-12 overflow-x-auto">
                            <div className="row mb-3">
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                    <p className="mb-0 fw-bold review-brand-detail-title-value text-dark">Brand</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                    <p className="mb-0 fw-bold review-brand-detail-title-value text-dark">Type of association with the brand</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                    <p className="mb-0 fw-bold review-brand-detail-title-value text-dark">Uploaded documents</p>
                                </div>
                            </div>

                            {
                                brandsDetails.map((item, index) => {
                                    const docFileuri = item?.certificationUrl?.split("/").pop().split("_");
                                    const finalDocFileName = docFileuri.length > 1 ? docFileuri.pop() : docFileuri;

                                    return (
                                        <div className="row mb-3" key={index}>
                                            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                                <p className="mb-0 review-brand-detail-title-value greene">{item?.brandName}</p>
                                            </div>
                                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                                <p className="mb-0 review-brand-detail-title-value greene">{item?.associationType}</p>
                                            </div>
                                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                                <a href={item?.certificationUrl} className="mb-0 review-brand-detail-title-value text-primary">{finalDocFileName}</a>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>

            </div>
        </>
        // </div>
    )
}

export default Profile;