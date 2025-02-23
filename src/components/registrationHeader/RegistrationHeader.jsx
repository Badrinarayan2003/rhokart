import { logo2, } from '../../assets/assets';
import './registrationHeader.css';

const RegistrationHeader = () => {
    return (
        <div className="registration-header-section overflow-hidden h-100">
            <div className="row h-100">
                <div className="col-lg-7 col-md-12 col-12 d-flex justify-content-between align-items-center h-100">
                    <div className="registration-header-logo h-100 ms-2">
                        <img src={logo2} alt='brand-logo' className="h-100" />
                    </div>
                    <div className="registration-header-text">
                        <h3 className='me-2'>Seller onboarding</h3>
                    </div>
                </div>
                <div className="col-lg-5 h-100 registration-header-col-section-two">

                </div>
            </div>
        </div>
    )
}

export default RegistrationHeader;