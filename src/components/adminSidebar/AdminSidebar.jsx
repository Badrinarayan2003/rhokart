import React, { useState, useEffect, useRef } from 'react';
import {
    BsGrid1X2Fill, BsFillArchiveFill, BsPeopleFill, BsFillGearFill
} from 'react-icons/bs';
import { IoHomeSharp } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { SlBookOpen } from "react-icons/sl";
import { LuNotebookPen } from "react-icons/lu";
import { MdLock } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { HiUserGroup } from "react-icons/hi";
import { TbReportSearch } from "react-icons/tb";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";

import { Link, NavLink, useLocation } from 'react-router-dom';
import { logo2 } from '../../assets/assets';

function AdminSidebar({ openSidebarToggle, OpenSidebar }) {
    const sidebarRef = useRef(null);
    const location = useLocation();
    // Close the sidebar when clicking outside (only if it's open)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the sidebar is open before closing it
            if (openSidebarToggle && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                OpenSidebar(); // Call the function to close the sidebar
            }
        };

        // Add event listener for clicks outside the sidebar
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openSidebarToggle, OpenSidebar]);




    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownToggle = (e) => {
        e.preventDefault(); // Prevent default action of anchor tag
        setDropdownOpen((prev) => !prev);
    };



    return (
        <aside
            id="sidebar"
            className={openSidebarToggle ? "sidebar-responsive" : ""}
            ref={sidebarRef}
        >
            <div className='sidebar-title justify-content-space-between'>
                <div className='sidebar-brand mt-0'>
                    <img src={logo2} />
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>
                    <CgClose size={25} color='#fff' />
                </span>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <NavLink
                        // className='d-flex align-items-center sidebar-link'
                        className={({ isActive }) =>
                            `d-flex align-items-center sidebar-link ${isActive ? 'active-sidebar-link' : ''}`
                        }
                        style={{ width: "auto" }} to="/home">
                        <IoHomeSharp className='icon' color='#1F8505' /> Home
                    </NavLink>
                </li>
                <li className='sidebar-list-item dropdown side-item-disable'>
                    <a
                        // href="#"
                        className="dropdown-toggle d-flex align-items-center sidebar-link"
                        id="productsDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <SlBookOpen className='icon' color='#1F8505' />Listings and catalog
                    </a>
                    <ul className="dropdown-menu" style={{ width: '100%' }} aria-labelledby="productsDropdown">
                        <li>
                            <NavLink className={({ isActive }) =>
                                `dropdown-item sidebar-link sidebar-link ${isActive ? 'active-sidebar-link' : ''}`
                            }
                                style={{ textWrap: 'auto', padding: "5px 5px" }} to="">Search for an existing product on the platform</NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `dropdown-item sidebar-link sidebar-link ${isActive ? 'active-sidebar-link' : ''}`
                                }
                                style={{ textWrap: 'auto', padding: "5px 5px" }} to="">Download excel template for respective category </NavLink>
                        </li>
                        <li>
                            <NavLink className="dropdown-item sidebar-link sidebar-link" style={{ textWrap: 'auto', padding: "5px 5px" }} to="">List new products
                                (Through bulk excel upload) </NavLink>
                        </li>
                        <li>
                            <NavLink className="dropdown-item sidebar-link sidebar-link" style={{ textWrap: 'auto', padding: "5px 5px" }} to="">List new products
                                (Individual one by one) </NavLink>
                        </li>
                    </ul>
                </li>

                {/* location.pathname.startsWith('/bulk-upload-update') || */}
                <li className={`sidebar-list-item dropdown ${location.pathname.startsWith('/update-on-portal') || location.pathname.startsWith('/products') ? 'active-parent' : ''}`}>
                    <a
                        href="#"
                        className={`dropdown-toggle d-flex align-items-center sidebar-link ${isDropdownOpen ? 'show' : ''}`}
                        id="productsDropdown"
                        role="button"
                        onClick={handleDropdownToggle}
                        aria-expanded={isDropdownOpen}
                    >
                        <LuNotebookPen className='icon' color='#1F8505' /> Inventory & Pricing
                    </a>
                    <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} style={{ width: '100%' }} aria-labelledby="productsDropdown">
                        {/* <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `dropdown-item sidebar-link ${isActive ? 'active-sidebar-link' : ''}`
                                }
                                style={{ textWrap: 'auto', padding: "5px 5px" }}
                                to="/bulk-upload-update"

                            >Bulk upload / Update</NavLink>
                        </li> */}

                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `dropdown-item sidebar-link ${isActive ? 'active-sidebar-link' : ''}`
                                }
                                style={{ textWrap: 'auto', padding: "5px 5px" }}
                                to="/update-on-portal"
                                onClick={(e) => e.stopPropagation()} // Prevents dropdown from closing
                            >
                                Update here on portal
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `dropdown-item sidebar-link ${isActive ? 'active-sidebar-link' : ''}`
                                }
                                to="/products"
                                style={{ textWrap: 'auto', padding: "5px 5px" }}
                                onClick={(e) => e.stopPropagation()} // Prevents dropdown from closing
                            >
                                My Product
                            </NavLink>
                        </li>
                    </ul>
                </li>
                <li className='sidebar-list-item'>
                    <NavLink
                        className={({ isActive }) =>
                            `d-flex align-items-center sidebar-link ${isActive ? 'active-sidebar-link' : ''}`
                        }
                        to="/orders"
                    >
                        <MdLock className='icon' color='#1F8505' /> Orders
                    </NavLink>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="" className='sidebar-link'>
                        <FaHandHoldingUsd className='icon' color='#1F8505' /> Payments
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="" className='sidebar-link'>
                        <TbReportSearch className='icon' color='#1F8505' /> Reports
                    </Link>
                </li>
                <li className='sidebar-list-item side-item-disable'>
                    <Link to="" className='sidebar-link'>
                        <RiDiscountPercentFill className='icon' color='#1F8505' /> Discount
                    </Link>
                </li>
                <li className='sidebar-list-item side-item-disable'>
                    <Link to="" className='sidebar-link'>
                        <RiDiscountPercentFill className='icon' color='#1F8505' /> Offer and Coupon
                    </Link>
                </li>
                <li className='sidebar-list-item side-item-disable'>
                    <Link to="" className='sidebar-link'>
                        <HiUserGroup className='icon' color='#1F8505' /> Customer Mgmt
                    </Link>
                </li>
                <li className='sidebar-list-item side-item-disable'>
                    <Link to="" className='sidebar-link'>
                        <IoMdSettings className='icon' color='#1F8505' /> Account & Settings
                    </Link>
                </li>

            </ul>
        </aside>
    );
}

export default AdminSidebar;