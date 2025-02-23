import './registrationProgress.css';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/reducers/authSlice';

const RegistrationProgress = ({ color, active, step }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login")
    }

    return (
        <div className="registration-progress-section">
            <div className="my-3 mx-3">
                <div className="position-relative">
                    {/* Horizontal Line */}
                    <div className="position-absolute start-0 w-100 reg-progress-horizontal-line" ></div>

                    {/* Circles with Text */}
                    <div className="d-flex justify-content-between position-relative">
                        {/* Step 1 */}
                        <div className="text-center position-relative d-flex justify-content-center flex-column align-items-center circle-main-box"
                            onClick={handleLogout}
                        >
                            <div
                                className="rounded-circle mb-0 d-flex align-items-center justify-content-center round-circle"
                                style={{
                                    border: `2px solid ${step >= 1 ? color : "#c4c4c4"}`,
                                    background: step > 1 ? color : step === 1 ? active : "#c4c4c4",
                                    color: step > 1 ? "#fff" : "#1F8505",
                                }}
                            >
                                1
                            </div>
                            <div className="progress-text">Business Details</div>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center position-relative d-flex justify-content-center flex-column align-items-center circle-main-box"
                            onClick={() => navigate("/registration/bank-details")}
                        >
                            <div
                                className="rounded-circle mb-0 d-flex align-items-center justify-content-center round-circle"
                                style={{
                                    border: `2px solid ${step >= 2 ? color : "#c4c4c4"}`,
                                    background: step > 2 ? color : step === 2 ? active : "#c4c4c4",
                                    color: step > 2 ? "#fff" : "#1F8505",
                                }}
                            >
                                2
                            </div>
                            <div className="progress-text">Bank Details</div>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center position-relative d-flex justify-content-center flex-column align-items-center circle-main-box"
                            onClick={() => navigate("/registration/document-uploud")}
                        >
                            <div
                                className="rounded-circle mb-0 d-flex align-items-center justify-content-center round-circle"
                                style={{
                                    border: `2px solid ${step >= 3 ? color : "#c4c4c4"}`,
                                    background: step > 3 ? color : step === 3 ? active : "#c4c4c4",
                                    color: step > 3 ? "#fff" : "#1F8505",
                                }}
                            >
                                3
                            </div>
                            <div className="progress-text">Documentation</div>
                        </div>

                        {/* Step 4 */}
                        <div className="text-center position-relative d-flex justify-content-center flex-column align-items-center circle-main-box"
                            onClick={() => navigate("/registration/address-details")}
                        >
                            <div
                                className="rounded-circle mb-0 d-flex align-items-center justify-content-center round-circle"
                                style={{
                                    border: `2px solid ${step >= 4 ? color : "#c4c4c4"}`,
                                    background: step > 4 ? color : step === 4 ? active : "#c4c4c4",
                                    color: step > 4 ? "#fff" : "#1F8505",
                                }}
                            >
                                4
                            </div>
                            <div className="progress-text">Address</div>
                        </div>

                        {/* Step 5 */}
                        <div className="text-center position-relative d-flex justify-content-center flex-column align-items-center circle-main-box"
                            onClick={() => navigate("/registration/brand-details")}
                        >
                            <div
                                className="rounded-circle mb-0 d-flex align-items-center justify-content-center round-circle"
                                style={{
                                    border: `2px solid ${step >= 5 ? color : "#c4c4c4"}`,
                                    background: step > 5 ? color : step === 5 ? active : "#c4c4c4",
                                    color: step > 5 ? "#fff" : "#1F8505",
                                }}
                            >
                                5
                            </div>
                            <div className="progress-text">Brands</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegistrationProgress;