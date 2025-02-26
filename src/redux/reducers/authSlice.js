import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    isApproved: false,
    accessLevel: localStorage.getItem("accessLevel") || null, // Store access level
    sellerEmail: localStorage.getItem("sellerEmail") || null, // Store seller email
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { accessToken, refreshToken, accessLevel, sellerEmail } = action.payload;
            state.token = accessToken;
            state.isAuthenticated = true;
            state.accessLevel = accessLevel;
            state.sellerEmail = sellerEmail;

            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("accessLevel", accessLevel);
            localStorage.setItem("sellerEmail", sellerEmail);
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.isApproved = false;
            state.accessLevel = null;
            state.sellerEmail = null;

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessLevel");
            localStorage.removeItem("sellerEmail");
        },
        setApprovalStatus: (state, action) => {
            state.isApproved = action.payload;
        },
    },
});

export const { loginSuccess, logout, setApprovalStatus } = authSlice.actions;
export default authSlice.reducer;
