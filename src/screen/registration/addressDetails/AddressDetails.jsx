import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAddressDetails } from '../../../redux/reducers/registrationSlice';

import './addressDetails.css';
import RegistrationHeader from '../../../components/registrationHeader/RegistrationHeader';
import RegistrationProgress from '../../../components/registrationProgress/RegistrationProgress';
import { postAddressDetails } from '../../../api/addressDetailService';
import Loader from '../../../components/loader/Loader';

import { FaLocationDot } from "react-icons/fa6";

const AddressDetails = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const uploadedDocs = useSelector((state) => state.registration?.documentUpload);
    console.log(uploadedDocs, "document upload getting from redux store"); // This will log the stored business details

    const businessDetails = useSelector((state) => state.registration?.businessDetails);
    console.log(businessDetails, "business details in address");

    const addressDetails = useSelector((state) => state.registration?.addressDetails);
    console.log(addressDetails, "address details in address");

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

    const [loading, setLoading] = useState(false); // Loading state
    const [isSaved, setIsSaved] = useState(false);


    const [billingAddress, setBillingAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        pincode: "",
        city: "",
        district: "",
        state: "",
        country: "",
        landmark: ""
    });

    const [pickupAddress, setPickupAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        pincode: "",
        city: "",
        district: "",
        state: "",
        country: "",
        landmark: ""
    });

    const handleInputChange = (event, setAddress) => {
        const { name, value } = event.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };


    // Validate form fields
    const validateFields = () => {
        for (const key of Object.keys(billingAddress)) {
            if (!billingAddress[key]) {
                toast.error("All fields are required in Billing Address");
                return false;
            }
        }

        for (const key of Object.keys(pickupAddress)) {
            if (!pickupAddress[key]) {
                toast.error("All fields are required in Pickup Address");
                return false;
            }
        }

        return true;
    };



    const handleSaveAddress = async () => {
        if (!validateFields()) return;


        const email = businessDetails?.email;
        const addressData = { billingAddress, pickupAddress };
        setLoading(true); // Start loading
        try {
            const response = await postAddressDetails(email, addressData);
            console.log("API Response:", response);

            if (response?.data?.response?.rcode === 0 && response?.data?.response?.coreData?.responseData) {
                const addressData = response?.data?.response?.coreData?.responseData;
                console.log(addressData, "actual data from server");
                dispatch(setAddressDetails(addressData));
                toast.success(response?.data?.response?.rmessage || "Seller address store successfully")
                setIsSaved(true);
            } else {
                console.log(response, "rcode not 0")
                toast.error(response?.data?.response?.rmessage || "Failed to store address, Please try again.")
            }

        } catch (error) {
            console.log(error, "Failed to save address. when posting")
            toast.error("Failed to save address. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Handle Next button click
    const handleNext = () => {
        if (!isSaved && !addressDetails) {
            toast.error("Please save the address before proceeding.");
            return;
        }
        navigate('/registration/brand-details');
    };

    // Effect for Billing Address
    useEffect(() => {
        if (sameAsBusinessAddOne) {
            setBillingAddress({
                addressLine1: businessDetails?.address || "",
                addressLine2: "",
                pincode: businessDetails?.pincode || "",
                city: businessDetails?.city || "",
                district: "",
                state: businessDetails?.state || "",
                country: businessDetails?.country || "",
                landmark: ""
            });
        } else {
            setBillingAddress({
                addressLine1: "",
                addressLine2: "",
                pincode: "",
                city: "",
                district: "",
                state: "",
                country: "",
                landmark: ""
            });
        }
    }, [sameAsBusinessAddOne, businessDetails]);

    // Effect for Pickup Address
    useEffect(() => {
        if (sameAsBusinessAddTwo) {
            setPickupAddress({
                addressLine1: businessDetails?.address || "",
                addressLine2: "",
                pincode: businessDetails?.pincode || "",
                city: businessDetails?.city || "",
                district: "",
                state: businessDetails?.state || "",
                country: businessDetails?.country || "",
                landmark: ""
            });
        } else {
            setPickupAddress({
                addressLine1: "",
                addressLine2: "",
                pincode: "",
                city: "",
                district: "",
                state: "",
                country: "",
                landmark: ""
            });
        }
    }, [sameAsBusinessAddTwo, businessDetails]);



    return (
        <>
            {loading && <Loader />}

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
                                        <p className="add-business-add-title">Address: <span className="add-business-add-title-message">{businessDetails?.address}</span></p>
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                        <p className="add-business-add-title">Pincode: <span className="add-business-add-title-message">{businessDetails?.pincode}</span></p>
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                        <p className="add-business-add-title">City: <span className="add-business-add-title-message">{businessDetails?.city}</span></p>
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                        <p className="add-business-add-title">State: <span className="add-business-add-title-message">{businessDetails?.state}</span></p>
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-4 d-flex justify-content-center">
                                        <p className="add-business-add-title">Country: <span className="add-business-add-title-message">{businessDetails?.country}</span></p>
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
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-one d-flex flex-column">
                                                            <label className="mb-1">AddressLine1:*</label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="addressLine1" value={billingAddress.addressLine1} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">AddressLine2:*</label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="addressLine2" value={billingAddress.addressLine2} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Nearest landmark:*</label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="landmark" value={billingAddress.landmark} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 d-flex justify-content-center">
                                                <div className="row w-100">

                                                    <div className="col-lg-3 col-md-3 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Pincode:*</label>
                                                            <input type="number" placeholder='Pincode' className="billing-add-input billing-add-input-active" name="pincode" value={billingAddress.pincode} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-2 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">City:</label>
                                                            <input type="text" placeholder='City' className="billing-add-input billing-add-input-active" name="city" value={billingAddress.city} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-3 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">District:</label>
                                                            <input type="text" placeholder='District' className="billing-add-input billing-add-input-active" name="district" value={billingAddress.district} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-2 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">State:</label>
                                                            <input type="text" placeholder='State' className="billing-add-input billing-add-input-active" name="state" value={billingAddress.state} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-2 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Country:</label>
                                                            <input type="text" placeholder='Country' className="billing-add-input billing-add-input-active" name="country" value={billingAddress.country} onChange={(e) => handleInputChange(e, setBillingAddress)} />
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
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-one d-flex flex-column">
                                                            <label className="mb-1">AddressLine1:*</label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="addressLine1" value={pickupAddress.addressLine1} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">AddressLine2:*</label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="addressLine2" value={pickupAddress.addressLine2} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Nearest landmark:*</label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="landmark" value={pickupAddress.landmark} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 d-flex justify-content-center">
                                                <div className="row w-100">

                                                    <div className="col-lg-3 col-md-3 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Pincode:*</label>
                                                            <input type="number" placeholder='Pincode' className="billing-add-input billing-add-input-active" name="pincode" value={pickupAddress.pincode} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-2 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">City:</label>
                                                            <input type="text" placeholder='City' className="billing-add-input billing-add-input-active" name="city" value={pickupAddress.city} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-3 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">District:</label>
                                                            <input type="text" placeholder='District' className="billing-add-input billing-add-input-active" name="district" value={pickupAddress.district} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-2 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">State:</label>
                                                            <input type="text" placeholder='State' className="billing-add-input billing-add-input-active" name="state" value={pickupAddress.state} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-2 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Country:</label>
                                                            <input type="text" placeholder='Country' className="billing-add-input billing-add-input-active" name="country" value={pickupAddress.country} onChange={(e) => handleInputChange(e, setPickupAddress)} />
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
                            <button className="save-btn" style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}} onClick={handleSaveAddress} disabled={loading || isSaved}>
                                {loading ? "Saving..." : isSaved ? "Saved" : "Save"}
                            </button>
                            <button className="next-btn" onClick={handleNext}>Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default AddressDetails;