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

import { Link } from 'react-router-dom';
import { logo2 } from '../../assets/assets';

function AdminSidebar({ openSidebarToggle, OpenSidebar }) {
    const sidebarRef = useRef(null);

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
                    <Link className='d-flex align-items-center' style={{ width: "auto" }} to="/home">
                        <IoHomeSharp className='icon' color='#1F8505' /> Home
                    </Link>
                </li>
                <li className='sidebar-list-item dropdown side-item-disable'>
                    <a
                        href="#"
                        className="dropdown-toggle d-flex align-items-center"
                        id="productsDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <SlBookOpen className='icon' color='#1F8505' />Listings and catalog
                    </a>
                    <ul className="dropdown-menu" style={{ width: '100%' }} aria-labelledby="productsDropdown">
                        <li>
                            <Link className="dropdown-item sidebar-link" style={{ textWrap: 'auto', padding: "5px 5px" }} to="">Search for an existing product on the platform</Link>
                        </li>
                        <li>
                            <Link className="dropdown-item sidebar-link" style={{ textWrap: 'auto', padding: "5px 5px" }} to="">Download excel template for respective category </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item sidebar-link" style={{ textWrap: 'auto', padding: "5px 5px" }} to="">List new products
                                (Through bulk excel upload) </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item sidebar-link" style={{ textWrap: 'auto', padding: "5px 5px" }} to="">List new products
                                (Individual one by one) </Link>
                        </li>
                    </ul>
                </li>

                <li className='sidebar-list-item dropdown'>
                    <a
                        href="#"
                        className="dropdown-toggle d-flex align-items-center"
                        id="productsDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <LuNotebookPen className='icon' color='#1F8505' />Inventory & Pricing
                    </a>
                    <ul className="dropdown-menu" style={{ width: '100%' }} aria-labelledby="productsDropdown">
                        <li>
                            <Link className="dropdown-item" style={{ textWrap: 'auto', padding: "5px 5px" }} to="/bulk-upload-update">Bulk upload / Update</Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" style={{ textWrap: 'auto', padding: "5px 5px" }} to="/update-on-portal">Update here on portal</Link>
                        </li>
                    </ul>
                </li>

                <li className='sidebar-list-item'>
                    <Link to="/transactions">
                        <MdLock className='icon' color='#1F8505' /> Orders
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/transactions">
                        <FaHandHoldingUsd className='icon' color='#1F8505' /> Payments
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/transactions">
                        <TbReportSearch className='icon' color='#1F8505' /> Reports
                    </Link>
                </li>
                <li className='sidebar-list-item side-item-disable'>
                    <Link to="/home">
                        <RiDiscountPercentFill className='icon' color='#1F8505' /> Discount
                    </Link>
                </li>
                <li className='sidebar-list-item side-item-disable'>
                    <Link to="/home" >
                        <RiDiscountPercentFill className='icon' color='#1F8505' /> Offer and Coupon
                    </Link>
                </li>
                <li className='sidebar-list-item side-item-disable'>
                    <Link to="/home">
                        <HiUserGroup className='icon' color='#1F8505' /> Customer Mgmt
                    </Link>
                </li>
                <li className='sidebar-list-item side-item-disable'>
                    <Link to="/home">
                        <IoMdSettings className='icon' color='#1F8505' /> Account & Settings
                    </Link>
                </li>

            </ul>
        </aside>
    );
}

export default AdminSidebar;