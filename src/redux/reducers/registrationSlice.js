import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    businessDetails: null,  // Stores business-related info
    bankDetails: null,      // Stores bank details
    addressDetails: null,   // Stores vendor's address details
    brandsDetails: [],      // Stores brand-related details
    documentUpload: [],     // Stores other general uploaded documents
    isSubmitted: false,     // Tracks if the registration is completed
};

const registrationSlice = createSlice({
    name: "registration",
    initialState,
    reducers: {
        setBusinessDetails: (state, action) => {
            state.businessDetails = action.payload;
        },
        setBankDetails: (state, action) => {
            state.bankDetails = action.payload;
        },
        setAddressDetails: (state, action) => {
            state.addressDetails = action.payload;
        },
        setBrandsDetails: (state, action) => {
            state.brandsDetails = action.payload;
        },
        setDocumentUpload: (state, action) => {
            state.documentUpload = action.payload;
        },
        submitRegistration: (state) => {
            state.isSubmitted = true;
        },
        resetRegistration: () => initialState, // Resets the entire registration process
    },
});

export const {
    setBusinessDetails,
    setBankDetails,
    setAddressDetails,
    setBrandsDetails,
    setDocumentUpload,
    submitRegistration,
    resetRegistration
} = registrationSlice.actions;

export default registrationSlice.reducer;
