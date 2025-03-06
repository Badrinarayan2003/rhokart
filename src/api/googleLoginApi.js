import axios from "axios";
import { toast } from 'react-toastify';

import { GOOGLE_USER_INFO, BASE_URL } from "../config/urls";

export const handleGoogleLogin = async (tokenResponse, setLoading) => {
    try {
        console.log("Google Token Response:", tokenResponse);

        if (!tokenResponse || !tokenResponse.access_token) {
            toast.error("No access token received from Google.");
            return;
        }

        // Fetch user info from Google API
        const userInfoResponse = await axios.get(`${GOOGLE_USER_INFO}`, {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        console.log("User Info:", userInfoResponse);
        console.log("User Info: data", userInfoResponse.data);
        console.log("User Info: data",);

        // Send user data to your backend
        if (userInfoResponse.data) {
            setLoading(true);
            try {
                const serverResponse = await axios.get(`${BASE_URL}/test/registration/oauthlogin?email=${userInfoResponse?.data?.email}`);
                console.log("Server Response:", serverResponse.data);
                setLoading(false);
                return serverResponse;
            } catch (error) {
                console.log("server error", error);
                toast.error("Server Error");
                setLoading(false);
            }
        } else {
            toast.warning("user info not available");
            setLoading(false);
        }

    } catch (error) {
        console.log("Error processing Google login:", error);
        toast.error("Error processing Google login:", error);
        return null;
    }
};