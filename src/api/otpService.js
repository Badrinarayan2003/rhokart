import axios from "axios";
import { toast } from "react-toastify";

import { BASE_URL } from "../config/urls";

// Function to request OTP
export const requestOTP = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.warning("Please enter a valid email.");
        return false;
    }

    try {
        const response = await axios.get(`${BASE_URL}/test/registration/emailotp?email=${email}`);

        if (response?.data?.response?.rcode === 0) {
            toast.success(`OTP sent to ${email}. Please check your email.`);
            return true;
        } else {
            toast.error(response?.data?.response?.rmessage || "Failed to send OTP");
            return false;
        }
    } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
        return false;
    }
};

// Function to verify OTP
export const verifyOTP = async (email, otp) => {
    if (!otp || otp.length !== 5) {
        toast.warning("Please enter a valid 5-digit OTP.");
        return false;
    }

    try {
        const response = await axios.get(`${BASE_URL}/test/registration/validateEmailOtp?email=${email}&otpValue=${otp}`);

        if (response?.data?.response?.rcode === 0) {
            toast.success("Email verified successfully!");
            return true;
        } else {
            toast.error(response?.data?.response?.rmessage || "Invalid OTP. Try again.");
            return false;
        }
    } catch (error) {
        toast.error("OTP verification failed. Please try again.");
        return false;
    }
};