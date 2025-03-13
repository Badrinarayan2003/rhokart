import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import BusinessDetails from "../screen/registration/businessDetails/BusinessDetails";
import BankDetails from "../screen/registration/bankDetails/BankDetails";
import AddressDetails from "../screen/registration/addressDetails/AddressDetails";
import BrandsDetails from "../screen/registration/brandsDetails/BrandsDetails";
import DocumentUploud from "../screen/registration/documentUploud/DocumentUploud";
import RegistrationSuccess from "../screen/registration/registrationSuccess/RegistrationSuccess";
import RegistrationReview from "../screen/registration/registrationReview/RegistrationReview";

const RegistrationStack = () => {
    const location = useLocation();

    const { businessDetails, bankDetails, addressDetails, brandsDetails, documentUpload, isSubmitted } = useSelector(
        (state) => state.registration
    );

    console.log(isSubmitted, "ame maribu")

    // Determine the next route based on available data
    let nextRoute = "/registration/business-details";

    if (businessDetails) nextRoute = "/registration/bank-details";
    if (businessDetails && bankDetails) nextRoute = "/registration/document-uploud";
    if (businessDetails && bankDetails && documentUpload.length > 0) nextRoute = "/registration/address-details";
    if (businessDetails && bankDetails && addressDetails && documentUpload.length > 0) nextRoute = "/registration/brand-details";
    if (businessDetails && bankDetails && addressDetails && brandsDetails.length > 0 && documentUpload.length > 0)
        nextRoute = "/review-status";

    return (
        <Routes>
            {/* Redirect to the correct step if the user tries to access an earlier step */}
            {location.pathname !== nextRoute && <Route path="*" element={<Navigate to={nextRoute} replace />} />}

            <Route path="/registration/business-details" element={<BusinessDetails />} />
            <Route path="/registration/bank-details" element={<BankDetails />} />
            <Route path="/registration/address-details" element={<AddressDetails />} />
            <Route path="/registration/brand-details" element={<BrandsDetails />} />
            <Route path="/registration/document-uploud" element={<DocumentUploud />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/review-status" element={<RegistrationReview />} />

            {/* Catch-all: Redirect unknown routes to the first step */}
            <Route path="*" element={<Navigate to={nextRoute} replace />} />
        </Routes>
    );
};

export default RegistrationStack;














// import { Routes, Route, Navigate } from "react-router-dom";

// import BusinessDetails from "../screen/registration/businessDetails/BusinessDetails";
// import BankDetails from "../screen/registration/bankDetails/BankDetails";
// import AddressDetails from "../screen/registration/addressDetails/AddressDetails";
// import BrandsDetails from "../screen/registration/brandsDetails/BrandsDetails";
// import DocumentUploud from "../screen/registration/documentUploud/DocumentUploud";
// import RegistrationSuccess from "../screen/registration/registrationSuccess/RegistrationSuccess";

// import RegistrationReview from "../screen/registration/registrationReview/RegistrationReview";

// import { useSelector } from "react-redux";

// const RegistrationStack = () => {

//     const { businessDetails, bankDetails, addressDetails, brandsDetails, documentUpload, } = useSelector((state) => state.registration);
//     console.log(businessDetails, "business details from store! in review");
//     console.log(bankDetails, "bank details from store! in review");
//     console.log(addressDetails, "address details from store! in review");
//     console.log(documentUpload, "document details from store! in review");
//     console.log(brandsDetails, "brand details from store! in review");

//     return (
//         <Routes>
//             <Route path="/registration/business-details" element={<BusinessDetails />} />
//             <Route path="/registration/bank-details" element={<BankDetails />} />
//             <Route path="/registration/address-details" element={<AddressDetails />} />
//             <Route path="/registration/brand-details" element={<BrandsDetails />} />
//             <Route path="/registration/document-uploud" element={<DocumentUploud />} />
//             <Route path="/registration-success" element={<RegistrationSuccess />} />

//             {/* Review Status Page (After submitting registration) */}
//             <Route path="/review-status" element={<RegistrationReview />} />

//             {/* Catch-all: Redirect unknown routes to the first step */}
//             <Route path="*" element={<Navigate to="/registration/business-details" />} />
//         </Routes>
//     )
// }

// export default RegistrationStack;