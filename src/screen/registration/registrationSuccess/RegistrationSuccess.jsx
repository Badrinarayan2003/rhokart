import './registrationSuccess.css';
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";

import { useNavigate } from "react-router-dom";

const RegistrationSuccess = () => {

    const navigate = useNavigate();



    return (
        <div className="registration-success-section overflow-y-auto overflow-x-hidden vh-100">
            <div className="registration-header overflow-hidden">
                <RegistrationHeader />
            </div>
            <div className="registration-progress">
                <RegistrationProgress color="#1F8505" active="#fff" step={6} />
            </div>
            <div className="reg-success-details-main-section mt-2 px-4">
                <div className="reg-success-box">
                    <p className="reg-success-para reg-success-msg">Thank You ! You are done with onboarding process.
                        your reference ID is - SEL010NB10099
                    </p>
                    <p className="reg-success-para">Your submission is under approval. You will receive a confirmation regarding the
                        next steps on your email ID and mobile number.
                    </p>
                    <p className="reg-success-para">You may also reach out to <a href="seller_support@rhokart.com" className="reg-success-msg">seller_support@rhokart.com</a> for any clarification with
                        your reference ID screenshot and registered phone number
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegistrationSuccess;