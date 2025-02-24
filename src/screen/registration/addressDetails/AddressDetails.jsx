import React, { useState } from 'react';

import './addressDetails.css';
import RegistrationHeader from '../../../components/registrationHeader/RegistrationHeader';
import RegistrationProgress from '../../../components/registrationProgress/RegistrationProgress';

import { FaLocationDot } from "react-icons/fa6";

const AddressDetails = () => {

    const [sameAsBusinessAddOne, setSameAsBusinessAddOne] = useState(false);
    const [sameAsBusinessAddTwo, setSameAsBusinessAddTwo] = useState(false);

    const handleSameAsBusinessAddOne = () => {
        setSameAsBusinessAddOne(!sameAsBusinessAddOne);
        console.log("Checkbox value:", !sameAsBusinessAddOne); // Logs the updated value
    };

    const handleSameAsBusinessAddTwo = () => {
        setSameAsBusinessAddTwo(!sameAsBusinessAddTwo);
        console.log("Checkbox value:", !sameAsBusinessAddTwo); // Logs the updated value
    };

    return (
        <div className="address-details-section overflow-x-hidden overflow-y-auto vh-100">
            <div className="registration-header overflow-hidden">
                <RegistrationHeader />
            </div>
            <div className="registration-progress">
                <RegistrationProgress color="#1F8505" active="#fff" step={4} />
            </div>
            <div className="address-details-main-section mt-2">
                <div className="row mb-3">
                    <div className="col-12">
                        <h3 className="text-center address-sub-heading">Address Details</h3>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-lg-1 col-md-1"></div>
                    <div className="col-lg-10 col-md-10">
                        <div className="address-details-business">
                            <h5 className="text-center address-sub-heading fw-bold">Business Address</h5>
                            <div className="row">
                                <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                    <p className="add-business-add-title">Address: <span className="add-business-add-title-message">this is address</span></p>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                    <p className="add-business-add-title">Pincode: <span className="add-business-add-title-message">this is Pincode</span></p>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                    <p className="add-business-add-title">City: <span className="add-business-add-title-message">this is City</span></p>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                    <p className="add-business-add-title">State: <span className="add-business-add-title-message">this is State</span></p>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                    <p className="add-business-add-title">Country: <span className="add-business-add-title-message">this is Country</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-1 "></div>
                </div>


                <div className="row">
                    <div className="col-lg-1 col-md-1"></div>
                    <div className="col-lg-10 col-md-10">

                        <div className="address-details-billing-add pb-3">
                            <h5 className="text-center fw-bold">BIlling Address:*</h5>
                            <div className="row">
                                <div className="col-lg-10 col-md-12 ">
                                    <div className="row">

                                        <div className="col-lg-12 col-md-12 top-add-near d-flex justify-content-center">
                                            <div className='row w-100'>
                                                <div className='col-lg-7 col-md-6 mt-2'>
                                                    <div className="address-details-billing-add-input-box-one d-flex flex-column">
                                                        <label className="mb-1">Address:*</label>
                                                        <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>
                                                <div className='col-lg-5 col-md-6 mt-2'>
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">Nearest landmark:*</label>
                                                        <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12 d-flex justify-content-center">
                                            <div className="row w-100">

                                                <div className="col-lg-3 col-md-3 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">Pincode:*</label>
                                                        <input type="number" placeholder='Pincode' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">City:</label>
                                                        <input type="text" placeholder='City' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-md-3 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">District:</label>
                                                        <input type="text" placeholder='District' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">State:</label>
                                                        <input type="text" placeholder='State' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">Country:</label>
                                                        <input type="text" placeholder='Country' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 d-flex align-items-center ms-3">
                                            <input type="checkbox" id="matchone" checked={sameAsBusinessAddOne} onChange={handleSameAsBusinessAddOne} />
                                            <label htmlFor="matchone" className="acknowledge">Same as Business Address</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-1 col-md-1"></div>
                </div>



                <div className="row mt-4">
                    <div className="col-lg-1 col-md-1"></div>
                    <div className="col-lg-10 col-md-10">

                        <div className="address-details-billing-add pb-3">
                            <h5 className="text-center fw-bold">Pick-up address-1:*</h5>
                            <div className="row">
                                <div className="col-lg-10 col-md-12 ">
                                    <div className="row">

                                        <div className="col-lg-12 col-md-12 top-add-near d-flex justify-content-center">
                                            <div className='row w-100'>
                                                <div className='col-lg-7 col-md-6 mt-2'>
                                                    <div className="address-details-billing-add-input-box-one d-flex flex-column">
                                                        <label className="mb-1">Address:*</label>
                                                        <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>
                                                <div className='col-lg-5 col-md-6 mt-2'>
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">Nearest landmark:*</label>
                                                        <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12 d-flex justify-content-center">
                                            <div className="row w-100">

                                                <div className="col-lg-3 col-md-3 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">Pincode:*</label>
                                                        <input type="number" placeholder='Pincode' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">City:</label>
                                                        <input type="text" placeholder='City' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-md-3 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">District:</label>
                                                        <input type="text" placeholder='District' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">State:</label>
                                                        <input type="text" placeholder='State' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 mt-2">
                                                    <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                        <label className="mb-1">Country:</label>
                                                        <input type="text" placeholder='Country' className="billing-add-input billing-add-input-active" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 d-flex align-items-center ms-3">
                                            <input type="checkbox" id="matchtwo" checked={sameAsBusinessAddTwo} onChange={handleSameAsBusinessAddTwo} />
                                            <label htmlFor="matchtwo" className="acknowledge">Same as Business Address</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 d-flex align-items-center justify-content-center">
                                    <div className="add-location-container d-flex flex-column align-items-center">
                                        <p className="mb-1"><FaLocationDot size={40} color='#1F8505' /></p>
                                        <p className="mb-1 add-location-container-label">Locate on map*</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-1 col-md-1"></div>
                </div>

                {/* <div className="row my-3">
                    <div className="col-10 d-flex justify-content-end">
                        <button className="add-pickup-btn">
                            <span><IoIosAddCircleOutline size={19} color='#fff' /></span>
                            Add more pick up addresses </button>
                    </div>
                </div> */}

                <div className="row my-4">
                    <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-evenly">
                        <button className="back-btn">Back</button>
                        <button className="save-btn">Save</button>
                        <button className="next-btn">Next</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddressDetails;