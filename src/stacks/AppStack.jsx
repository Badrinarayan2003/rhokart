import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import Home from "../screen/app/home/Home";
import Products from "../screen/app/products/Products";
import '../AppStack.css';
import AdminHeader from "../components/adminHeader/AdminHeader";
import AdminSidebar from "../components/adminSidebar/AdminSidebar";
import BulkUploadOrUpdate from "../screen/app/inventoryAndPricing/BulkUploadOrUpdate";
import UpdateOnPortal from "../screen/app/inventoryAndPricing/UpdateOnPortal";
import Orders from "../screen/app/orders/Orders";
import OrderDetails from "../screen/app/orderDetails/OrderDetails";
import Payments from "../screen/app/payments/Payments";


const AppStack = () => {

    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    return (

        <div className="grid-container">
            <AdminHeader OpenSidebar={OpenSidebar} />
            <AdminSidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
            />

            <main className="main-container">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/bulk-upload-update" element={<BulkUploadOrUpdate />} />
                    <Route path="/update-on-portal" element={<UpdateOnPortal />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/order-details" element={<OrderDetails />} />
                    <Route path="/payment-overview" element={<Payments />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </main>
        </div>
    )
}

export default AppStack;