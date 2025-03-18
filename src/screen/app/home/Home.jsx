import { FaCartPlus } from "react-icons/fa6";
import { FaHandHoldingUsd } from "react-icons/fa";
import { BsBarChartLineFill } from "react-icons/bs";

const Home = () => {
    return (
        <div className="admin-home-page">
            <div className="row">
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-3 d-flex justify-content-center">
                    <div className="admin-home-main-box flex-conte">
                        <div className="admin-home-main-box-one gap-3 d-flex justify-content-start mb-2">
                            <span><FaCartPlus color='#1F8505' size={23} /></span>
                            <h5 className="admin-home-main-box-one-header">Orders</h5>
                        </div>
                        <div className="admin-home-main-box-two">
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Unfulfillment</p>
                                <span>12</span>
                            </div>
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Under Process</p>
                                <span>40</span>
                            </div>
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Completed</p>
                                <span>2973</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-3 d-flex justify-content-center">
                    <div className="admin-home-main-box flex-conte">
                        <div className="admin-home-main-box-one gap-3 d-flex justify-content-start mb-2">
                            <span><FaHandHoldingUsd  color='#1F8505' size={23} /></span>
                            <h5 className="admin-home-main-box-one-header">Payments</h5>
                        </div>
                        <div className="admin-home-main-box-two">
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Unfulfillment</p>
                                <span>12</span>
                            </div>
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Under Process</p>
                                <span>40</span>
                            </div>
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Completed</p>
                                <span>2973</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-3 d-flex justify-content-center">
                    <div className="admin-home-main-box flex-conte">
                        <div className="admin-home-main-box-one gap-3 d-flex justify-content-start mb-2">
                            <span><BsBarChartLineFill  color='#1F8505' size={23} /></span>
                            <h5 className="admin-home-main-box-one-header">Performance</h5>
                        </div>
                        <div className="admin-home-main-box-two">
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Unfulfillment</p>
                                <span>12</span>
                            </div>
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Under Process</p>
                                <span>40</span>
                            </div>
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Completed</p>
                                <span>2973</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-3 d-flex justify-content-center">
                    <div className="admin-home-main-box flex-conte">
                        <div className="admin-home-main-box-one gap-3 d-flex justify-content-start mb-2">
                            <span><FaCartPlus color="#fff" size={23} /></span>
                            <h5 className="admin-home-main-box-one-header">Orders</h5>
                        </div>
                        <div className="admin-home-main-box-two">
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Unfulfillment</p>
                                <span>12</span>
                            </div>
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Under Process</p>
                                <span>40</span>
                            </div>
                            <div className="admin-home-main-box-two-sub-box d-flex justify-content-between mb-2">
                                <p className="mb-1">Completed</p>
                                <span>2973</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;