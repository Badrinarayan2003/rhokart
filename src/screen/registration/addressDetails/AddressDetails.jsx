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

    const businessDetails = useSelector((state) => state.registration?.businessDetails);
    console.log(businessDetails, "businessDetails from store in addressdetails");
    const addressDetails = useSelector((state) => state.registration?.addressDetails);
    console.log(addressDetails, "addressDetails from store in addressdetails");

    const [sameAsBusinessAddOne, setSameAsBusinessAddOne] = useState(false);
    const [sameAsBusinessAddTwo, setSameAsBusinessAddTwo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Initialize state with Redux data if available
    const [billingAddress, setBillingAddress] = useState(() => ({
        addressLine1: addressDetails?.billingAddress?.addressLine1 || "",
        addressLine2: addressDetails?.billingAddress?.addressLine2 || "",
        pincode: addressDetails?.billingAddress?.pincode || "",
        city: addressDetails?.billingAddress?.city || "",
        district: addressDetails?.billingAddress?.district || "",
        state: addressDetails?.billingAddress?.state || "",
        country: addressDetails?.billingAddress?.country || "",
        landmark: addressDetails?.billingAddress?.landmark || ""
    }));

    const [pickupAddress, setPickupAddress] = useState(() => ({
        addressLine1: addressDetails?.pickupAddress?.addressLine1 || "",
        addressLine2: addressDetails?.pickupAddress?.addressLine2 || "",
        pincode: addressDetails?.pickupAddress?.pincode || "",
        city: addressDetails?.pickupAddress?.city || "",
        district: addressDetails?.pickupAddress?.district || "",
        state: addressDetails?.pickupAddress?.state || "",
        country: addressDetails?.pickupAddress?.country || "",
        landmark: addressDetails?.pickupAddress?.landmark || ""
    }));


    // Update the change detection useEffect
    useEffect(() => {
        // If we have saved address details
        if (addressDetails?.billingAddress && addressDetails?.pickupAddress) {
            const billingChanged = Object.keys(billingAddress).some(
                key => billingAddress[key] !== (addressDetails.billingAddress[key] || "")
            );
            const pickupChanged = Object.keys(pickupAddress).some(
                key => pickupAddress[key] !== (addressDetails.pickupAddress[key] || "")
            );
            setHasChanges(billingChanged || pickupChanged);
        }
        // If we don't have saved details yet
        else {
            const billingFilled = Object.values(billingAddress).some(val => val.trim() !== "");
            const pickupFilled = Object.values(pickupAddress).some(val => val.trim() !== "");
            setHasChanges(billingFilled || pickupFilled);
        }
    }, [billingAddress, pickupAddress, addressDetails]);

    // Set isSaved if we have initial data
    useEffect(() => {
        if (addressDetails) {
            setIsSaved(true);
        }
    }, [addressDetails]);

    const handleSameAsBusinessAddOne = () => {
        if (addressDetails && !sameAsBusinessAddOne) {
            const confirmOverwrite = window.confirm(
                "You already have saved billing address data. Overwrite with business address?"
            );
            if (!confirmOverwrite) return;
        }
        setSameAsBusinessAddOne(!sameAsBusinessAddOne);
        setHasChanges(true);  // Add this line
    };

    const handleSameAsBusinessAddTwo = () => {
        if (addressDetails && !sameAsBusinessAddTwo) {
            const confirmOverwrite = window.confirm(
                "You already have saved pickup address data. Overwrite with business address?"
            );
            if (!confirmOverwrite) return;
        }
        setSameAsBusinessAddTwo(!sameAsBusinessAddTwo);
        setHasChanges(true);  // Add this line
    };

    // Effect for Billing Address
    useEffect(() => {
        if (sameAsBusinessAddOne) {
            setBillingAddress(prev => ({
                ...prev,
                addressLine1: businessDetails?.address || "",
                pincode: businessDetails?.pincode || "",
                city: businessDetails?.city || "",
                state: businessDetails?.state || "",
                country: businessDetails?.country || ""
            }));
        }
    }, [sameAsBusinessAddOne, businessDetails]);

    // Effect for Pickup Address
    useEffect(() => {
        if (sameAsBusinessAddTwo) {
            setPickupAddress(prev => ({
                ...prev,
                addressLine1: businessDetails?.address || "",
                pincode: businessDetails?.pincode || "",
                city: businessDetails?.city || "",
                state: businessDetails?.state || "",
                country: businessDetails?.country || ""
            }));
        }
    }, [sameAsBusinessAddTwo, businessDetails]);

    const handleInputChange = (event, setAddress) => {
        const { name, value } = event.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        setHasChanges(true);  // Add this line
    };

    // Validate form fields
    const validateFields = () => {
        const requiredFields = ['addressLine1', 'addressLine2', 'landmark', 'pincode', 'district'];

        // Check billing address
        for (const field of requiredFields) {
            if (!billingAddress[field]) {
                toast.error(`Please fill ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} in Billing Address`);
                return false;
            }
        }

        // Check pickup address
        for (const field of requiredFields) {
            if (!pickupAddress[field]) {
                toast.error(`Please fill ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} in Pickup Address`);
                return false;
            }
        }

        return true;
    };


    // Update the handleSaveAddress to properly handle the response
    const handleSaveAddress = async () => {
        if (!validateFields()) return;

        const email = businessDetails?.email;
        const addressData = { billingAddress, pickupAddress };
        setLoading(true);

        try {
            const response = await postAddressDetails(email, addressData);

            if (response?.data?.response?.rcode === 0) {
                // Make sure we're accessing the response data correctly
                console.log(response, "address details api response")
                const savedData = response.data.response.coreData?.responseData?.sellerAddress || {
                    billingAddress,
                    pickupAddress
                };
                console.log(savedData, "api response save data of address details")

                dispatch(setAddressDetails(savedData));
                toast.success(response.data.response.rmessage || "Address saved successfully");
                setIsSaved(true);
                setHasChanges(false);
            } else {
                toast.error(response?.data?.response?.rmessage || "Failed to save address");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (!validateFields()) {
            toast.error("Please fill all required fields before proceeding");
            return;
        }

        if (!isSaved) {
            await handleSaveAddress();
        }

        navigate('/registration/brand-details');
    };

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
                                <h5 className="text-center fw-bold">Billing Address:</h5>
                                <div className="row">
                                    <div className="col-lg-10 col-md-12 ">
                                        <div className="row">

                                            <div className="col-lg-12 col-md-12 top-add-near d-flex justify-content-center">
                                                <div className='row w-100'>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-one d-flex flex-column">
                                                            <label className="mb-1">AddressLine1:<span className='star-inde'>*</span></label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="addressLine1" value={billingAddress.addressLine1} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">AddressLine2:<span className='star-inde'>*</span></label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="addressLine2" value={billingAddress.addressLine2} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Nearest landmark:<span className='star-inde'>*</span></label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="landmark" value={billingAddress.landmark} onChange={(e) => handleInputChange(e, setBillingAddress)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 d-flex justify-content-center">
                                                <div className="row w-100">

                                                    <div className="col-lg-3 col-md-3 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Pincode:<span className='star-inde'>*</span></label>
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
                                                            <label className="mb-1">District:<span className='star-inde'>*</span></label>
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
                                <h5 className="text-center fw-bold">Pick-up address-1:</h5>
                                <div className="row">
                                    <div className="col-lg-10 col-md-12 ">
                                        <div className="row">

                                            <div className="col-lg-12 col-md-12 top-add-near d-flex justify-content-center">
                                                <div className='row w-100'>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-one d-flex flex-column">
                                                            <label className="mb-1">AddressLine1:<span className='star-inde'>*</span></label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="addressLine1" value={pickupAddress.addressLine1} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">AddressLine2:<span className='star-inde'>*</span></label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="addressLine2" value={pickupAddress.addressLine2} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 mt-2'>
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Nearest landmark:<span className='star-inde'>*</span></label>
                                                            <input type="text" placeholder='Enter billing address' className="billing-add-input billing-add-input-active" name="landmark" value={pickupAddress.landmark} onChange={(e) => handleInputChange(e, setPickupAddress)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 d-flex justify-content-center">
                                                <div className="row w-100">

                                                    <div className="col-lg-3 col-md-3 mt-2">
                                                        <div className="address-details-billing-add-input-box-two d-flex flex-column">
                                                            <label className="mb-1">Pincode:<span className='star-inde'>*</span></label>
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
                                                            <label className="mb-1">District:<span className='star-inde'>*</span></label>
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
                                    {/*
                                         <div className="col-lg-2 d-flex align-items-center justify-content-center">
                                             <div className="add-location-container d-flex flex-column align-items-center">
                                                 <p className="mb-1"><FaLocationDot size={40} color='#1F8505' /></p>
                                                <p className="mb-1 add-location-container-label">Locate on map*</p>
                                            </div>
                                      </div>
                                     */}
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
                            <button className="back-btn" onClick={() => navigate("/registration/document-uploud")}>Back</button>
                            <button
                                className="save-btn"
                                // style={isSaved ? { background: "#7e7e7e", cursor: "not-allowed" } : {}}
                                // onClick={handleSaveAddress}
                                // disabled={loading || isSaved}
                                style={{
                                    backgroundColor: isSaved && !hasChanges ? '#7e7e7e' : '',
                                    cursor: isSaved && !hasChanges ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handleSaveAddress}
                                disabled={loading || isSaved && !hasChanges}
                            >
                                {/* {loading ? "Saving..." : isSaved ? "Saved" : "Save"} */}
                                {loading ? 'Saving...' : isSaved && !hasChanges ? 'Saved' : 'Save'}
                            </button>
                            <button className="next-btn" onClick={handleNext}>Next</button>
                        </div>
                    </div>

                </div>



            </div>
        </>
    );
};

export default AddressDetails;