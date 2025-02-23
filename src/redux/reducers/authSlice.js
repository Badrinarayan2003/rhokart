import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    isApproved: false, // Stores approval status after review
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("token", action.payload); // Persist token
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.isApproved = false;
            localStorage.removeItem("token"); // Clear token on logout
        },
        setApprovalStatus: (state, action) => {
            state.isApproved = action.payload;
        },
    },
});

export const { loginSuccess, logout, setApprovalStatus } = authSlice.actions;
export default authSlice.reducer;
