import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";
import './registrationReview.css';


import { FaLocationDot } from "react-icons/fa6";

const RegistrationReview = () => {


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
                                            <span className="review-business-detail-title-value">07ABCDE1234Q12M</span>
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
                                            <span className="review-business-detail-title-value">Optional</span>
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
                                            <span className="review-business-detail-title-value">Uttar Pradesh</span>
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
                                            <span className="review-business-detail-title-value">ABCDE1234Q</span>
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
                                            <span className="review-business-detail-title-value">9876543210</span>
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
                                            <span className="review-business-detail-title-value">example@gmail.com</span>
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
                                        <span className="review-business-detail-title-value">Sankalp Traders Private Limited</span>
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
                                        <span className="review-business-detail-title-value">India</span>
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
                                        <span className="review-business-detail-title-value">Durgapur</span>
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
                                        <span className="review-business-detail-title-value">+914 8976543210</span>
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
                                        <span className="review-business-detail-title-value">example2@gmail.com</span>
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
                                        <span className="review-business-detail-title-value">Amith Samanta</span>
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
                                        <span className="review-business-detail-title-value">711803</span>
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
                                        <span className="review-business-detail-title-value">DELL092S2A</span>
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
                                            <span className="review-business-detail-title-value">ABC Traders Limited</span>
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
                                            <span className="review-business-detail-title-value">ABC Traders Limited</span>
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
                                            <span className="review-business-detail-title-value">ABC Traders Limited</span>
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
                                            <span className="review-business-detail-title-value">ABC Traders Limited</span>
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
                                            <span className="review-business-detail-title-value">32612781919911</span>
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
                                            <span className="review-business-detail-title-value">ABC Traders Limited</span>
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
                                            <span className="review-business-detail-title-value">Current</span>
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
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <p className="mb-2 fw-bold">PAN Card of Owner:</p>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12">
                                    <div className="review-business-doc-value">
                                        <p className="mb-0 ">Upload (pdf, jpeg, png, jpg)</p>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-3 col-md-3 col-sm-0 col-0"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <p className="mb-2 fw-bold">GSTIN Certificate:</p>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12">
                                    <div className="review-business-doc-value">
                                        <p className="mb-0 ">asdfcgvhG.pdf</p>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-3 col-md-3 col-sm-0 col-0"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <p className="mb-2 fw-bold">Cancelled cheque:</p>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12">
                                    <div className="review-business-doc-value">
                                        <p className="mb-0 ">tfhjkggjkklmnkn.pdf</p>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-3 col-md-3 col-sm-0 col-0"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <p className="mb-2 fw-bold">Certificate of Incrporation (MCA):</p>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12">
                                    <div className="review-business-doc-value">
                                        <p className="mb-0 ">abcfdfghgjkj.png</p>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-3 col-md-3 col-sm-0 col-0"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <p className="mb-2 fw-bold">Business Address Proof:</p>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12">
                                    <div className="review-business-doc-value">
                                        <p className="mb-0 ">ghhthoppjhgfgfgjkljhgfd.jpg</p>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-3 col-md-3 col-sm-0 col-0"></div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <p className="mb-2 fw-bold">Signature:</p>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12">
                                    <div className="review-business-doc-value">
                                        <p className="mb-0">hhhhhhhhhghgyuhkjhjhfhg.png.jpg</p>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-3 col-md-3 col-sm-0 col-0"></div>
                            </div>
                        </div>
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
                                            <p className="mb-0 ">Venkatanarasimharajuvaripeta assssssssssssskkkkkkkkkddd</p>
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
                                            <p className="mb-0 ">123456</p>
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
                                            <p className="mb-0 ">Bhubaneswar</p>
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
                                            <p className="mb-0 ">Odisha</p>
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
                                            <p className="mb-0 ">India</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-12">
                            <h4 className="text-start my-3">BIlling address:</h4>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 fw-bold">Address:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">Venkatanarasimharajuvaripeta assssssssssssskkkkkkkkkddd</p>
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
                                            <p className="mb-0 ">Venkatanarasimharajuvaripeta</p>
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
                                            <p className="mb-0 ">India</p>
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
                                            <p className="mb-0 ">Odisha</p>
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
                                            <p className="mb-0 ">Venkatanarasimharajuvaripeta</p>
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
                                            <p className="mb-0 ">Bhubaneswar</p>
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
                                            <p className="mb-0 ">123456</p>
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
                                            <p className="mb-0 fw-bold">Address:</p>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 d-flex align-items-center">
                                            <p className="mb-0 ">Venkatanarasimharajuvaripeta assssssssssssskkkkkkkkkddd</p>
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
                                            <p className="mb-0 ">Venkatanarasimharajuvaripeta</p>
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
                                            <p className="mb-0 ">India</p>
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
                                            <p className="mb-0 ">Odisha</p>
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
                                            <p className="mb-0 ">Venkatanarasimharajuvaripeta</p>
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
                                            <p className="mb-0 ">Bhubaneswar</p>
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
                                            <p className="mb-0 ">123456</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"></div>
                            </div>
                        </div>
                    </div>

                    <div className="review-location-container">
                        <p className="mb-1"><FaLocationDot size={40} color='#1F8505' /></p>
                    </div>

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

                            <div className="row mb-3">
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                    <p className="mb-0 review-brand-detail-title-value">Havells</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                    <p className="mb-0 review-brand-detail-title-value">Trader / Wholesaler (no document required)</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                    <a href="#" className="mb-0 review-brand-detail-title-value">havell.pdf</a>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                    <p className="mb-0 review-brand-detail-title-value">Phillips</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                    <p className="mb-0 review-brand-detail-title-value">Authorized Dealer / Distributor (attach brand certificate)</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                    <a href="#" className="mb-0 review-brand-detail-title-value">phillp.jpeg</a>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                    <p className="mb-0 review-brand-detail-title-value">Haier</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                    <p className="mb-0 review-brand-detail-title-value">Trader</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                    <a href="#" className="mb-0 review-brand-detail-title-value">haier.png</a>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                    <p className="mb-0 review-brand-detail-title-value">Abcde</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                    <p className="mb-0 review-brand-detail-title-value">Brand owner (attach brand ownership / trademark certificate)</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                    <a href="#" className="mb-0 review-brand-detail-title-value">Abcde.jpg</a>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2">
                                    <p className="mb-0 review-brand-detail-title-value">XYZUV</p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6">
                                    <p className="mb-0 review-brand-detail-title-value">Wholesaler </p>
                                </div>
                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-4">
                                    <a href="#" className="mb-0 review-brand-detail-title-value">xyz.pdf</a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="row my-5">
                    <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-evenly">
                        <button className="back-btn">Back</button>
                        <button className="save-btn">Submit</button>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default RegistrationReview;