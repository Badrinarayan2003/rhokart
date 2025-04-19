import { logo2, } from '../../assets/assets';
import './registrationHeader.css';
import { LuLogOut } from "react-icons/lu";


import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/reducers/authSlice';
import { resetRegistration } from '../../redux/reducers/registrationSlice';

const RegistrationHeader = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
        dispatch(resetRegistration());
    }


    return (
        <div className="registration-header-section overflow-hidden h-100">
            <div className="row h-100">
                <div className="col-lg-7 col-7 d-flex justify-content-between align-items-center h-100">
                    <div className="registration-header-logo h-100 ms-2">
                        <img src={logo2} alt='brand-logo' className="h-100" />
                    </div>
                    <div className="registration-header-text">
                        <h3 className='me-2'>Seller onboarding</h3>
                    </div>
                </div>
                <div className="col-5 h-100 registration-header-col-section-two d-flex justify-content-end align-items-center pe-4">
                    <span className='d-flex flex-column align-items-center' onClick={handleLogout}>
                        <LuLogOut color='#fff' size={22} />
                        <span className='log-btn'>Logout</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default RegistrationHeader;