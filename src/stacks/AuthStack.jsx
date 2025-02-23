import { Routes, Route } from "react-router-dom";

import Login from "../screen/auth/Login";
import LoginOtpVerification from "../screen/auth/LoginOtpVerification";

const AuthStack = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/loginotpverification" element={<LoginOtpVerification />} />
            <Route path="*" element={<Login />} />
        </Routes>
    )
}

export default AuthStack;