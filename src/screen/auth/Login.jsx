import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { toast } from 'react-toastify';

import './login.css';
import { google_icon, logo2, logo1 } from '../../assets/assets';
import Loader from '../../components/loader/Loader';
import { BASE_URL } from '../../api/config';

const Login = () => {
console.log(BASE_URL,"this is base");
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const requestOTP = async () => {
        setLoading(true);
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setLoading(false);
            toast.warning("Please enter a valid email.");
            return;
        }

        try {
            const response = await axios.get(
                `${BASE_URL}/test/registration/emailotp?email=${email}`
            );
            console.log(response, "this is respones");
            console.log(response?.data?.response?.rcode, "this is rcode");
            if (response?.data?.response?.rcode === 0) {
                setLoading(false);
                toast.success(`OTP sent to your email! ${email}`);
                navigate("/loginotpverification", { state: { email: email } });
            } else {
                setLoading(false);
                toast.error(response?.data?.response?.rmessage || "Failed to send OTP");
                console.log(response?.data?.response?.rmessage, "this is else block of try block");
            }
        } catch (err) {
            console.log(err, "this is error");
            console.log(err?.code, "this is error code");

            if (err?.code === "ERR_NETWORK") {
                setLoading(false);
                toast.error("Please Check Your Internet Connection!")
            } else {
                setLoading(false);
                toast.error("Failed to send OTP. Try again later")
                console.log(err, "Failed to send OTP. Try again.");
            }
        }
    };



    return (
        <>
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
                        <div className="mb-3 w-75 d-flex flex-column align-items-start">
                            <h4 className="form-label mb-4">Email id</h4>
                            <input type="email" className="form-control py-2 mb-3" id="phone" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button className="btn w-75" id='p-btn' onClick={requestOTP}>Proceed</button>
                        <p className='mt-4'>------------- <span className='or'>Or</span> -------------</p>
                        <div className="mt-3 google-login d-flex align-items-center justify-content-center w-75">
                            <img src={google_icon} alt="google icon" className="google-icon" />
                            <p className='mb-0'>Continue with Google</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;