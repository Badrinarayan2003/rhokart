import axios from "axios";
import { BASE_URL } from "../config/urls";

export const submitBusinessDetails = async (formData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/test/onboarding/businessDetail`,
            formData,
            {
                headers: { "Content-Type": "application/json" },
                params: { email: formData.email }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error, "error in services");
        throw error;
    }
};
