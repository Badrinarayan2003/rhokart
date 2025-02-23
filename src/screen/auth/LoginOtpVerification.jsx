import './LoginOtpVerification.css';
import { logo2, logo1 } from '../../assets/assets';

import { FiEdit3 } from "react-icons/fi";

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/reducers/authSlice';

const LoginOtpVerification = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = () => {
        dispatch(loginSuccess("this is token"))
    }


    return (
        <div className="login-section vh-100 w-100 overflow-hidden">
            <div className="row login-container d-flex align-items-center justify-content-between">
                {/* Left Section */}
                <div className="col-lg-6 col-md-6 left-section position-relative" id="first-section">
                    <div className="logo-container">
                        <div className='logo-box'>
                            <img src={logo2} alt="Company Logo" className="img-fluid logo-one" />
                        </div>
                    </div>
                    {/* <div className="slopy-bg ">
                        <div className="slopy-content text-white text-center p-4">
                        </div>
                    </div> */}
                </div>

                {/* Right Section */}
                <div className="col-lg-6 col-md-6 col-12 d-flex flex-column justify-content-center align-items-center form-section" id='form-section-unique'>
                    <div>
                        <img src={logo1} alt="Company Logo" className="img-fluid logo-two" />
                    </div>
                    <div className="mb-3 w-75 d-flex flex-column align-items-center">
                        <h2 className="fw-bold mb-3">OTP Verification</h2>
                        <p className='mb-4 otp-text'>Enter the OTP sent
                            <span className='ms-1 number-span'>+91 1234567890<FiEdit3 size={15} /> </span>
                        </p>
                        <div className='d-flex justify-content-center gap-3'>
                            <input type="text" inputMode="numeric" maxLength="1" className="otp-input" />
                            <input type="text" inputMode="numeric" maxLength="1" className="otp-input" />
                            <input type="text" inputMode="numeric" maxLength="1" className="otp-input" />
                            <input type="text" inputMode="numeric" maxLength="1" className="otp-input" />
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