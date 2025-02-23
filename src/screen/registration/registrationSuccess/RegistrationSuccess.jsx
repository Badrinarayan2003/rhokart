import { useDispatch } from "react-redux";
import { logout } from "../../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    }

    return (
        <div className="login-section">
            <h1>RegistrationSuccess page</h1>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default RegistrationSuccess;