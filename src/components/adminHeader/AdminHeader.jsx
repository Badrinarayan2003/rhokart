import React from 'react'
import { BsFillBellFill } from 'react-icons/bs';
import { FaBars } from "react-icons/fa6";
import { IoSettingsSharp, IoLogOut } from "react-icons/io5";
import { FaUser } from "react-icons/fa";


import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/reducers/authSlice';
import { resetRegistration } from '../../redux/reducers/registrationSlice';

function AdminHeader({ OpenSidebar }) {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
        dispatch(resetRegistration());
    }

    const sellerName = useSelector((state) => state.auth?.sellerName)
    console.log(sellerName, "seller name from auth slice redux store")

    return (
        <header className='header'>
            <div className='menu-icon'>
                <FaBars className='icon' color='#fff' onClick={OpenSidebar} size={23} />
            </div>

            <div className='header-left'>

            </div>

            <div className='header-right gap-3 dropdown'>
                {/* <BsFillBellFill color='#fff' size={25} className='icon dropdown-toggle' type="button" data-bs-toggle="dropdown" aria-expanded="false" />
                <ul className="dropdown-menu" id="dropdown-menu-show-ani-one">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul> */}
                <div className="dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="d-flex flex-column align-items-center">
                        <FaUser color='#fff' size={23} />
                        <p className='mb-0 seller-profile-name'>{sellerName ? sellerName : "Seller Name"}</p>
                    </div>
                </div>
                <ul className="dropdown-menu" id="dropdown-menu-show-ani-two" >
                    <li
                        onClick={() => navigate("/profile")}
                    ><p className="dropdown-item mb-0">
                            <span className='me-2'><IoSettingsSharp size={22} /></span>
                            Seller Profile
                        </p>
                    </li>
                    <li onClick={handleLogout}>
                        <span className="dropdown-item" style={{ cursor: 'pointer' }} >
                            <span className='me-2'> <IoLogOut size={22} /></span>
                            Logout</span>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default AdminHeader;