import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";
import './registrationReview.css';

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
            <div className="reg-review-details-main-section mt-2">

                <div className="review-business-detail-sub-section">
                    <div className="row">
                        <div className="col-12">
                            <h4 className="text-center mt-2">Business details</h4>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-4 ">
                            <p className="review-business-detail-title-box d-flex flex-wrap align-items-center">
                                GSTIN:
                                <span className="review-business-detail-title-value ms-2">07ABCDE1234Q12M</span>
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <p className="review-business-detail-title-box d-flex flex-wrap align-items-center">
                                Entity Name:
                                <span className="review-business-detail-title-value ms-2">Sankalp Traders Private Limited</span>
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <p className="review-business-detail-title-box d-flex flex-wrap align-items-center">
                                Contact Name:
                                <span className="review-business-detail-title-value ms-2">Amith Samanta</span>
                            </p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-4 ">
                            <p className="review-business-detail-title-box d-flex flex-wrap align-items-center">
                                Trade Name:
                                <span className="review-business-detail-title-value ms-2">Optional</span>
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <p className="review-business-detail-title-box d-flex flex-wrap align-items-center">
                                Country:
                                <span className="review-business-detail-title-value ms-2">India</span>
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <p className="review-business-detail-title-box d-flex flex-wrap align-items-center">
                                Pincode:
                                <span className="review-business-detail-title-value ms-2">711803</span>
                            </p>
                        </div>
                    </div>


                </div>

            </div>
        </div>
    )
}

export default RegistrationReview;