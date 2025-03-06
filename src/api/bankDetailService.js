import axios from "axios";
import { BASE_URL } from "../config/urls";

export const submitBankDetails = async (formData,email) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/test/onboarding/bankdetail`,
            formData,
            {
                headers: { "Content-Type": "application/json" },
                params: { email: email }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error, "error in services");
        throw error;
    }
};
