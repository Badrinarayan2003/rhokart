import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    isApproved: false,
    accessLevel: localStorage.getItem("accessLevel") || null, // Store access level
    sellerEmail: localStorage.getItem("sellerEmail") || null, // Store seller email
    sellerId: localStorage.getItem("sellerId") || null,
    sellerName: localStorage.getItem("sellerName") || null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { accessToken, refreshToken, accessLevel, sellerEmail, sellerId, sellerName } = action.payload;
            state.token = accessToken;
            state.isAuthenticated = true;
            state.accessLevel = accessLevel;
            state.sellerEmail = sellerEmail;
            state.sellerId = sellerId;
            state.sellerName = sellerName;

            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("accessLevel", accessLevel);
            localStorage.setItem("sellerEmail", sellerEmail);
            localStorage.setItem("sellerId", sellerId);
            localStorage.setItem("sellerName", sellerName);
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.isApproved = false;
            state.accessLevel = null;
            state.sellerEmail = null;
            state.sellerId = null;
            state.sellerName = null;

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessLevel");
            localStorage.removeItem("sellerEmail");
            localStorage.removeItem("sellerId");
            localStorage.removeItem("sellerName");
        },
        setApprovalStatus: (state, action) => {
            state.isApproved = action.payload;
        },
    },
});

export const { loginSuccess, logout, setApprovalStatus } = authSlice.actions;
export default authSlice.reducer;
