import './login.css';
import { google_icon, logo2, logo1 } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

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
                    <div className="mb-3 w-75 d-flex flex-column align-items-start">
                        <h4 className="form-label mb-4">Email id</h4>
                        <input type="email" className="form-control py-2 mb-3" id="phone" placeholder="Enter your Email" />
                    </div>
                    <button className="btn w-75" id='p-btn' onClick={() => navigate("/loginotpverification")}>Proceed</button>
                    <p className='mt-4'>------------- <span className='or'>Or</span> -------------</p>
                    <div className="mt-3 google-login d-flex align-items-center justify-content-center w-75">
                        <img src={google_icon} alt="google icon" className="google-icon" />
                        <p className='mb-0'>Continue with Google</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;