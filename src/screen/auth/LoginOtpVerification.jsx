import React, { useRef, useState } from 'react';
import { FiEdit3 } from "react-icons/fi";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/reducers/authSlice';

import './LoginOtpVerification.css';
import { logo2, logo1 } from '../../assets/assets';
import Loader from '../../components/loader/Loader';
import { BASE_URL } from '../../api/config';

const LoginOtpVerification = () => {
    const location = useLocation();
    const { email } = location.state || {}; // Extract data safely

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const otpInputs = useRef([]);
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (index, e) => {
        const value = e.target.value;
        if (/^\d?$/.test(value)) { // Allow only numeric input
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < otpInputs.current.length - 1) {
                otpInputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const handleSubmit = async () => {
        const otpValue = otp.join("");

        if (otpValue.length === 5) {
            console.log(otpValue, "this is entered otp");

            try {
                console.log(otpValue, "this is entered otp inside try block");
                const response = await axios.get(
                    `${BASE_URL}/test/registration/validateotp?email=${email}&otpValue=${otpValue}`
                );
                console.log(response);
                if (response?.data?.response?.rcode === 0) {
                    setLoading(false);
                    const responseData = response?.data?.response?.coreData?.responseData;
                    dispatch(loginSuccess(responseData)); // Save to Redux
                    setResponseData(response);
                    toast.success("logged in successfully");
                    // Redirect based on access level
                    if (responseData.accessLevel === "REGISTRATION") {
                        navigate("/registration/business-details");
                    } else if (responseData.accessLevel === "DASHBOARD") {
                        navigate("/home");
                    } else if (responseData.accessLevel === "APPROVAL") {
                        navigate("/review-status");
                    }
                } else {
                    setLoading(false);
                    toast.error(response?.data?.response?.rmessage || "OTP Expired!");
                    console.log(response?.data?.response?.rmessage, "this is else block of try block in otp verification page");
                }
            } catch (err) {
                setLoading(false);
                toast.error("Invalid OTP. Please try again.");
            }

        } else {
            setLoading(false);
            toast.warning("Please enter a 5-digit OTP");
        }
    };

    return (
        <div className="login-section vh-100 w-100 overflow-hidden position-relative">

            {/* Loader - Now it overlays instead of replacing content */}
            {loading && <Loader />}

            <div className="row login-container d-flex align-items-center justify-content-between">
                {/* Left Section */}
                <div className="col-lg-6 col-md-6 left-section position-relative" id="first-section">
                    <div className="logo-container">
                        <div className='logo-box'>
                            <img src={logo2} alt="Company Logo" className="img-fluid logo-one" />
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-lg-6 col-md-6 col-12 d-flex flex-column justify-content-center align-items-center form-section" id='form-section-unique'>
                    <div>
                        <img src={logo1} alt="Company Logo" className="img-fluid logo-two" />
                    </div>
                    <div className="mb-3 w-75 d-flex flex-column align-items-center">
                        <h2 className="fw-bold mb-3">OTP Verification</h2>
                        <p className='mb-4 otp-text'>Enter the OTP sent
                            <span className='ms-1 number-span'>{email && `${email}`}<FiEdit3 size={15} /> </span>
                        </p>
                        <div className='d-flex justify-content-center gap-3'>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    className="otp-input"
                                    value={digit}
                                    ref={(el) => otpInputs.current[index] = el}
                                    onChange={(e) => handleInputChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='resend-timer-box w-75 mb-3'>
                        <p className='resend-timer text-start'><span className='resend-timer-span'>Resend</span> 60 sec</p>
                    </div>
                    <div className='d-flex justify-content-center w-75 gap-3'>
                        <button className="btn w-50" id='back-btn' onClick={() => navigate("/login")}>Back</button>
                        <button className="btn w-50" id='submit-btn' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginOtpVerification;
