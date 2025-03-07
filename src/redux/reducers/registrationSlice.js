import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    businessDetails: null,  // Stores business-related info
    bankDetails: null,      // Stores bank details
    addressDetails: null,   // Stores vendor's address details
    brandsDetails: {
        data: null,         // Stores brand-related details
        documents: []       // Stores metadata of uploaded documents
    },
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
            state.brandsDetails.data = action.payload;
        },
        addBrandDocument: (state, action) => {
            state.brandsDetails.documents.push(action.payload);
        },
        removeBrandDocument: (state, action) => {
            state.brandsDetails.documents = state.brandsDetails.documents.filter(
                (doc) => doc.id !== action.payload
            );
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
    addBrandDocument,
    removeBrandDocument,
    setDocumentUpload,
    submitRegistration,
    resetRegistration
} = registrationSlice.actions;

export default registrationSlice.reducer;
