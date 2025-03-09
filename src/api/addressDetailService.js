import axios from 'axios';
import { BASE_URL } from '../config/urls';


export const postAddressDetails = async (email, addressData) => {
    try {
        const response = await axios.post(`${BASE_URL}/test/onboarding/address?email=${email}`, addressData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.log("Error posting address details:", error);
        throw error;
    }
};