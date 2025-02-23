import './businessDetails.css';
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from '../../../components/registrationProgress/RegistrationProgress';

import { MdVerified } from "react-icons/md";
import BusinessDetailCountryCode from '../../../components/businessDetailCountryCode/BusinessDetailCountryCode';

const BusinessDetails = () => {



    return (
        <div className="business-details-section overflow-x-hidden overflow-y-auto vh-100">
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
                            <input type="text" placeholder="Enter GSTIN" value="" name="gstin" className="business-detail-input-one" />
                            <span className="verified-symbol">
                                <MdVerified color='green' size={18} />
                            </span>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">Entity Name: </label>
                            <input type="text" placeholder="Enter Entity" value="" name="entity_name" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">Contact Name:* </label>
                            <input type="text" placeholder="Enter your contact" value="" name="contact_name" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">Trade Name: </label>
                            <input type="text" placeholder="Enter trade name" value="" name="trade_name" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">Country: </label>
                            <input type="text" placeholder="Enter country" value="" name="country" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">Pincode: </label>
                            <input type="text" placeholder="Enter pincode" value="" name="pincode" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">State: </label>
                            <input type="text" placeholder="Enter state" value="" name="state" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">City: </label>
                            <input type="text" placeholder="Enter city" value="" name="city" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">TAN: </label>
                            <input type="text" placeholder="Enter TAN" value="" name="tan" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">PAN: </label>
                            <input type="text" placeholder="Enter PAN" value="" name="pan" className="business-detail-input-one" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center mb-3">
                        <div className="business-detail-input-box d-flex flex-column">
                            <label className="mb-1">Address: </label>
                            <input type="text" placeholder="Enter your Address" value="" name="business_address" className="business-detail-input-one" />
                        </div>
                    </div>
                    
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
                                        <input type="text" placeholder="Enter phone" value="" name="phone" className="business-detail-input-one business-detail-phone-input" />
                                    </div>
                                    <span className="verified-symbol">
                                        <MdVerified color='green' size={18} />
                                    </span>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 business-detail-main-otp-box d-flex align-items-end mb-3">
                                <div className="business-detail-otp-box d-flex justify-content-center">
                                    <button className="otp-send-btn">Send OTP</button>
                                    <input type="number" placeholder="Enter OTP" value="" name="phone_otp" className="mx-2 business-detail-otp-input" />
                                    <button className="otp-verify-btn">Verify</button>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-4 d-flex align-items-center justify-content-center mb-3">
                                <div className="business-detail-input-box position-relative d-flex flex-column">
                                    <label className="mb-1">Email id: </label>
                                    <input type="text" placeholder="Enter phone" value="" name="email" className="business-detail-input-one" />
                                    <span className="verified-symbol">
                                        <MdVerified color='green' size={18} />
                                    </span>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 business-detail-main-otp-box d-flex align-items-end mb-3">
                                <div className="business-detail-otp-box d-flex justify-content-center">
                                    <button className="otp-send-btn">Send OTP</button>
                                    <input type="number" placeholder="Enter OTP" value="" name="email_otp" className="mx-2 business-detail-otp-input" />
                                    <button className="otp-verify-btn">Verify</button>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-4 d-flex align-items-center justify-content-center mb-3">
                                <div className="business-detail-input-box position-relative d-flex flex-column">
                                    <label className="mb-1">Alt Phone no.: </label>
                                    <div className="d-flex w-100" style={{ gap: "5%" }}>
                                        <div className="business-detail-select-option">
                                            <BusinessDetailCountryCode />
                                        </div>
                                        <input type="text" placeholder="Enter phone" value="" name="alt_phone" className="business-detail-input-one business-detail-phone-input" />
                                    </div>
                                    <span className="verified-symbol">
                                        <MdVerified color='green' size={18} />
                                    </span>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 business-detail-main-otp-box d-flex align-items-end mb-3">
                                <div className="business-detail-otp-box d-flex justify-content-center">
                                    <button className="otp-send-btn ">Send OTP</button>
                                    <input type="number" placeholder="Enter OTP" value="" name="alt_phone_otp" className="mx-2 business-detail-otp-input" />
                                    <button className="otp-verify-btn">Verify</button>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-4 d-flex align-items-center justify-content-center mb-3">
                                <div className="business-detail-input-box position-relative d-flex flex-column">
                                    <label className="mb-1">Alt Email id: </label>
                                    <input type="text" placeholder="Enter phone" value="" name="alt_email" className="business-detail-input-one" />
                                    <span className="verified-symbol">
                                        <MdVerified color='green' size={18} />
                                    </span>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 business-detail-main-otp-box d-flex align-items-end mb-3">
                                <div className="business-detail-otp-box d-flex justify-content-center">
                                    <button className="otp-send-btn">Send OTP</button>
                                    <input type="number" placeholder="Enter OTP" value="" name="alt_email_otp" className="mx-2 business-detail-otp-input" />
                                    <button className="otp-verify-btn">Verify</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-lg-4"></div>
                </div>

                <div className="row my-4">
                    <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-center gap-5">
                        <button className="save-btn">Save</button>
                        <button className="next-btn">Next</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BusinessDetails;