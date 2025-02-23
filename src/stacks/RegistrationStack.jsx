import { Routes, Route, Navigate } from "react-router-dom";

import BusinessDetails from "../screen/registration/businessDetails/BusinessDetails";
import BankDetails from "../screen/registration/bankDetails/BankDetails";
import AddressDetails from "../screen/registration/addressDetails/AddressDetails";
import BrandsDetails from "../screen/registration/brandsDetails/BrandsDetails";
import DocumentUploud from "../screen/registration/documentUploud/DocumentUploud";
import RegistrationSuccess from "../screen/registration/registrationSuccess/RegistrationSuccess";

import RegistrationReview from "../screen/registration/registrationReview/RegistrationReview";

const RegistrationStack = () => {

    return (
        <Routes>
            <Route path="/registration/business-details" element={<BusinessDetails />} />
            <Route path="/registration/bank-details" element={<BankDetails />} />
            <Route path="/registration/address-details" element={<AddressDetails />} />
            <Route path="/registration/brand-details" element={<BrandsDetails />} />
            <Route path="/registration/document-uploud" element={<DocumentUploud />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />

            {/* Review Status Page (After submitting registration) */}
            <Route path="/review-status" element={<RegistrationReview />} />

            {/* Catch-all: Redirect unknown routes to the first step */}
            <Route path="*" element={<Navigate to="/registration/business-details" />} />
        </Routes>
    )
}

export default RegistrationStack;